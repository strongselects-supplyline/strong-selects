import { CatalogSchema, Product, ProductSchema } from "./schema";

export async function fetchCatalog(): Promise<Product[]> {
    try {
        // We call our own proxy API, not the external CSV URL directly
        const res = await fetch("/api/catalog");

        if (!res.ok) {
            throw new Error("Failed to fetch catalog");
        }

        const data = await res.json();

        const rawData = await res.json();

        if (!Array.isArray(rawData)) {
            console.error("API did not return an array");
            return [];
        }

        // Validate row by row so one bad egg doesn't spoil the bunch
        const validProducts: Product[] = [];
        const errors: any[] = [];

        rawData.forEach((item, index) => {
            const result = ProductSchema.safeParse(item);
            if (result.success) {
                validProducts.push(result.data);
            } else {
                // Log the confusing row for debugging (could be sent to a logging service)
                console.warn(`Row ${index + 1} Invalid:`, result.error.errors[0]?.message, item);
                errors.push({ row: index, error: result.error });
            }
        });

        if (validProducts.length === 0 && errors.length > 0) {
            console.error("All rows failed validation. First error:", errors[0]);
        }

        return validProducts;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}
