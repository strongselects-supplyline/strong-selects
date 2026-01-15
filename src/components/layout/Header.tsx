"use client";

import Image from "next/image";
import { Search, Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function Header() {
    const { filters, setFilter, toggleCart, cart } = useStore();
    const [searchValue, setSearchValue] = useState(filters.search);
    const { theme, setTheme } = useTheme();

    // Simple debounce implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter("search", searchValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchValue, setFilter]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative h-10 w-10 overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Strong Selects"
                            fill
                            className="object-contain dark:invert"
                            priority
                        />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <h1 className="font-serif text-lg leading-none tracking-wide text-foreground">STRONG SELECTS</h1>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wholesale Catalog</span>
                    </div>
                </div>

                {/* Search Bar - Centeredish */}
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search strains, types..."
                        className="w-full h-10 bg-secondary/50 rounded-full pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/20"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Actions Area */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* Cart Trigger */}
                    <button
                        onClick={() => toggleCart(true)}
                        className="relative h-10 px-4 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20 cursor-pointer"
                    >
                        <span className="text-xs font-medium uppercase tracking-wider">Request</span>
                        {cart.length > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 bg-primary text-black text-[10px] font-bold rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
