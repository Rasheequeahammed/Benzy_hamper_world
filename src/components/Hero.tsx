"use client";

import { useEventSafe } from '@/context/EventContext';

export function Hero() {
    const { currentEvent, isEventActive } = useEventSafe();

    // Use event override or default values
    const heroImage = isEventActive && currentEvent?.heroOverride?.image
        ? currentEvent.heroOverride.image
        : "/hero-hamper.png";

    const headline = isEventActive && currentEvent?.heroOverride?.headline
        ? currentEvent.heroOverride.headline
        : "Hamper World";

    const tagline = isEventActive && currentEvent?.heroOverride?.tagline
        ? currentEvent.heroOverride.tagline
        : "Crafting Memories";

    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Luxury Gift Hampers"
                    className="w-full h-full object-cover brightness-50"
                />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <h2 className="mb-4 text-sm font-medium tracking-[0.2em] text-brand-accent uppercase drop-shadow-md">
                    {tagline}
                </h2>
                <h1 className="mb-6 text-5xl md:text-7xl font-playfair text-white drop-shadow-lg">
                    {headline}
                </h1>
                <p className="mx-auto mb-10 max-w-lg text-lg text-gray-200 font-light leading-relaxed drop-shadow-md">
                    Exquisite hampers for weddings, engagements, and festive celebrations. Curated with love and elegance.
                </p>
                <a
                    href="#collection"
                    className="inline-block border border-brand-accent px-8 py-3 text-sm font-medium tracking-widest text-brand-accent hover:bg-brand-accent hover:text-white transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm bg-black/20"
                >
                    EXPLORE COLLECTIONS
                </a>
            </div>
        </section>
    );
}
