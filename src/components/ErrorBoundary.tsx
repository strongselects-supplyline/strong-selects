"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-serif text-foreground mb-2">Something went wrong</h1>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        We encountered an unexpected error. This might be due to a temporary glitch.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reload Application
                    </button>
                    {this.state.error && (
                        <div className="mt-8 p-4 bg-secondary/50 rounded-lg max-w-full overflow-auto text-left">
                            <code className="text-xs font-mono text-red-400">
                                {this.state.error.message}
                            </code>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
