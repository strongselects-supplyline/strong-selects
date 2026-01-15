import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DebugPanel } from "@/components/DebugPanel";
import { Suspense } from "react";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strong Selects | Wholesale Catalog",
  description: "Premium members-only wholesale catalog",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  themeColor: "#d4af37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Strong Selects",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
        style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
