import { products } from '@/types/products';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
    return (
        <section id="collection" className="py-24 bg-white">
            <div className="container mx-auto px-4">

                {/* Section Header */}
                <div className="mb-16 text-center">
                    <span className="mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-brand-accent">
                        The Collection
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-brand-primary">
                        Curated Fragrances
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </section>
    );
}
