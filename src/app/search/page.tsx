"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, Product } from '@/types/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductListView } from '@/components/ProductListView';
import { ChevronDown, Grid3x3, List } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

type SortOption = 'name-asc' | 'price-low' | 'price-high';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Shuffle array helper
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Search logic - show all shuffled if empty, otherwise filter
    const searchResults = useMemo(() => {
        // If no query, return all products shuffled
        if (!query.trim()) {
            return shuffleArray(products);
        }

        const searchTerms = query.toLowerCase().split(' ');
        return products.filter(product => {
            const nameMatch = product.name.toLowerCase();
            const descMatch = product.description.toLowerCase();
            // Get all categories from variants
            const categoryMatch = product.variants.map(v => v.category.toLowerCase()).join(' ');

            // Check if any search term matches name, description, or category
            return searchTerms.some(term =>
                nameMatch.includes(term) ||
                descMatch.includes(term) ||
                categoryMatch.includes(term)
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Get unique sizes
    const availableSizes = useMemo(() => {
        const allSizes = new Set<string>();
        products.forEach(p => p.variants.forEach(v => allSizes.add(v.size)));
        return Array.from(allSizes).sort((a, b) => {
            const order = ['100ml', '250ml', '500ml', '1Kg'];
            return order.indexOf(a) - order.indexOf(b);
        });
    }, []);

    // Filter and Sort
    const processedProducts = useMemo(() => {
        let result = [...searchResults];

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter(p => p.variants.some(v => selectedCategories.includes(v.category)));
        }

        // Filter by size
        if (selectedSizes.length > 0) {
            result = result.filter(p =>
                p.variants.some(v => selectedSizes.includes(v.size))
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'price-low') {
                const minA = Math.min(...a.variants.map(v => v.price));
                const minB = Math.min(...b.variants.map(v => v.price));
                return minA - minB;
            } else if (sortBy === 'price-high') {
                const maxA = Math.max(...a.variants.map(v => v.price));
                const maxB = Math.max(...b.variants.map(v => v.price));
                return maxB - maxA;
            }
            return 0;
        });

        return result;
    }, [searchResults, selectedSizes, selectedCategories, sortBy]);

    const itemsPerPage = 24;
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
    const displayedProducts = processedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
        setPage(1);
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setPage(1);
    };

    return (
        <div className="bg-white min-h-screen py-12 md:py-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary">
                        {query ? 'Search Results' : 'All Hampers'}
                    </h1>

                    {/* Dedicated Search Bar for Results Page */}
                    <div className="max-w-2xl mx-auto w-full px-2">
                        <SearchBar />
                    </div>

                    <p className="text-brand-primary/60 max-w-2xl mx-auto pt-2">
                        {query
                            ? (searchResults.length > 0
                                ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${query}"`
                                : `No results found for "${query}"`)
                            : `Browse our collection of ${products.length} handcrafted hampers`
                        }
                    </p>
                    <div className="h-1 w-20 bg-brand-accent mx-auto mt-4" />
                </div>

                {searchResults.length > 0 && (
                    <>
                        {/* Filters & Sort Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b border-brand-primary/10">

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 md:border-r border-brand-primary/10 md:pr-4">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-white text-brand-primary/40 hover:text-brand-primary border border-brand-primary/20'
                                        }`}
                                    title="Grid view"
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list'
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-white text-brand-primary/40 hover:text-brand-primary border border-brand-primary/20'
                                        }`}
                                    title="List view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-brand-primary/60 uppercase tracking-wider">
                                    Sort by:
                                </label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
                                        className="appearance-none bg-white border border-brand-primary/20 rounded-sm px-4 py-2 pr-10 text-sm text-brand-primary focus:outline-none focus:border-brand-primary/50 cursor-pointer"
                                    >
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40 pointer-events-none" />
                                </div>
                            </div>

                            {/* Collection Filters */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <label className="text-sm font-medium text-brand-primary/60 uppercase tracking-wider">
                                    Collection:
                                </label>
                                {['Acrylic', 'Wooden', 'Metal'].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => toggleCategory(category)}
                                        className={`px-3 py-1 text-xs border rounded-full transition-all ${selectedCategories.includes(category)
                                            ? 'bg-brand-primary text-white border-brand-primary'
                                            : 'border-brand-primary/20 text-brand-primary/60 hover:border-brand-primary/50'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={() => { setSelectedCategories([]); setPage(1); }}
                                        className="text-xs text-brand-accent underline ml-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Size Filters */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <label className="text-sm font-medium text-brand-primary/60 uppercase tracking-wider">
                                    Filter by Size:
                                </label>
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={`px-3 py-1 text-xs border rounded-full transition-all ${selectedSizes.includes(size)
                                            ? 'bg-brand-primary text-white border-brand-primary'
                                            : 'border-brand-primary/20 text-brand-primary/60 hover:border-brand-primary/50'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                                {selectedSizes.length > 0 && (
                                    <button
                                        onClick={() => { setSelectedSizes([]); setPage(1); }}
                                        className="text-xs text-brand-accent underline ml-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="flex justify-between items-center mb-8 text-sm text-brand-primary/50">
                            <span>Showing {processedProducts.length} results</span>
                            <span className="text-xs">
                                {viewMode === 'grid' ? 'Grid View' : 'List View'}
                            </span>
                        </div>

                        {/* Product Display */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <ProductListView
                                products={displayedProducts}
                                showVariantHeaders={true}
                            />
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-16">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-brand-primary/20 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-brand-primary/60">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border border-brand-primary/20 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-brand-primary font-serif animate-pulse">Searching catalogue...</div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
