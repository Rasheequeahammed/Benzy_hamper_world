"use client";

import { products, Variant } from '@/types/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Droplets, Wind, Sun, ShoppingBag, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = products.find((p) => p.id === params.id);
    const { addToCart } = useCart();

    // Group variants by category
    const categories = useMemo(() => {
        if (!product) return [];
        return Array.from(new Set(product.variants.map(v => v.category)));
    }, [product]);

    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');

    // Filter sizes based on selected category
    const availableVariants = useMemo(() => {
        if (!product) return [];
        return product.variants.filter(v => v.category === selectedCategory);
    }, [product, selectedCategory]);

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(availableVariants[0] || null);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return notFound();
    }

    // Update selected variant when category changes
    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        const firstVar = product.variants.find(v => v.category === cat);
        if (firstVar) setSelectedVariant(firstVar);
    };

    return (
        <div className="bg-brand-light min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-4">

                <Link
                    href="/#collection"
                    className="inline-flex items-center gap-2 mb-12 text-sm uppercase tracking-wider text-brand-primary/60 hover:text-brand-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-center">

                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-white shadow-2xl">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-brand-accent uppercase mb-2">
                                {selectedCategory || 'Perfume'}
                            </h2>
                            <h1 className="text-2xl md:text-5xl font-serif text-brand-primary mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-light text-brand-primary/80">
                                {selectedVariant ? `₹${selectedVariant.price.toFixed(2)}` : 'Select Option'}
                            </p>
                        </div>

                        <div className="border-y border-brand-primary/10 py-8 space-y-8">
                            <p className="text-lg leading-relaxed text-brand-primary/70 font-light">
                                {product.description}
                            </p>

                            {/* Category Selector */}
                            {categories.length > 1 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-3">Select Collection</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategoryChange(cat)}
                                                className={cn(
                                                    "px-4 py-2 border text-sm font-medium transition-all duration-300 rounded-sm",
                                                    selectedCategory === cat
                                                        ? "border-brand-primary bg-brand-primary text-white"
                                                        : "border-brand-primary/20 text-brand-primary/60 hover:border-brand-primary/50"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-3">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {availableVariants.map((variant) => (
                                        <button
                                            key={variant.size}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={cn(
                                                "min-w-[80px] px-4 py-2 border text-sm font-medium transition-all duration-300 rounded-sm",
                                                selectedVariant?.size === variant.size
                                                    ? "border-brand-accent bg-brand-accent text-white shadow-md ring-2 ring-brand-accent ring-offset-2"
                                                    : "border-brand-primary/20 text-brand-primary/60 hover:border-brand-primary/50"
                                            )}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex items-end gap-3 sm:gap-6">
                                {/* Quantity Selector */}
                                <div className="flex-shrink-0">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary/60 mb-3">Quantity</h3>
                                    <div className="flex items-center border border-brand-primary/20 rounded-sm h-[52px]">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="h-full px-3 hover:bg-brand-primary/5 transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4 text-brand-primary/80" />
                                        </button>
                                        <span className="w-10 sm:w-12 text-center text-brand-primary font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="h-full px-3 hover:bg-brand-primary/5 transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4 text-brand-primary/80" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => selectedVariant && addToCart(product, selectedVariant.size, selectedVariant.price, selectedVariant.category, quantity)}
                                    disabled={!selectedVariant}
                                    className="flex-1 bg-brand-primary text-white h-[52px] px-4 sm:px-8 text-[10px] sm:text-sm uppercase tracking-widest hover:bg-brand-dark transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="whitespace-nowrap">Add to Cart</span>
                                </button>
                            </div>
                        </div>

                        {/* Olfactory Notes Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-serif text-brand-primary border-b border-brand-primary/10 pb-2 inline-block">
                                Olfactory Notes
                            </h3>
                            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4">
                                <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left border-r border-brand-primary/10 last:border-0 pr-1 sm:pr-0">
                                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-brand-accent">
                                        <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                        <span className="text-[10px] sm:text-xs uppercase tracking-tighter sm:tracking-widest font-bold">Top</span>
                                    </div>
                                    <p className="text-[11px] sm:text-sm text-brand-primary/70 leading-tight">{product.notes.top}</p>
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left border-r border-brand-primary/10 last:border-0 px-1 sm:px-0">
                                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-brand-accent">
                                        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                        <span className="text-[10px] sm:text-xs uppercase tracking-tighter sm:tracking-widest font-bold">Heart</span>
                                    </div>
                                    <p className="text-[11px] sm:text-sm text-brand-primary/70 leading-tight">{product.notes.heart}</p>
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left pl-1 sm:pl-0">
                                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-brand-accent">
                                        <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                                        <span className="text-[10px] sm:text-xs uppercase tracking-tighter sm:tracking-widest font-bold">Base</span>
                                    </div>
                                    <p className="text-[11px] sm:text-sm text-brand-primary/70 leading-tight">{product.notes.base}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
