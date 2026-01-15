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

    // Gram-based status logic
    const statusColor =
        product.live_qty_g <= 0 ? "text-red-500 border-red-500/20 bg-red-500/10" :
            product.live_qty_g < 100 ? "text-orange-500 border-orange-500/20 bg-orange-500/10" :
                product.live_qty_g < 448 ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" :
                    "text-primary border-primary/20 bg-primary/10";

    const statusLabel =
        product.live_qty_g <= 0 ? "SOLD OUT" :
            product.live_qty_g < 100 ? "LOW STOCK" :
                product.live_qty_g < 448 ? "LOW STOCK" :
                    "AVAILABLE";

    // Image Logic
    const rawImage = product.photo_url || product.media_photo_urls?.split(",")[0];
    const mainImage = getDirectImageUrl(rawImage);

    // Strain Color Logic
    const getStrainColor = (type?: string) => {
        const t = type?.toLowerCase() || "";
        if (t.includes("indica")) return "text-purple-400 border-purple-500/30 bg-purple-500/10";
        if (t.includes("sativa")) return "text-orange-400 border-orange-500/30 bg-orange-500/10";
        if (t.includes("hybrid")) return "text-green-400 border-green-500/30 bg-green-500/10";
        return "text-muted-foreground border-border";
    };

    const strainColorClass = getStrainColor(product.type);

    return (
        <div
            onClick={() => openProductDrawer(product)}
            className="group relative flex flex-col bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Area */}
            <div className="relative aspect-square w-full bg-secondary/30 overflow-hidden">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={product.strain_name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <Image
                        src="/preorder_placeholder.png"
                        alt="Pre Order Now"
                        fill
                        className="object-cover"
                    />
                )}

                {/* Tier Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[10px] font-bold tracking-wider text-white shadow-sm">
                    {product.tier}
                </div>

                {/* Status Badge */}
                <div className={cn(
                    "absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold tracking-wider shadow-sm",
                    statusColor
                )}>
                    {statusLabel}
                </div>
            </div>

            {/* Info Area */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-serif text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{product.strain_name}</h3>
                    {product.type && (
                        <span className={cn(
                            "shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                            strainColorClass
                        )}>
                            {product.type}
                        </span>
                    )}
                </div>

                <div className="text-xs text-muted-foreground mb-4 line-clamp-2 font-light">
                    {product.ratio && <span className="mr-2 font-medium text-foreground">{product.ratio}</span>}
                    {product.lineage}
                </div>

                <div className="mt-auto pt-3">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-0.5">Per Oz</div>
                            <div className="text-sm font-medium text-foreground">${product.price_oz || "--"}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-0.5">QP</div>
                            <div className="text-sm font-medium text-foreground">${product.price_qp || "--"}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-0.5">LB</div>
                            <div className="text-sm font-medium text-foreground">${product.price_lb || "--"}</div>
                        </div>
                    </div>

                    <button className="w-full py-2 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
