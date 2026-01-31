"use client";

import { products } from '@/types/products';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export function FeaturedCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Get Signature Collection items
    const signatureProducts = products.filter(p => p.collectionTag === 'Signature').slice(0, 12);

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            return () => container.removeEventListener('scroll', updateScrollButtons);
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (signatureProducts.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-brand-light/30 to-white">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-3">
                        Signature Hamper Collection
                    </h2>
                    <p className="text-brand-primary/60 max-w-2xl mx-auto">
                        Premium handcrafted hampers for your most cherished moments.
                    </p>
                    <div className="h-1 w-20 bg-brand-accent mx-auto mt-6" />
                </div>

                {/* Carousel Container */}
                <div className="relative group">

                    {/* Left Arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-6 h-6 text-brand-primary" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {signatureProducts.map(product => (
                            <div key={product.id} className="flex-shrink-0 w-64 snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-6 h-6 text-brand-primary" />
                        </button>
                    )}

                    {/* Gradient Overlays for visual fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
                </div>

            </div>

            {/* Add custom CSS to hide scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
