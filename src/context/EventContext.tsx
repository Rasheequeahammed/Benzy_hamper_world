"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface EventTheme {
    primaryColor: string;
    accentColor: string;
    lightBg?: string;
    bannerBg?: string;
}

export interface EventBanner {
    text: string;
    link?: string;
    dismissible?: boolean;
}

export interface EventHeroOverride {
    headline?: string;
    tagline?: string;
    image?: string;
}

export interface Event {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    theme: EventTheme;
    banner: EventBanner;
    discountPercent: number;
    heroOverride?: EventHeroOverride;
    featuredProducts?: string[];
}

export interface EventConfig {
    events: Event[];
    defaultTheme: {
        primaryColor: string;
        accentColor: string;
    };
}

interface EventContextType {
    currentEvent: Event | null;
    theme: EventTheme;
    discountPercent: number;
    isEventActive: boolean;
    bannerDismissed: boolean;
    dismissBanner: () => void;
    getDiscountedPrice: (originalPrice: number) => number;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Check if a date is within event range
function isEventCurrentlyActive(event: Event): boolean {
    if (!event.isActive) return false;

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    end.setHours(23, 59, 59, 999); // Include full end day

    return now >= start && now <= end;
}

export function EventProvider({ children, eventConfig }: { children: ReactNode; eventConfig: EventConfig }) {
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

    // Find active event on mount
    useEffect(() => {
        const activeEvent = eventConfig.events.find(isEventCurrentlyActive) || null;
        setCurrentEvent(activeEvent);

        // Check if banner was dismissed for this event
        if (activeEvent) {
            const dismissedKey = `banner_dismissed_${activeEvent.id}`;
            const wasDismissed = localStorage.getItem(dismissedKey) === 'true';
            setBannerDismissed(wasDismissed);
        }
    }, [eventConfig.events]);

    // Apply theme colors to CSS variables
    useEffect(() => {
        if (currentEvent) {
            // Event is active - apply event theme colors
            document.documentElement.style.setProperty('--brand-primary', currentEvent.theme.primaryColor);
            document.documentElement.style.setProperty('--brand-accent', currentEvent.theme.accentColor);
            // Keep light and dark consistent, or derive from theme
            document.documentElement.style.setProperty('--brand-light', currentEvent.theme.lightBg || '#FFF5F8');
            document.documentElement.style.setProperty('--brand-dark', currentEvent.theme.primaryColor);

            if (currentEvent.theme.bannerBg) {
                document.documentElement.style.setProperty('--banner-bg', currentEvent.theme.bannerBg);
            }
        } else {
            // No event - reset to default colors
            document.documentElement.style.setProperty('--brand-primary', '#043927');
            document.documentElement.style.setProperty('--brand-accent', '#D4AF37');
            document.documentElement.style.setProperty('--brand-light', '#F9F9F9');
            document.documentElement.style.setProperty('--brand-dark', '#022216');
        }
    }, [currentEvent]);

    const dismissBanner = () => {
        if (currentEvent) {
            localStorage.setItem(`banner_dismissed_${currentEvent.id}`, 'true');
            setBannerDismissed(true);
        }
    };

    const getDiscountedPrice = (originalPrice: number): number => {
        if (!currentEvent || currentEvent.discountPercent <= 0) {
            return originalPrice;
        }
        return originalPrice * (1 - currentEvent.discountPercent / 100);
    };

    const value: EventContextType = {
        currentEvent,
        theme: currentEvent?.theme || eventConfig.defaultTheme as EventTheme,
        discountPercent: currentEvent?.discountPercent || 0,
        isEventActive: !!currentEvent,
        bannerDismissed,
        dismissBanner,
        getDiscountedPrice,
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvent() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
}

// Safe version that returns defaults when context isn't available
export function useEventSafe() {
    const context = useContext(EventContext);

    // Return default values if context is not available
    if (context === undefined) {
        return {
            currentEvent: null,
            theme: { primaryColor: '#043927', accentColor: '#D4AF37' },
            discountPercent: 0,
            isEventActive: false,
            bannerDismissed: false,
            dismissBanner: () => { },
            getDiscountedPrice: (price: number) => price,
        };
    }
    return context;
}
