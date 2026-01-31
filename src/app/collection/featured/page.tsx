"use client";

import { useEventSafe } from '@/context/EventContext';
import { products } from '@/types/products';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function FeaturedCollectionPage() {
    const { currentEvent, isEventActive } = useEventSafe();

    // Get featured products if event is active
    const featuredProducts = isEventActive && currentEvent?.featuredProducts
        ? products.filter(p => currentEvent.featuredProducts?.includes(p.id))
        : [];

    // Also get products with matching event tags
    const eventTag = currentEvent?.id?.includes('valentine') ? 'valentines'
        : currentEvent?.id?.includes('ramadan') ? 'ramadan'
            : null;

    const taggedProducts = eventTag
        ? products.filter(p => (p as any).eventTags?.includes(eventTag) && !currentEvent?.featuredProducts?.includes(p.id))
        : [];

    const allEventProducts = [...featuredProducts, ...taggedProducts];

    // If no active event, show message
    if (!isEventActive || allEventProducts.length === 0) {
        return (
            <div className="min-h-screen bg-brand-light py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-serif text-brand-primary mb-4">
                        No Active Event
                    </h1>
                    <p className="text-brand-primary/60 mb-8 max-w-md mx-auto">
                        Check back during our special events for curated collection picks!
                    </p>
                    <Link
                        href="/collection/all"
                        className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-dark transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse All Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light py-12 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-8 text-sm uppercase tracking-wider text-brand-primary/60 hover:text-brand-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-brand-accent" />
                        <span className="text-sm font-bold tracking-[0.2em] text-brand-accent uppercase">
                            Special Collection
                        </span>
                        <Sparkles className="w-5 h-5 text-brand-accent" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4">
                        {currentEvent?.name} Collection
                    </h1>
                    <p className="text-lg text-brand-primary/60 max-w-xl mx-auto">
                        Hand-picked hampers perfect for this special occasion.
                        {currentEvent?.discountPercent && currentEvent.discountPercent > 0 && (
                            <span className="text-brand-accent font-semibold">
                                {' '}Enjoy {currentEvent.discountPercent}% off on all items!
                            </span>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allEventProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16 pt-12 border-t border-brand-primary/10">
                    <p className="text-brand-primary/60 mb-4">
                        Looking for more options?
                    </p>
                    <Link
                        href="/collection/all"
                        className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors"
                    >
                        Browse All Collections
                    </Link>
                </div>
            </div>
        </div>
    );
}
