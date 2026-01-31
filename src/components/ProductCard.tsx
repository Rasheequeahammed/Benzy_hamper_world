"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/products';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    // Get the lowest price for display
    const lowestPrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => v.price))
        : 0;

    // Get available categories
    const categories = Array.from(new Set(product.variants.map(v => v.category)));

    return (
        <div className="group relative flex flex-col items-center bg-white p-3 md:p-6 transition-all duration-500 hover:shadow-xl">

            {/* Image Container with Hover Effect */}
            <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden bg-gray-50">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </div>

            {/* Content */}
            <div className="text-center w-full">
                {categories.length > 0 && (
                    <span className="block mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 truncate">
                        {categories.join(' / ')}
                    </span>
                )}
                <h3 className="mb-1 md:mb-2 text-sm md:text-lg font-serif font-medium text-brand-primary truncate">
                    {product.name}
                </h3>
                <p className="mb-3 md:mb-4 font-sans text-xs md:text-sm font-semibold text-brand-accent">
                    from ₹{lowestPrice.toFixed(2)}
                </p>

                {/* Button */}
                <Link
                    href={`/products/${product.id}`}
                    className="group/btn inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-primary/60 hover:text-brand-primary transition-colors"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
