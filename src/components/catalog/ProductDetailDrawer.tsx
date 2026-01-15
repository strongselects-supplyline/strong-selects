"use client";

import { Product } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star, ShieldCheck, Info } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { useState } from "react";

interface ProductDetailDrawerProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailDrawer({ product, open, onOpenChange }: ProductDetailDrawerProps) {
    const addToCart = useStore((state) => state.addToCart);
    const [qty, setQty] = useState(1);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, qty);
        setQty(1);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl border-l border-white/10 bg-background/95 backdrop-blur-xl p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 h-full">
                    <div className="relative w-full aspect-square sm:aspect-video bg-secondary">
                        <Image
                            src={product.imageUrl}
                            alt={product.itemName}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-6 right-6">
                            <div className="flex items-center gap-2 mb-2">
                                {product.badge && (
                                    <Badge variant="default" className="bg-primary text-primary-foreground">{product.badge}</Badge>
                                )}
                                <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/20 text-white">
                                    {product.category}
                                </Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">{product.itemName}</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Key Specs */}
                        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30 border border-white/5">
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Price</p>
                                <p className="text-xl font-mono font-medium">${product.price}</p>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Score</p>
                                <div className="flex items-center justify-center gap-1 text-xl font-mono font-medium text-primary">
                                    <span>{product.score}</span>
                                    <Star className="h-4 w-4 fill-primary" />
                                </div>
                            </div>
                            <div className="text-center border-l border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Size</p>
                                <p className="text-xl font-mono font-medium">{product.size}</p>
                            </div>
                        </div>

                        {/* Description / Notes */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                Item Notes
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.notes}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {product.profileTags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Tier Pricing */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Tier Pricing</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {product.tierPricing.map((tier, idx) => (
                                    <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-md border border-white/10 bg-secondary/20">
                                        <span className="text-sm text-muted-foreground">Qty {tier.qty}+</span>
                                        <span className="text-lg font-mono font-medium">${tier.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Documentation */}
                        <div className="flex items-center justify-between p-4 rounded-md border border-white/10 bg-secondary/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Authentication</p>
                                    <p className="text-xs text-muted-foreground">Verified documentation available</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <a href={product.documentationUrl} target="_blank" rel="noopener noreferrer">
                                    View Docs
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-white/10 bg-background/95 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-secondary/50 p-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setQty(Math.max(1, qty - 1))}
                            >
                                -
                            </Button>
                            <span className="w-8 text-center font-mono">{qty}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setQty(qty + 1)}
                            >
                                +
                            </Button>
                        </div>
                        <Button className="flex-1 bg-primary text-white hover:bg-primary/90 h-10" onClick={handleAddToCart}>
                            Add to Request - ${(product.price * qty).toLocaleString()}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
