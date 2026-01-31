"use client";

import { useState, useMemo, use } from 'react';
import { products, Product } from '@/types/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductListView } from '@/components/ProductListView';
import { notFound } from 'next/navigation';
import { ChevronDown, Grid3x3, List } from 'lucide-react';

type SortOption = 'name-asc' | 'price-low' | 'price-high';

export default function CollectionPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);

    const getCollectionInfo = (type: string) => {
        switch (type) {
            case 'acrylic':
                return {
                    title: 'Acrylic Collection',
                    description: 'Modern, transparent elegance for vibrant gifts.',
                    filter: (p: Product) => p.variants.some(v => v.category === 'Acrylic')
                };
            case 'wooden':
                return {
                    title: 'Vintage Wooden',
                    description: 'Rustic charm for organic and earthy hampers.',
                    filter: (p: Product) => p.variants.some(v => v.category === 'Wooden')
                };
            case 'metal':
                return {
                    title: 'Luxury Metal',
                    description: 'Sophisticated gold wire baskets for premium spa kits.',
                    filter: (p: Product) => p.variants.some(v => v.category === 'Metal')
                };
            case 'all':
                return {
                    title: 'All Collections',
                    description: 'Discover our full range of handcrafted hampers.',
                    filter: () => true
                };
            default:
                return null;
        }
    };

    const info = getCollectionInfo(type);
    if (!info) return notFound();

    // State
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Get unique sizes from all products
    const availableSizes = useMemo(() => {
        const allSizes = new Set<string>();
        products.forEach(p => p.variants.forEach(v => allSizes.add(v.size)));
        return Array.from(allSizes).sort((a, b) => {
            // Sort sizes logically (100ml, 250ml, 500ml, 1Kg)
            const order = ['100ml', '250ml', '500ml', '1Kg'];
            return order.indexOf(a) - order.indexOf(b);
        });
    }, []);

    // Filter and Sort
    const processedProducts = useMemo(() => {
        let result = products.filter(info.filter);

        // Filter by size if any selected
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
    }, [info.filter, selectedSizes, sortBy]);

    const itemsPerPage = 24;
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
    const displayedProducts = processedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
        setPage(1); // Reset to first page
    };

    return (
        <div className="bg-white min-h-screen py-20">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary">
                        {info.title}
                    </h1>
                    <p className="text-brand-primary/60 max-w-2xl mx-auto">
                        {info.description}
                    </p>
                    <div className="h-1 w-20 bg-brand-accent mx-auto mt-8" />
                </div>

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

                {/* Product Display - Grid or List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <ProductListView
                        products={displayedProducts}
                        showVariantHeaders={type === 'classics'}
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
            </div>
        </div>
    );
}
