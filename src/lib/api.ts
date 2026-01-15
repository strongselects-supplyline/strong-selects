import { CatalogSchema, Product } from "./schema";

export async function fetchCatalog(): Promise<Product[]> {
    try {
        // We call our own proxy API, not the external CSV URL directly
        const res = await fetch("/api/catalog");

        if (!res.ok) {
            throw new Error("Failed to fetch catalog");
        }

        const data = await res.json();

        // Validate with Zod - will strip unknown fields if schema is strict, 
        // but our schema is open enough. It ensures types are correct.
        const parsed = CatalogSchema.safeParse(data);

        if (!parsed.success) {
            console.error("Catalog Validation Error:", parsed.error);
            // Return partial data or empty array? 
            // For now, let's try to return what we have, or throw.
            // Better to show nothing than broken data.
            return [];
        }

        return parsed.data;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}
