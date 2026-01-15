"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const FILTERS = {
    tier: ["Exotic", "Top Shelf", "Premium", "Small Bud"],
    type: ["Indica", "Sativa", "Hybrid"],
    availability: ["Available", "Low", "Out"],
};

export function FilterBar() {
    const { filters, toggleFilter, setFilter, sortBy, setSortBy } = useStore();

    return (
        <div className="w-full overflow-x-auto py-4 no-scrollbar border-b border-border bg-background sticky top-16 z-40">
            <div className="container mx-auto px-4 flex items-center gap-2 min-w-max">
                <span className="text-xs text-muted-foreground font-medium mr-2">FILTERS</span>

                {/* Tier Filters */}
                {FILTERS.tier.map((tier) => {
                    const isActive = filters.tier.includes(tier);
                    return (
                        <button
                            key={tier}
                            onClick={() => toggleFilter("tier", tier)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                            )}
                        >
                            {tier}
                        </button>
                    );
                })}

                <div className="w-px h-6 bg-border mx-2" />

                <span className="text-xs text-muted-foreground font-medium mr-2">SORT</span>

                {/* Sort Options */}
                <button
                    onClick={() => setSortBy("price-asc")}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        sortBy === "price-asc"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                    )}
                >
                    Price Low
                </button>
                <button
                    onClick={() => setSortBy("price-desc")}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        sortBy === "price-desc"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                    )}
                >
                    Price High
                </button>

                {/* Reset */}
                {(filters.tier.length > 0 || filters.search) && (
                    <button
                        onClick={() => {
                            setFilter("tier", []);
                            setFilter("search", "");
                            setSortBy("price-asc");
                        }}
                        className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3 h-3" /> CLEAR
                    </button>
                )}
            </div>
        </div>
    );
}
