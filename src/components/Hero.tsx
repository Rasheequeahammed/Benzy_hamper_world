export function Hero() {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-hamper.png"
                    alt="Luxury Gift Hampers"
                    className="w-full h-full object-cover brightness-50"
                />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <h2 className="mb-4 text-sm font-medium tracking-[0.2em] text-gold-400 uppercase drop-shadow-md">
                    Crafting Memories
                </h2>
                <h1 className="mb-6 text-5xl md:text-7xl font-playfair text-white drop-shadow-lg">
                    Hamper World
                </h1>
                <p className="mx-auto mb-10 max-w-lg text-lg text-gray-200 font-light leading-relaxed drop-shadow-md">
                    Exquisite hampers for weddings, engagements, and festive celebrations. Curated with love and elegance.
                </p>
                <a
                    href="#collection"
                    className="inline-block border border-gold-400 px-8 py-3 text-sm font-medium tracking-widest text-gold-400 hover:bg-gold-400 hover:text-black transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-black/20"
                >
                    EXPLORE COLLECTIONS
                </a>
            </div>
        </section>
    );
}
