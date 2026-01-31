"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, MessageCircle, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleWhatsApp = () => {
        // 1. Format the message
        let message = "Hello Hamper World, I am interested in ordering the following:\n\n";

        items.forEach(item => {
            message += `• ${item.quantity}x ${item.product.name} (${item.selectedVariant.category} - ${item.selectedVariant.size}) - ₹${item.selectedVariant.price * item.quantity}\n`;
        });

        message += `\nTotal Estimate: ₹${totalPrice.toFixed(2)}`;

        // 2. Encode for URL
        const encodedMessage = encodeURIComponent(message);

        // 3. Open WhatsApp
        window.open(`https://wa.me/919526689880?text=${encodedMessage}`, '_blank');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-serif text-brand-primary">Your Selection</h2>
                    <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-brand-primary" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <ShoppingBag className="w-16 h-16" />
                            <p className="text-lg">Your Request List is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.product.id}-${item.selectedVariant.size}-${item.selectedVariant.category}`} className="flex gap-4">
                                <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif text-brand-primary">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-1">{item.selectedVariant.category} - {item.selectedVariant.size}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-4">
                                        <div className="flex items-center gap-2 border border-brand-primary/20 rounded-sm overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedVariant.size, item.selectedVariant.category, item.quantity - 1)}
                                                className="p-3 md:p-1 hover:bg-brand-primary/10 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-4 h-4 md:w-3 md:h-3 text-brand-primary" />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val)) {
                                                        updateQuantity(item.product.id, item.selectedVariant.size, item.selectedVariant.category, val);
                                                    }
                                                }}
                                                className="w-12 text-center text-sm md:text-base border-x border-brand-primary/20 focus:outline-none focus:bg-brand-light/20 py-2 md:py-0"
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.selectedVariant.size, item.selectedVariant.category, item.quantity + 1)}
                                                className="p-3 md:p-1 hover:bg-brand-primary/10 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-4 h-4 md:w-3 md:h-3 text-brand-primary" />
                                            </button>
                                        </div>

                                        <span className="text-sm font-semibold text-brand-accent">
                                            ₹{(item.selectedVariant.price * item.quantity).toFixed(2)}
                                        </span>

                                        <button
                                            onClick={() => removeFromCart(item.product.id, item.selectedVariant.size, item.selectedVariant.category)}
                                            className="ml-auto text-xs text-red-400 hover:text-red-600 underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm uppercase tracking-widest text-gray-500">Total Estimate</span>
                            <span className="text-2xl font-serif text-brand-primary">₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full bg-[#25D366] text-white py-4 px-6 rounded-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors font-medium tracking-wide shadow-lg"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Inquire via WhatsApp
                        </button>
                        <p className="text-xs text-center mt-3 text-gray-400">
                            No payment required. We will confirm availability via chat.
                        </p>
                    </div>
                )}

            </div>
        </>
    );
}
