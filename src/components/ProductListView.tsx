import { Product } from '@/types/products';
import Link from 'next/link';
import { ExternalLink, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductListViewProps {
    products: Product[];
    showVariantHeaders?: boolean; // New prop
}

export function ProductListView({ products, showVariantHeaders = true }: ProductListViewProps) {
    const { addToCart } = useCart();
    return (
        <div className="bg-white rounded-sm border border-brand-primary/10 overflow-hidden">
            {/* Table Header */}
            <div className={`bg-brand-primary/5 border-b border-brand-primary/10 px-4 py-3 grid gap-4 font-medium text-xs uppercase tracking-wider text-brand-primary/60 ${showVariantHeaders ? 'grid-cols-4 md:grid-cols-12' : 'grid-cols-4 md:grid-cols-7'
                }`}>
                <div className="col-span-4 md:col-span-3">Product Name</div>
                <div className="hidden md:block md:col-span-2">Collection</div>

                {showVariantHeaders ? (
                    // Classics: Show Economy/Inspired/Identical headers
                    <div className="hidden md:grid md:col-span-6 md:grid-cols-3 gap-2">
                        <div className="text-center">Economy</div>
                        <div className="text-center">Inspired</div>
                        <div className="text-center">Identical</div>
                    </div>
                ) : (
                    // Signature/Top Quality: Just "Prices" header
                    <div className="hidden md:block md:col-span-1">Prices</div>
                )}

                <div className="hidden md:block md:col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-brand-primary/5">
                {products.map((product) => {
                    // Group variants by category
                    const economyVariants = product.variants.filter(v => v.category === 'Economy');
                    const inspiredVariants = product.variants.filter(v => v.category === 'Inspired');
                    const identicalVariants = product.variants.filter(v => v.category === 'Identical');

                    return (
                        <div
                            key={product.id}
                            className={`px-4 py-4 grid gap-4 items-center hover:bg-brand-light/30 transition-colors group ${showVariantHeaders ? 'grid-cols-4 md:grid-cols-12' : 'grid-cols-4 md:grid-cols-7'
                                }`}
                        >
                            {/* Product Name */}
                            <div className="col-span-4 md:col-span-3">
                                <Link
                                    href={`/products/${product.id}`}
                                    className="font-medium text-brand-primary hover:text-brand-accent transition-colors"
                                >
                                    {product.name}
                                </Link>
                            </div>

                            {/* Collection Tag */}
                            <div className="hidden md:block md:col-span-2">
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-brand-primary/10 text-brand-primary">
                                    {product.collectionTag}
                                </span>
                            </div>

                            {/* Prices */}
                            {showVariantHeaders ? (
                                // Classics: Show 3 columns for Economy/Inspired/Identical
                                <div className="hidden md:grid md:col-span-6 md:grid-cols-3 gap-2 text-sm">
                                    {/* Economy */}
                                    <div className="text-center">
                                        {economyVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {economyVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Economy', 1)}
                                                            className="p-0.5 rounded-full bg-brand-accent/10 hover:bg-brand-accent hover:text-white text-brand-accent transition-colors"
                                                            title="Add to cart"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-brand-primary/30">—</span>
                                        )}
                                    </div>

                                    {/* Inspired */}
                                    <div className="text-center">
                                        {inspiredVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {inspiredVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Inspired', 1)}
                                                            className="p-0.5 rounded-full bg-brand-accent/10 hover:bg-brand-accent hover:text-white text-brand-accent transition-colors"
                                                            title="Add to cart"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-brand-primary/30">—</span>
                                        )}
                                    </div>

                                    {/* Identical */}
                                    <div className="text-center">
                                        {identicalVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {identicalVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Identical', 1)}
                                                            className="p-0.5 rounded-full bg-brand-accent/10 hover:bg-brand-accent hover:text-white text-brand-accent transition-colors"
                                                            title="Add to cart"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-brand-primary/30">—</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Signature/Top Quality: Single column for all prices
                                <div className="hidden md:block md:col-span-1 text-sm">
                                    <div className="space-y-1">
                                        {product.variants.map(v => (
                                            <div key={v.size} className="flex items-center gap-2 text-brand-primary/70">
                                                <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                <span>₹{v.price}</span>
                                                <button
                                                    onClick={() => addToCart(product, v.size, v.price, v.category, 1)}
                                                    className="p-0.5 rounded-full bg-brand-accent/10 hover:bg-brand-accent hover:text-white text-brand-accent transition-colors"
                                                    title="Add to cart"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action */}
                            <div className="hidden md:block md:col-span-1 text-right">
                                <Link
                                    href={`/products/${product.id}`}
                                    className="inline-flex items-center gap-1 text-xs text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
