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
    removeFromCart: (strainName: string, unit: string) => void;
    updateQuantity: (strainName: string, unit: string, quantity: number) => void;
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
        onlySale: false,
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

    sortBy: "alpha-asc",
    setSortBy: (option) => set({ sortBy: option }),

    cart: [],
    isCartOpen: false,
    toggleCart: (isOpen) => set((state) => ({ isCartOpen: isOpen ?? !state.isCartOpen })),
    addToCart: (item) => set((state) => {
        // Check if item already exists
        const existingIndex = state.cart.findIndex(
            (i) => i.product.strain_name === item.product.strain_name && i.unit === item.unit
        );

        if (existingIndex >= 0) {
            // Update quantity if exists
            const newCart = [...state.cart];
            newCart[existingIndex].quantity += item.quantity;
            return { cart: newCart, isCartOpen: true };
        }

        return { cart: [...state.cart, item], isCartOpen: true };
    }),
    removeFromCart: (strainName, unit) =>
        set((state) => ({
            cart: state.cart.filter((item) => !(item.product.strain_name === strainName && item.unit === unit))
        })),
    updateQuantity: (strainName, unit, quantity) =>
        set((state) => ({
            cart: state.cart.map((item) =>
                (item.product.strain_name === strainName && item.unit === unit)
                    ? { ...item, quantity }
                    : item
            ),
        })),
    clearCart: () => set({ cart: [] }),

    productDrawerOpen: false,
    selectedProduct: null,
    openProductDrawer: (product) => set({ selectedProduct: product, productDrawerOpen: true }),
    closeProductDrawer: () => set({ productDrawerOpen: false, selectedProduct: null }),
}));
