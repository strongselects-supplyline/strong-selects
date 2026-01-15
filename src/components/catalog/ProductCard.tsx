"use client";

import { Product } from "@/lib/schema";
import { useStore } from "@/lib/store";
import { cn, getDirectImageUrl } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { openProductDrawer } = useStore();

    // Helper to determine status color
    const statusColor =
        product.live_qty_g <= 0 ? "text-red-500 border-red-500/20 bg-red-500/10" :
            (product.threshold_over_g && product.live_qty_g < product.threshold_over_g) ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" :
                "text-primary border-primary/20 bg-primary/10";

    const statusLabel =
        product.live_qty_g <= 0 ? "OUT OF STOCK" :
            (product.threshold_over_g && product.live_qty_g < product.threshold_over_g) ? "LOW STOCK" :
                "AVAILABLE";

    // Image Logic
    const rawImage = product.photo_url || product.media_photo_urls?.split(",")[0];
    const mainImage = getDirectImageUrl(rawImage);

    return (
        <div
            onClick={() => openProductDrawer(product)}
            className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Area */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={product.strain_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground/50 text-xs uppercase tracking-widest font-bold">
                        No Image
                    </div>
                )}

                {/* Tier Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold tracking-wider text-foreground">
                    {product.tier}
                </div>

                {/* Status Badge */}
                <div className={cn(
                    "absolute top-2 right-2 px-2 py-1 rounded border text-[10px] font-bold tracking-wider",
                    statusColor
                )}>
                    {statusLabel}
                </div>
            </div>

            {/* Info Area */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-serif text-lg text-foreground leading-tight">{product.strain_name}</h3>
                    {product.type && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground uppercase">
                            {product.type}
                        </span>
                    )}
                </div>

                <div className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {product.ratio && <span className="mr-2">{product.ratio}</span>}
                    {product.lineage}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
                    <div className="text-center">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Per Oz</div>
                        <div className="text-sm font-medium text-foreground">${product.price_oz || "--"}</div>
                    </div>
                    <div className="text-center border-l border-border">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">QP</div>
                        <div className="text-sm font-medium text-foreground">${product.price_qp || "--"}</div>
                    </div>
                    <div className="text-center border-l border-border">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">LB</div>
                        <div className="text-sm font-medium text-foreground">${product.price_lb || "--"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
