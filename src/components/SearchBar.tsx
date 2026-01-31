"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { products, Product } from '@/types/products';
import Link from 'next/link';
import Image from 'next/image';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Handle click outside to close results
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim().length > 1) {
            const searchTerms = query.toLowerCase().split(' ');
            const filtered = products.filter(product => {
                const nameMatch = product.name.toLowerCase();
                const idMatch = (product as any).originalId?.toString() || "";

                // Check if all search terms match the name (allowing out of order "Aigner Black")
                return searchTerms.every(term => nameMatch.includes(term)) || idMatch === query;
            }).slice(0, 8); // Limit to 8 results

            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length > 0) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md mx-auto md:mx-0">
            <form onSubmit={handleSearchSubmit} className="relative">
                <input
                    type="text"
                    placeholder="Search fragrance oils..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-brand-light/50 border border-brand-primary/10 rounded-full text-sm focus:outline-none focus:border-brand-primary/30 focus:bg-white transition-all placeholder:text-brand-primary/40"
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full"
                    >
                        <X className="w-3 h-3 text-brand-primary/40" />
                    </button>
                )}
            </form>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-xl border border-brand-primary/5 max-h-[70vh] overflow-y-auto z-50">
                    {results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-primary/40 border-b border-gray-50 mb-1">
                                Fragrance Oils
                            </div>
                            {results.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={() => { setIsOpen(false); setQuery(''); }}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-brand-light/50 transition-colors group"
                                >
                                    <div className="relative w-10 h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-sm font-medium text-brand-primary truncate pr-2">
                                                {product.name}
                                            </h4>
                                            {/* Show lowest price */}
                                            <span className="text-xs text-brand-accent font-semibold whitespace-nowrap">
                                                ₹{Math.min(...product.variants.map(v => v.price))}
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand-primary/50 truncate">
                                            {product.collectionTag} • {product.variants.length} Options
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {/* See All Results Link */}
                            {results.length >= 8 && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => { setIsOpen(false); setQuery(''); }}
                                    className="block px-4 py-3 text-center text-sm font-medium text-brand-accent hover:bg-brand-light/50 border-t border-gray-50 mt-1"
                                >
                                    See All Results →
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-brand-primary/50">
                            No fragrance oils found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
