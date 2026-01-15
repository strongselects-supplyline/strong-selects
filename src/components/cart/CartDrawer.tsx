"use client";

import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Trash2, Send } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getDirectImageUrl } from "@/lib/utils";

export function CartDrawer() {
    const { isCartOpen, toggleCart, cart, removeFromCart, updateCartItem, clearCart } = useStore();
    const [formData, setFormData] = useState({
        businessName: "",
        contactName: "",
        phone: "",
        email: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const totalEstimate = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        // 1. Construct the payload
        const lines = cart.map(item => {
            return `${item.product.strain_name} | ${item.product.tier} | ${item.unit} | Qty: ${item.quantity} | $${item.price} ea | Total: $${item.quantity * item.price} | Note: ${item.notes || "-"}`;
        }).join("\n");

        const summary = `
STRONG SELECTS - NEW REQUEST
---------------------------
Timestamp: ${new Date().toLocaleString()}

BUSINESS INFO:
Business: ${formData.businessName}
Contact: ${formData.contactName}
Phone: ${formData.phone}
Email: ${formData.email}
Notes: ${formData.notes}

REQUEST LINES:
${lines}

TOTAL ESTIMATE: $${totalEstimate}
    `.trim();

        // 2. Fallback to Mailto used primarily if no API endpoint
        // We try API first if configured
        const endpoint = process.env.NEXT_PUBLIC_REQUEST_ENDPOINT_URL;
        let apiSuccess = false;

        if (endpoint) {
            try {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        cart: cart,
                        summary
                    }) // Cost fields are naturally excluded as we use the frontend product object which already stripped them
                });
                if (res.ok) apiSuccess = true;
            } catch (err) {
                console.error("Submission error", err);
            }
        }

        // If API failed or not present, open mailto
        if (!apiSuccess) {
            const email = process.env.NEXT_PUBLIC_REQUEST_EMAIL || "info@strongselects.com";
            const subject = `Order Request - ${formData.businessName}`;
            const body = encodeURIComponent(summary);
            window.open(`mailto:${email}?subject=${subject}&body=${body}`);
            apiSuccess = true; // Assume success if mailto opened
        }

        setIsSubmitting(false);
        setSubmitStatus("success");

        // Optional: Clear cart after delay
        // setTimeout(clearCart, 3000); 
    };

    if (submitStatus === "success") {
        return (
            <Sheet open={isCartOpen} onOpenChange={(open) => toggleCart(open)}>
                <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-border text-foreground flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-serif text-foreground mb-2">Request Sent</h2>
                    <p className="text-muted-foreground mb-8">We have received your list and will contact you shortly to confirm availability and finalize.</p>
                    <button
                        onClick={() => {
                            clearCart();
                            setSubmitStatus("idle");
                            toggleCart(false);
                        }}
                        className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                        Start New Request
                    </button>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => toggleCart(open)}>
            <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-border text-foreground p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-border shrink-0">
                    <SheetTitle className="text-xl font-serif text-foreground flex items-center gap-2">
                        Your Request
                        <span className="text-primary text-sm font-sans font-normal ml-auto">
                            Est. ${totalEstimate}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Your list is empty.</p>
                            <button onClick={() => toggleCart(false)} className="mt-4 text-primary text-sm hover:underline">
                                Browse Catalog
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-card rounded-lg p-3 border border-border shadow-sm flex gap-3 group">
                                    {/* Tiny Image */}
                                    <div className="relative w-12 h-12 bg-muted rounded overflow-hidden shrink-0 mt-1 border border-border">
                                        {getDirectImageUrl(item.product.photo_url || item.product.media_photo_urls?.split(",")[0]) && (
                                            <img
                                                src={getDirectImageUrl(item.product.photo_url || item.product.media_photo_urls?.split(",")[0]) || ""}
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-sm truncate pr-2 text-foreground">{item.product.strain_name}</h4>
                                            <span className="text-xs font-mono text-muted-foreground">${item.price * item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <span className="bg-secondary px-1.5 rounded text-secondary-foreground">{item.unit.toUpperCase()}</span>
                                            <span>${item.price} ea</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-secondary/30 rounded px-2 py-0.5 border border-border">
                                                <button onClick={() => updateCartItem(idx, { quantity: Math.max(1, item.quantity - 1) })} className="hover:text-primary text-foreground">-</button>
                                                <span className="text-xs w-4 text-center text-foreground">{item.quantity}</span>
                                                <button onClick={() => updateCartItem(idx, { quantity: item.quantity + 1 })} className="hover:text-primary text-foreground">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(idx)} className="text-muted-foreground hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <form id="request-form" onSubmit={handleSubmit} className="space-y-4 pt-6 mt-6 border-t border-border">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Contact Info</h3>

                            <div className="grid grid-cols-1 gap-3">
                                <input required placeholder="Business Name *" className="w-full bg-secondary/10 border border-input rounded px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground"
                                    value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                />
                                <input required placeholder="Contact Name *" className="w-full bg-secondary/10 border border-input rounded px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground"
                                    value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                />
                                <input required placeholder="Phone Number *" className="w-full bg-secondary/10 border border-input rounded px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <input type="email" placeholder="Email Address (Optional)" className="w-full bg-secondary/10 border border-input rounded px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <textarea placeholder="Order Notes..." className="w-full bg-secondary/10 border border-input rounded px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none h-20 resize-none placeholder:text-muted-foreground"
                                    value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </form>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-border bg-background/80 shrink-0">
                        <button
                            type="submit"
                            form="request-form"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold uppercase tracking-wide py-3 rounded-full flex items-center justify-center gap-2 transition-all"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
                        </button>
                        <p className="text-[10px] text-center text-muted-foreground mt-3">
                            This is a request for service only. No payment is taken.
                        </p>
                    </div>
                )}

            </SheetContent>
        </Sheet>
    );
}
