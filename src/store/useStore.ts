import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface StoreState {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;

    // Filters
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    selectedAvailability: string | null;
    setSelectedAvailability: (availability: string | null) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            cart: [],
            addToCart: (product, quantity) =>
                set((state) => {
                    const existing = state.cart.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return { cart: [...state.cart, { ...product, quantity }] };
                }),
            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                })),
            clearCart: () => set({ cart: [] }),

            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),
            selectedCategory: null,
            setSelectedCategory: (category) => set({ selectedCategory: category }),
            selectedAvailability: null,
            setSelectedAvailability: (availability) =>
                set({ selectedAvailability: availability }),
            sortBy: 'newest',
            setSortBy: (sort) => set({ sortBy: sort }),
        }),
        {
            name: 'strong-selects-storage',
        }
    )
);
