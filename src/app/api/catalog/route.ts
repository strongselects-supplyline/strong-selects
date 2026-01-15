import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { ProductSchema } from "@/lib/schema";

// Fields to strictly remove before sending to client
const BLACKLIST_FIELDS = ["cost_lb", "cost_oz", "market_lb"];

export async function GET(req: NextRequest) {
    try {
        const csvUrl = process.env.NEXT_PUBLIC_CATALOG_CSV_URL;

        if (!csvUrl) {
            return NextResponse.json(
                { error: "Configuration Error: NEXT_PUBLIC_CATALOG_CSV_URL not set" },
                { status: 500 }
            );
        }

        const response = await fetch(csvUrl, { next: { revalidate: 300 } }); // Cache for 5 mins

        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }

        const csvText = await response.text();

        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (result.errors.length > 0) {
            console.warn("CSV Parse Errors:", result.errors);
        }

        let data = result.data as Record<string, any>[];

        // Filter and Sanitization
        const sanitizedData = data.map((row) => {
            // 1. Remove blacklisted keys
            BLACKLIST_FIELDS.forEach((field) => delete row[field]);

            // 2. Validate/Transform with Zod (optional, but good for type safety)
            // We parse safely; if fails, we might still want to return partial data or log error
            // For now, we return the raw object but stripped of costs
            return row;
        });

        return NextResponse.json(sanitizedData);
    } catch (error: any) {
        console.error("Catalog Fetch Error:", error);
        return NextResponse.json(
            { error: "Failed to load catalog", details: error.message },
            { status: 500 }
        );
    }
}
