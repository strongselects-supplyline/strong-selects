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

                {/* Type Filters */}
                {FILTERS.type.map((type) => {
                    const isActive = filters.type.includes(type);
                    return (
                        <button
                            key={type}
                            onClick={() => toggleFilter("type", type)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                                isActive
                                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                    : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80 hover:text-foreground"
                            )}
                        >
                            {type}
                        </button>
                    );
                })}

                {/* Reset */}
                {(filters.type.length > 0 || filters.search) && (
                    <button
                        onClick={() => {
                            setFilter("type", []);
                            setFilter("search", "");
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
