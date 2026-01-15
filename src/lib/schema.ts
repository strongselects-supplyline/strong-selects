import { z } from "zod";

// Base schema matching the CSV columns strictly
// We process dirty CSV strings into clean types here
export const ProductSchema = z.object({
    tier: z.string().default("Unknown"),
    strain_name: z.string().min(1, "Name is required"),
    batch_ID: z.string().default(""),
    type: z.enum(["Indica", "Sativa", "Hybrid", ""]).or(z.string()).transform(val => val || "Hybrid"),
    ratio: z.string().default(""),
    lineage: z.string().default(""),
    effects: z.string().default(""),
    coa_total_pct: z.string().default(""), // Keep as string for display "28%" or convert to number if needed

    // Media
    media_video_url: z.string().optional(),
    media_photo_urls: z.string().optional(), // Comma separated
    photo_url: z.string().optional(),
    video_url: z.string().optional(),
    coa_url: z.string().optional(),

    // Internal Costs - these should ideally be STRIPPED by the server proxy
    // We define them here to allow validation if present, but we will strip them next
    cost_lb: z.string().optional(),
    cost_oz: z.string().optional(),
    market_lb: z.string().optional(),

    notes: z.string().default(""),
    source_note: z.string().optional(),

    // Quantities & Pricing
    live_qty_g: z.coerce.number().default(0),
    advertised_g: z.string().default(""),
    unit: z.string().default(""),
    unit_qty: z.coerce.number().default(0),
    ppgI: z.string().optional(),
    price_lb: z.coerce.number().optional(),
    price_qp: z.coerce.number().optional(),
    price_oz: z.coerce.number().optional(),

    threshold_over_g: z.coerce.number().optional(),

    color: z.string().optional(),
    last_updated: z.string().optional(),
});

// Derived type for frontend usage (after stripping costs)
export type Product = z.infer<typeof ProductSchema>;

export const CatalogSchema = z.array(ProductSchema);
