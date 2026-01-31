"use client";

import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/types/products';
import { useMemo } from 'react';

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function BentoGrid() {
    // Get random products from all categories
    const featuredProducts = useMemo(() => {
        return shuffleArray(products).slice(0, 6);
    }, []);

    if (featuredProducts.length < 6) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-brand-accent uppercase tracking-widest text-xs font-bold mb-2 block">
                        Discover
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">
                        Featured Hampers
                    </h2>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">

                    {/* Large Card - spans 2 cols and 2 rows */}
                    <Link
                        href={`/products/${featuredProducts[0].id}`}
                        className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden group"
                    >
                        <Image
                            src={featuredProducts[0].imageUrl}
                            alt={featuredProducts[0].name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <span className="text-xs uppercase tracking-widest text-white/70 mb-1 block">
                                {featuredProducts[0].variants[0]?.category}
                            </span>
                            <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">
                                {featuredProducts[0].name}
                            </h3>
                            <p className="text-lg font-semibold text-brand-accent">
                                from ₹{Math.min(...featuredProducts[0].variants.map(v => v.price))}
                            </p>
                        </div>
                    </Link>

                    {/* Medium Card - spans 2 cols */}
                    <Link
                        href={`/products/${featuredProducts[1].id}`}
                        className="relative col-span-2 rounded-2xl overflow-hidden group"
                    >
                        <Image
                            src={featuredProducts[1].imageUrl}
                            alt={featuredProducts[1].name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-lg font-serif font-bold">{featuredProducts[1].name}</h3>
                            <p className="text-sm text-brand-accent">from ₹{Math.min(...featuredProducts[1].variants.map(v => v.price))}</p>
                        </div>
                    </Link>

                    {/* Small Cards */}
                    {featuredProducts.slice(2, 4).map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="relative rounded-2xl overflow-hidden group"
                        >
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                <h3 className="text-sm font-serif font-bold truncate">{product.name}</h3>
                                <p className="text-xs text-brand-accent">₹{Math.min(...product.variants.map(v => v.price))}</p>
                            </div>
                        </Link>
                    ))}

                    {/* Bottom Row - 2 medium cards */}
                    {featuredProducts.slice(4, 6).map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="relative col-span-2 rounded-2xl overflow-hidden group"
                        >
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-lg font-serif font-bold">{product.name}</h3>
                                <p className="text-sm text-brand-accent">from ₹{Math.min(...product.variants.map(v => v.price))}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Link
                        href="/collection/all"
                        className="inline-block border-2 border-brand-primary px-8 py-3 text-sm font-medium tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300"
                    >
                        VIEW ALL COLLECTIONS
                    </Link>
                </div>
            </div>
        </section>
    );
}
