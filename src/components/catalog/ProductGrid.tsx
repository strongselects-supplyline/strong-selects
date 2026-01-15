"use client";

import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { useEffect } from "react";
import { fetchCatalog } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function ProductGrid() {
    const {
        catalog,
        setCatalog,
        isLoading,
        setIsLoading,
        filters,
        sortBy
    } = useStore();

    // Initial Fetch
    useEffect(() => {
        async function init() {
            setIsLoading(true);
            const data = await fetchCatalog();
            setCatalog(data);
            setIsLoading(false);
        }
        init();
    }, [setCatalog, setIsLoading]);

    // Filtering & Sorting Logic
    const filteredCatalog = catalog.filter(product => {
        // 1. Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            const match =
                product.strain_name.toLowerCase().includes(q) ||
                product.type.toLowerCase().includes(q) ||
                product.tier.toLowerCase().includes(q);
            if (!match) return false;
        }

        // 2. Tier
        if (filters.tier.length > 0 && !filters.tier.includes(product.tier)) {
            return false;
        }

        // 3. Type
        if (filters.type.length > 0 && !filters.type.includes(product.type)) {
            return false;
        }

        // 4. Availability - mapped from text to live_qty logic if needed, 
        // but for now let's assume we might filter by status. 
        // The prompt requirement implies chips for Availability status.
        // We need to compute status for each product to check against filter.
        if (filters.availability.length > 0) {
            const status =
                product.live_qty_g <= 0 ? "Out" :
                    (product.threshold_over_g && product.live_qty_g < product.threshold_over_g) ? "Low" :
                        "Available";
            if (!filters.availability.includes(status)) {
                return false;
            }
        }

        return true;
    });

    // Sorting
    const sortedCatalog = [...filteredCatalog].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return (a.price_oz || 0) - (b.price_oz || 0);
            case "price-desc":
                return (b.price_oz || 0) - (a.price_oz || 0);
            case "tier-asc":
                return a.tier.localeCompare(b.tier);
            case "newest":
            default:
                // Assuming last_updated is a date string or we fallback to 0
                return new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime();
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-white/40 text-sm animate-pulse">Loading Catalog...</p>
            </div>
        );
    }

    if (sortedCatalog.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl text-muted-foreground font-serif mb-2">No items found</p>
                <p className="text-sm text-muted-foreground/50">Try adjusting your filters or search.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedCatalog.map((product, idx) => (
                    <ProductCard key={`${product.strain_name}-${idx}`} product={product} />
                ))}
            </div>
            <div className="mt-12 text-center text-xs text-muted-foreground">
                Showing {sortedCatalog.length} of {catalog.length} items
            </div>
        </div>
    );
}
