"use client";

import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, ExternalLink, Plus, Minus } from "lucide-react";
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
    const images = (product.media_photo_urls || "").split(",").filter(Boolean);
    if (product.photo_url) images.unshift(product.photo_url);
    const displayImages = images.length > 0 ? images : null;

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
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-l border-white/10 bg-black/95 backdrop-blur-xl text-white overflow-y-auto">

                {/* Close Button Overlay */}
                <button
                    onClick={closeProductDrawer}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Hero Image / Gallery */}
                <div className="relative aspect-video w-full bg-black">
                    {displayImages ? (
                        <Image
                            src={displayImages[0]}
                            alt={product.strain_name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-white/20">NO IMAGE</div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />

                    <div className="absolute bottom-4 left-4">
                        <div className="flex gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-primary text-black text-xs font-bold uppercase tracking-wider">
                                {product.tier}
                            </span>
                            {product.type && (
                                <span className="px-2 py-0.5 rounded border border-white/20 bg-black/40 backdrop-blur-sm text-xs text-white uppercase tracking-wider">
                                    {product.type}
                                </span>
                            )}
                        </div>
                        <h2 className="font-serif text-3xl font-medium text-white shadow-black drop-shadow-lg">
                            {product.strain_name}
                        </h2>
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total THC</div>
                            <div className="text-xl font-mono text-primary">{product.coa_total_pct || "N/A"}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Availability</div>
                            <div className="text-xl font-mono">{product.live_qty_g > 0 ? "IN STOCK" : "OUT"}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        {product.lineage && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">Lineage</h3>
                                <p className="text-white/80 font-serif text-lg leading-relaxed">{product.lineage}</p>
                            </div>
                        )}
                        {product.effects && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">Effects</h3>
                                <p className="text-sm text-white/60">{product.effects}</p>
                            </div>
                        )}
                        {product.notes && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-1">Notes</h3>
                                <p className="text-sm text-white/60 italic">{product.notes}</p>
                            </div>
                        )}
                        {product.coa_url && (
                            <a
                                href={product.coa_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs text-primary hover:underline mt-2"
                            >
                                View COA Report <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    {/* Pricing Table */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3 block border-b border-white/10 pb-2">Pricing Breakdown</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className={cn("p-3 rounded border border-white/5 text-center transition-colors cursor-pointer", unit === "oz" ? "bg-primary/20 border-primary" : "bg-white/5 hover:bg-white/10")} onClick={() => setUnit("oz")}>
                                <div className="text-[10px] uppercase text-white/50">Per Oz</div>
                                <div className="text-lg font-medium">${product.price_oz || "--"}</div>
                            </div>
                            <div className={cn("p-3 rounded border border-white/5 text-center transition-colors cursor-pointer", unit === "qp" ? "bg-primary/20 border-primary" : "bg-white/5 hover:bg-white/10")} onClick={() => setUnit("qp")}>
                                <div className="text-[10px] uppercase text-white/50">QP</div>
                                <div className="text-lg font-medium">${product.price_qp || "--"}</div>
                            </div>
                            <div className={cn("p-3 rounded border border-white/5 text-center transition-colors cursor-pointer", unit === "lb" ? "bg-primary/20 border-primary" : "bg-white/5 hover:bg-white/10")} onClick={() => setUnit("lb")}>
                                <div className="text-[10px] uppercase text-white/50">LB</div>
                                <div className="text-lg font-medium">${product.price_lb || "--"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Area */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Quantity ({unit})</span>
                            <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/10">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
                                <span className="w-8 text-center font-mono">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Line notes (optional)"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/40 uppercase">Total Est.</span>
                                <span className="text-2xl font-serif text-primary">
                                    ${(currentPrice || 0) * qty}
                                </span>
                            </div>
                            <button
                                onClick={handleAddToRequest}
                                disabled={!currentPrice || product.live_qty_g <= 0}
                                className="bg-primary hover:bg-primary/90 text-black font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Request
                            </button>
                        </div>
                    </div>

                    <div className="h-20" /> {/* Spacer */}
                </div>
            </SheetContent>
        </Sheet>
    );
}
