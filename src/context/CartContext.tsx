"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product, VariantCategory } from "@/types/products"; // Ensure import

export interface CartItem {
    product: Product;
    // Added category to variant tracking
    selectedVariant: { size: string; price: number; category: string };
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (product: Product, size: string, price: number, category: string, quantity?: number) => void;
    removeFromCart: (productId: string, size: string, category: string) => void;
    updateQuantity: (productId: string, size: string, category: string, quantity: number) => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + (item.selectedVariant.price * item.quantity), 0);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addToCart = (product: Product, size: string, price: number, category: string, quantity: number = 1) => {
        setItems(prev => {
            // Check based on ID + Size + Category
            const existing = prev.find(item =>
                item.product.id === product.id &&
                item.selectedVariant.size === size &&
                item.selectedVariant.category === category
            );

            if (existing) {
                return prev.map(item =>
                    (item.product.id === product.id && item.selectedVariant.size === size && item.selectedVariant.category === category)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, selectedVariant: { size, price, category }, quantity }];
        });
        // setIsOpen(true); // User wants to add multiple items without popup
    };

    const removeFromCart = (productId: string, size: string, category: string) => {
        setItems(prev => prev.filter(item => !(
            item.product.id === productId &&
            item.selectedVariant.size === size &&
            item.selectedVariant.category === category
        )));
    };

    const updateQuantity = (productId: string, size: string, category: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, size, category);
            return;
        }
        setItems(prev => prev.map(item =>
            (item.product.id === productId && item.selectedVariant.size === size && item.selectedVariant.category === category)
                ? { ...item, quantity }
                : item
        ));
    };

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            openCart,
            closeCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
