export type Availability = 'Available' | 'Low' | 'Unavailable';

export interface Product {
    id: string;
    category: string;
    itemName: string;
    size: string;
    price: number;
    score: number; // e.g. 9.5
    profileTags: string[];
    badge?: string;
    availability: Availability;
    notes: string;
    tierPricing: {
        qty: number;
        price: number;
    }[];
    documentationUrl: string;
    imageUrl: string;
    updatedAt: string;
}

export interface CartItem extends Product {
    quantity: number;
}
