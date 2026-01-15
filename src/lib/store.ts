import { create } from "zustand";
import { Product, CartItem, DashboardFilters, SortOption } from "./types";

interface AppState {
    // Data
    catalog: Product[];
    setCatalog: (data: Product[]) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    // Filters
    filters: DashboardFilters;
    setFilter: (key: keyof DashboardFilters, value: any) => void;
    toggleFilter: (key: "tier" | "type" | "availability", value: string) => void;

    // Sort
    sortBy: SortOption;
    setSortBy: (option: SortOption) => void;

    // Cart
    cart: CartItem[];
    isCartOpen: boolean;
    toggleCart: (isOpen?: boolean) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void; // Using index for simplicity as products might be duplicate lines with diff units
    updateCartItem: (index: number, updates: Partial<CartItem>) => void;
    clearCart: () => void;

    // UI
    productDrawerOpen: boolean;
    selectedProduct: Product | null;
    openProductDrawer: (product: Product) => void;
    closeProductDrawer: () => void;
}

export const useStore = create<AppState>((set) => ({
    catalog: [],
    setCatalog: (data) => set({ catalog: data }),
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),

    filters: {
        tier: [],
        type: [],
        availability: [],
        search: "",
    },
    setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
    toggleFilter: (key, value) =>
        set((state) => {
            const current = state.filters[key] as any[];
            const next = current.includes(value)
                ? current.filter((i: any) => i !== value)
                : [...current, value];
            return { filters: { ...state.filters, [key]: next } };
        }),

    sortBy: "price-asc",
    setSortBy: (option) => set({ sortBy: option }),

    cart: [],
    isCartOpen: false,
    toggleCart: (isOpen) => set((state) => ({ isCartOpen: isOpen ?? !state.isCartOpen })),
    addToCart: (item) => set((state) => ({ cart: [...state.cart, item], isCartOpen: true })),
    removeFromCart: (index) =>
        set((state) => ({ cart: state.cart.filter((_, i) => i !== index) })),
    updateCartItem: (index, updates) =>
        set((state) => ({
            cart: state.cart.map((item, i) => (i === index ? { ...item, ...updates } : item)),
        })),
    clearCart: () => set({ cart: [] }),

    productDrawerOpen: false,
    selectedProduct: null,
    openProductDrawer: (product) => set({ selectedProduct: product, productDrawerOpen: true }),
    closeProductDrawer: () => set({ productDrawerOpen: false, selectedProduct: null }),
}));
