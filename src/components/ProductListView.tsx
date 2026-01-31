import { Product } from '@/types/products';
import Link from 'next/link';
import { ExternalLink, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductListViewProps {
    products: Product[];
    showVariantHeaders?: boolean;
}

export function ProductListView({ products, showVariantHeaders = true }: ProductListViewProps) {
    const { addToCart } = useCart();
    return (
        <div className="bg-white rounded-sm border border-brand-primary/10 overflow-hidden">
            {/* Table Header */}
            <div className={`bg-brand-primary/5 border-b border-brand-primary/10 px-4 py-3 grid gap-4 font-medium text-xs uppercase tracking-wider text-brand-primary/60 ${showVariantHeaders ? 'grid-cols-4 md:grid-cols-12' : 'grid-cols-4 md:grid-cols-7'
                }`}>
                <div className="col-span-4 md:col-span-3">Product Name</div>
                <div className="hidden md:block md:col-span-2">Category</div>

                {showVariantHeaders ? (
                    // Show Acrylic/Wooden/Metal headers
                    <div className="hidden md:grid md:col-span-6 md:grid-cols-3 gap-2">
                        <div className="text-center">Acrylic</div>
                        <div className="text-center">Wooden</div>
                        <div className="text-center">Metal</div>
                    </div>
                ) : (
                    // Just "Prices" header
                    <div className="hidden md:block md:col-span-1">Prices</div>
                )}

                <div className="hidden md:block md:col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-brand-primary/5">
                {products.map((product) => {
                    // Group variants by category
                    const acrylicVariants = product.variants.filter(v => v.category === 'Acrylic');
                    const woodenVariants = product.variants.filter(v => v.category === 'Wooden');
                    const metalVariants = product.variants.filter(v => v.category === 'Metal');

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

                            {/* Category Tag */}
                            <div className="hidden md:block md:col-span-2">
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-brand-primary/10 text-brand-primary">
                                    {product.variants[0]?.category || 'Hamper'}
                                </span>
                            </div>

                            {/* Prices */}
                            {showVariantHeaders ? (
                                // Show 3 columns for Acrylic/Wooden/Metal
                                <div className="hidden md:grid md:col-span-6 md:grid-cols-3 gap-2 text-sm">
                                    {/* Acrylic */}
                                    <div className="text-center">
                                        {acrylicVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {acrylicVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Acrylic', 1)}
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

                                    {/* Wooden */}
                                    <div className="text-center">
                                        {woodenVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {woodenVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Wooden', 1)}
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

                                    {/* Metal */}
                                    <div className="text-center">
                                        {metalVariants.length > 0 ? (
                                            <div className="space-y-1">
                                                {metalVariants.map(v => (
                                                    <div key={v.size} className="flex items-center justify-center gap-2 text-brand-primary/70">
                                                        <span className="text-xs text-brand-primary/40">{v.size}:</span>
                                                        <span>₹{v.price}</span>
                                                        <button
                                                            onClick={() => addToCart(product, v.size, v.price, 'Metal', 1)}
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
                                // Single column for all prices
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
