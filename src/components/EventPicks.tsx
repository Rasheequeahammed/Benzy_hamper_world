"use client";

import { useEventSafe } from '@/context/EventContext';
import { products } from '@/types/products';
import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function EventPicks() {
    const { currentEvent, isEventActive } = useEventSafe();

    // Don't render if no active event or no featured products
    if (!isEventActive || !currentEvent?.featuredProducts?.length) {
        return null;
    }

    // Get the featured products based on IDs from the event
    const featuredProducts = products.filter(
        p => currentEvent.featuredProducts?.includes(p.id)
    );

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-brand-light">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-brand-accent" />
                        <span className="text-sm font-bold tracking-[0.2em] text-brand-accent uppercase">
                            {currentEvent.name}
                        </span>
                        <Sparkles className="w-5 h-5 text-brand-accent" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-brand-primary mb-4">
                        Special Picks for You
                    </h2>
                    <p className="text-brand-primary/60 max-w-lg mx-auto">
                        Hand-curated hampers perfect for this special occasion
                    </p>
                </div>

                {/* Featured Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/collection/featured"
                        className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-dark transition-all duration-300 hover:shadow-lg"
                    >
                        View All {currentEvent.name} Collection
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
