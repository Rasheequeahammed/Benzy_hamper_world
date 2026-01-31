"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Sample product images - in a real scenario this would come from an API or folder scan
const images = [
    '/images/production/1.png',
    '/images/production/2.png',
    '/images/production/3.png',
    '/images/production/4.png',
    '/images/production/5.png',
    '/images/production/6.png',
];

export function ProductionShowcase() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <span className="text-brand-accent uppercase tracking-widest text-xs font-bold mb-2 block">
                    Behind the Scenes
                </span>
                <h2 className="text-3xl font-serif font-bold text-brand-primary">
                    Sample Production
                </h2>
            </div>

            {/* Row 1 - Scrolling Left */}
            <div className="flex gap-4 mb-4 animate-scroll-left min-w-full w-max">
                {[...images, ...images].map((src, idx) => (
                    <div key={`row1-${idx}`} className="relative h-48 w-72 flex-shrink-0 rounded-lg overflow-hidden group">
                        <Image
                            src={src}
                            alt="Production Sample"
                            fill
                            sizes="288px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* Row 2 - Scrolling Right */}
            <div className="flex gap-4 animate-scroll-right min-w-full w-max">
                {[...images, ...images].reverse().map((src, idx) => (
                    <div key={`row2-${idx}`} className="relative h-48 w-72 flex-shrink-0 rounded-lg overflow-hidden group">
                        <Image
                            src={src}
                            alt="Production Sample"
                            fill
                            sizes="288px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-scroll-left {
                    animation: scrollLeft 40s linear infinite;
                }
                .animate-scroll-right {
                    animation: scrollRight 40s linear infinite;
                }
                .animate-scroll-left:hover, 
                .animate-scroll-right:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
