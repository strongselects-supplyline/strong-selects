"use client";

import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";
import { cn, getDirectImageUrl } from "@/lib/utils";
import { X, ExternalLink, Plus, Minus, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { CartItem } from "@/lib/types";

export function ProductDrawer() {
    const {
        productDrawerOpen,
        closeProductDrawer,
        selectedProduct,
        addToCart
    } = useStore();

    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState<"oz" | "qp" | "lb">("lb");
    const [notes, setNotes] = useState("");

    // Reset local state when product opens
    useEffect(() => {
        if (selectedProduct) {
            setQty(1);
            setUnit("lb"); // Default
            setNotes("");
        }
    }, [selectedProduct]);

    if (!selectedProduct) return null;

    const product = selectedProduct;

    // Image Gallery Logic
    const rawImages = (product.media_photo_urls || "").split(",").map(s => s.trim()).filter(Boolean);
    if (product.photo_url) rawImages.unshift(product.photo_url);

    const displayImages = rawImages.map(url => getDirectImageUrl(url)).filter(Boolean) as string[];

    const handleAddToRequest = () => {
        const price =
            unit === "oz" ? product.price_oz :
                unit === "qp" ? product.price_qp :
                    product.price_lb;

        if (!price) return; // Should handle this case in UI (disable button)

        const item: CartItem = {
            product,
            quantity: qty,
            unit,
            price,
            notes
        };
        addToCart(item);
        closeProductDrawer();
    };

    const currentPrice =
        unit === "oz" ? product.price_oz :
            unit === "qp" ? product.price_qp :
                product.price_lb;

    return (
        <Sheet open={productDrawerOpen} onOpenChange={(open) => !open && closeProductDrawer()}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-xl p-0 border-l border-border text-foreground flex flex-col"
                style={{ backgroundColor: '#0a0a0a' }}
            >

                {/* Close Button Overlay */}
                <button
                    onClick={closeProductDrawer}
                    className="absolute top-4 right-4 z-50 p-2 bg-background/50 hover:bg-muted rounded-full backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5 text-foreground" />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Hero Image / Gallery */}
                    <div className="relative aspect-video w-full bg-muted">
                        {displayImages.length > 0 ? (
                            <Image
                                src={displayImages[0]}
                                alt={product.strain_name}
                                fill
                                className="object-cover"
                                onError={(e) => { e.currentTarget.src = "/available_now_platinum.png"; }}
                            />
                        ) : (
                            <Image
                                src="/available_now_platinum.png"
                                alt="Photo pending"
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />

                        <div className="absolute bottom-4 left-4">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                                    {product.tier}
                                </span>
                                {product.type && (
                                    <span className="px-2 py-0.5 rounded border border-border bg-background/40 backdrop-blur-sm text-xs text-foreground uppercase tracking-wider">
                                        {product.type}
                                    </span>
                                )}
                            </div>
                            <h2 className="font-serif text-3xl font-medium text-foreground shadow-black drop-shadow-lg">
                                {product.strain_name}
                            </h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary rounded-lg p-3 border border-border/50">
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total THC</div>
                                <div className="text-xl font-mono text-primary">{product.coa_total_pct || "N/A"}</div>
                            </div>
                            {/* Availability Box */}
                            <div className="bg-secondary rounded-lg p-3 border border-border/50">
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Availability</div>
                                <div className={cn(
                                    "text-lg sm:text-xl font-mono",
                                    product.live_qty_g <= 0 ? "text-red-500" :
                                        product.live_qty_g < 100 ? "text-orange-500" :
                                            product.live_qty_g < 448 ? "text-yellow-500" :
                                                "text-primary"
                                )}>
                                    {product.live_qty_g <= 0 ? "SOLD OUT" :
                                        product.live_qty_g < 448 ? (
                                            <>
                                                <span className="block">LOW</span>
                                                <span className="text-sm opacity-70">≈{(product.live_qty_g / 453.6).toFixed(1)} lb</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="block">IN STOCK</span>
                                                <span className="text-sm opacity-70">≈{(product.live_qty_g / 453.6).toFixed(1)} lb</span>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Description - only show sections with actual content */}
                        <div className="space-y-4">
                            {product.lineage && product.lineage.trim() !== "" && product.lineage !== "—" && product.lineage !== "-" && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lineage</h3>
                                    <p className="text-foreground/90 font-serif text-base sm:text-lg leading-relaxed">{product.lineage}</p>
                                </div>
                            )}
                            {product.effects && product.effects.trim() !== "" && product.effects !== "—" && product.effects !== "-" && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Effects</h3>
                                    <p className="text-sm text-foreground/70">{product.effects}</p>
                                </div>
                            )}
                            {product.notes && product.notes.trim() !== "" && product.notes !== "—" && product.notes !== "-" && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Notes</h3>
                                    <p className="text-sm text-foreground/70 italic">{product.notes}</p>
                                </div>
                            )}
                            {product.coa_url && (
                                <a
                                    href={product.coa_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors mt-2"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    View COA Report <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        {/* Pricing Table */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block border-b border-border pb-2">Volume Pricing</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className={cn("p-3 rounded border text-center transition-colors cursor-pointer", unit === "oz" ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:bg-secondary")} onClick={() => setUnit("oz")}>
                                    <div className={cn("text-[10px] uppercase", unit === "oz" ? "text-primary/70" : "text-muted-foreground")}>Single oz</div>
                                    <div className="text-lg font-medium">${product.price_oz || "--"}</div>
                                </div>
                                <div className={cn("p-3 rounded border text-center transition-colors cursor-pointer", unit === "qp" ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:bg-secondary")} onClick={() => setUnit("qp")}>
                                    <div className={cn("text-[10px] uppercase", unit === "qp" ? "text-primary/70" : "text-muted-foreground")}>QP</div>
                                    <div className="text-lg font-medium">${product.price_qp || "--"}</div>
                                </div>
                                <div className={cn("p-3 rounded border text-center transition-colors cursor-pointer", unit === "lb" ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:bg-secondary")} onClick={() => setUnit("lb")}>
                                    <div className={cn("text-[10px] uppercase", unit === "lb" ? "text-primary/70" : "text-muted-foreground")}>LB</div>
                                    <div className="text-lg font-medium">${product.price_lb || "--"}</div>
                                    {product.price_lb && <div className="text-[9px] text-muted-foreground mt-0.5">${(product.price_lb / 16).toFixed(0)}/oz</div>}
                                </div>
                            </div>
                            {/* Low Stock Discount Callout */}
                            {product.live_qty_g < 448 && product.live_qty_g > 0 && (
                                <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                                    <span className="text-primary font-bold text-sm">🔥 10% OFF — Low Stock Special</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Add to Cart Footer */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Quantity ({unit})</span>
                        <div className="flex items-center gap-3 bg-secondary rounded-full px-2 py-1 border border-border shadow-sm">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-primary text-foreground"><Minus className="w-4 h-4" /></button>
                            <span className="w-8 text-center font-mono text-foreground">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-primary text-foreground"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Line notes (optional)"
                        className="w-full bg-secondary border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase">Total Est.</span>
                            <span className="text-2xl font-serif text-primary">
                                ${(currentPrice || 0) * qty}
                            </span>
                        </div>
                        <button
                            onClick={handleAddToRequest}
                            disabled={!currentPrice || product.live_qty_g <= 0}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Request
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
