"use client";

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';

export function PromoBanner() {
    const { currentEvent, isEventActive, bannerDismissed, dismissBanner } = useEvent();

    // Debug logging
    console.log('🎯 PromoBanner debug:', { currentEvent, isEventActive, bannerDismissed });

    if (!isEventActive || !currentEvent) {
        return null;
    }

    // Note: bannerDismissed is intentionally not checked for now to ensure banner shows
    // To re-enable dismissible behavior, add: if (bannerDismissed) return null;

    return (
        <div
            className="relative py-3 px-4 text-center text-white text-sm font-medium"
            style={{
                background: currentEvent.theme.bannerBg || currentEvent.theme.accentColor
            }}
        >
            <div className="container mx-auto flex items-center justify-center gap-4">
                <span className="animate-pulse">{currentEvent.banner.text}</span>

                {currentEvent.banner.link && (
                    <Link
                        href={currentEvent.banner.link}
                        className="inline-block px-4 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-colors"
                    >
                        Shop Now →
                    </Link>
                )}
            </div>

            {currentEvent.banner.dismissible && (
                <button
                    onClick={dismissBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss banner"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
