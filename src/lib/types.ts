import { Product } from "./schema";
export type { Product };

export type AvailabilityStatus = "Available" | "Low" | "Out" | "Unknown";

export interface DashboardFilters {
    tier: string[];
    type: string[];
    availability: AvailabilityStatus[];
    search: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    unit: "oz" | "qp" | "lb";
    price: number;
    notes: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "tier-asc" | "alpha-asc";
