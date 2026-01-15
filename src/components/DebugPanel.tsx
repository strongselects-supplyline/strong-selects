"use client";

import { useStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function DebugPanel() {
    const searchParams = useSearchParams();
    const showDebug = searchParams.get("debug") === "1";
    const { catalog, isLoading } = useStore();
    const [domNodes, setDomNodes] = useState(0);

    useEffect(() => {
        if (!showDebug) return;
        const interval = setInterval(() => {
            setDomNodes(document.getElementsByTagName("*").length);
        }, 2000);
        return () => clearInterval(interval);
    }, [showDebug]);

    if (!showDebug) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 border border-white/10 p-4 rounded-lg font-mono text-xs text-green-400 shadow-2xl pointer-events-none">
            <h3 className="font-bold border-b border-white/20 pb-1 mb-2">DEBUG MODE</h3>
            <div className="space-y-1">
                <div className="flex justify-between gap-4">
                    <span className="text-white/50">Catalog Size:</span>
                    <span>{catalog.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-white/50">Loading:</span>
                    <span>{String(isLoading)}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-white/50">DOM Nodes:</span>
                    <span className={domNodes > 1500 ? "text-red-500 animate-pulse" : ""}>{domNodes}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-white/50">Details Loaded:</span>
                    <span>{document.querySelectorAll('img').length}imgs</span>
                </div>
            </div>
        </div>
    );
}
