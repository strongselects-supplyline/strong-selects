"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { Minus, Plus, Trash2, Send, X } from "lucide-react";
import { getDirectImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
    const { isCartOpen, toggleCart, cart, updateQuantity, removeFromCart } = useStore();
    const [step, setStep] = useState<"cart" | "form">("cart");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");

    const [formData, setFormData] = useState({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        notes: ""
    });

    const totalCost = cart.reduce((sum, item) => {
        const product = item.product;
        // Logic to determine price based on unit
        const price = item.unit === "lb" ? product.price_lb : item.unit === "qp" ? product.price_qp : product.price_oz;
        return sum + (price || 0) * item.quantity;
    }, 0);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const summary = `
STRONG SELECTS ORDER REQUEST
---------------------------
Business: ${formData.businessName}
Contact: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}

ORDER ITEMS:
${cart.map(item => `- ${item.product.strain_name} (${item.product.type})
  Qty: ${item.quantity} ${item.unit}
  Price: $${item.unit === "lb" ? item.product.price_lb : item.unit === "qp" ? item.product.price_qp : item.product.price_oz}
`).join("\n")}

Approx Total: $${totalCost}

Notes: ${formData.notes}
        `.trim();

        // Submit to Google Sheets via API
        try {
            const res = await fetch("/api/submit-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessName: formData.businessName,
                    contactName: formData.contactName,
                    email: formData.email,
                    phone: formData.phone,
                    cart: cart,
                    total: totalCost,
                    notes: formData.notes
                })
            });

            if (res.ok) {
                setSubmitStatus("success");
                // Clear cart after success
                setTimeout(() => {
                    useStore.getState().clearCart();
                    toggleCart(false);
                    setSubmitStatus("idle");
                    setStep("cart");
                    setFormData({ businessName: "", contactName: "", email: "", phone: "", notes: "" });
                }, 3000);
            } else {
                const errorData = await res.json();
                throw new Error(errorData.details || "Submission failed");
            }
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(`Failed to submit: ${error.message}. (Build: 3d56ead). Please check if the Google Sheet is shared with the service account.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === "success") {
        return (
            <Sheet open={isCartOpen} onOpenChange={(open) => toggleCart(open)}>
                <SheetContent
                    className="w-full sm:max-w-md border-l border-border text-foreground flex flex-col items-center justify-center text-center p-8"
                    style={{ backgroundColor: '#0a0a0a' }}
                >
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-serif mb-2">Request Sent</h2>
                    <p className="text-muted-foreground">
                        We have received your order request. A rep will verify inventory and email you an invoice shortly.
                    </p>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => toggleCart(open)}>
            <SheetContent
                className="w-full sm:max-w-md border-l border-border text-foreground p-0 flex flex-col h-full"
                style={{ backgroundColor: '#0a0a0a' }}
            >
                <SheetHeader className="p-6 border-b border-border shrink-0">
                    <SheetTitle className="text-xl font-serif text-foreground flex items-center gap-2">
                        Your Request
                        <span className="text-primary text-sm font-sans font-normal ml-auto">
                            {cart.length} Items
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <p>Your request list is empty</p>
                            <button
                                onClick={() => toggleCart(false)}
                                className="text-primary hover:underline text-sm"
                            >
                                Browse Catalog
                            </button>
                        </div>
                    ) : (
                        <>
                            {step === "cart" ? (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={`${item.product.strain_name}-${item.unit}`} className="flex gap-4">
                                            <div className="w-16 h-16 relative rounded overflow-hidden bg-secondary shrink-0">
                                                <Image
                                                    src={getDirectImageUrl(item.product.photo_url || item.product.media_photo_urls?.split(",")[0]) || "/preorder_placeholder.png"}
                                                    alt={item.product.strain_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-medium text-sm">{item.product.strain_name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.product.strain_name, item.unit)}
                                                        className="text-muted-foreground hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-2">
                                                    {item.unit.toUpperCase()} @ ${item.unit === "lb" ? item.product.price_lb : item.unit === "qp" ? item.product.price_qp : item.product.price_oz}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.strain_name, item.unit, Math.max(1, item.quantity - 1))}
                                                        className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.strain_name, item.unit, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t border-border pt-4">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span>Est. Total</span>
                                            <span className="font-mono text-lg text-primary">${totalCost}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form id="request-form" onSubmit={handleRequest} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Name</label>
                                        <input
                                            required
                                            className="w-full bg-secondary/50 border border-border rounded p-2 text-sm focus:border-primary outline-none"
                                            value={formData.businessName}
                                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                            placeholder="Dispensary / Brand Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Name</label>
                                        <input
                                            required
                                            className="w-full bg-secondary/50 border border-border rounded p-2 text-sm focus:border-primary outline-none"
                                            value={formData.contactName}
                                            onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-secondary/50 border border-border rounded p-2 text-sm focus:border-primary outline-none"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="name@company.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full bg-secondary/50 border border-border rounded p-2 text-sm focus:border-primary outline-none"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes (Optional)</label>
                                        <textarea
                                            className="w-full bg-secondary/50 border border-border rounded p-2 text-sm focus:border-primary outline-none min-h-[100px]"
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Delivery preference, specific batch requests, etc."
                                        />
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-border shrink-0" style={{ backgroundColor: '#0a0a0a' }}>
                        {step === "cart" ? (
                            <button
                                onClick={() => setStep("form")}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm"
                            >
                                Secure Request
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep("cart")}
                                    disabled={isSubmitting}
                                    className="px-4 border border-border rounded hover:bg-secondary text-sm font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    form="request-form"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-primary text-primary-foreground font-bold py-3 px-4 rounded hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>Sending...</>
                                    ) : (
                                        <>Submit Request <Send className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
