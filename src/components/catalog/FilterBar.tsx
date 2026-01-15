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
    const { filters, toggleFilter, setFilter } = useStore();

    return (
        <div className="w-full overflow-x-auto py-4 no-scrollbar border-b border-white/5 bg-black/50 backdrop-blur-sm sticky top-16 z-40">
            <div className="container mx-auto px-4 flex items-center gap-2 min-w-max">
                <span className="text-xs text-white/40 font-medium mr-2">FILTERS</span>

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
                                    ? "bg-primary text-black border-primary"
                                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {tier}
                        </button>
                    );
                })}

                <div className="w-px h-6 bg-white/10 mx-2" />

                {/* Type Filters */}
                {FILTERS.type.map((type) => {
                    const isActive = filters.type.includes(type);
                    return (
                        <button
                            key={type}
                            onClick={() => toggleFilter("type", type)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                isActive
                                    ? "bg-primary text-black border-primary"
                                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {type}
                        </button>
                    );
                })}

                <div className="w-px h-6 bg-white/10 mx-2" />

                {/* Reset */}
                {(filters.tier.length > 0 || filters.type.length > 0 || filters.search) && (
                    <button
                        onClick={() => {
                            setFilter("tier", []);
                            setFilter("type", []);
                            setFilter("search", "");
                        }}
                        className="ml-auto flex items-center gap-1 text-[10px] text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" /> CLEAR
                    </button>
                )}
            </div>
        </div>
    );
}
