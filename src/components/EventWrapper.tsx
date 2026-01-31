"use client";

import { ReactNode, useState, useEffect } from 'react';
import { EventProvider, EventConfig } from '@/context/EventContext';
import { PromoBanner } from '@/components/PromoBanner';

// Default config while loading
const defaultConfig: EventConfig = {
    events: [],
    defaultTheme: {
        primaryColor: "#1a1a2e",
        accentColor: "#c9a962"
    }
};

export function EventWrapper({ children }: { children: ReactNode }) {
    const [eventConfig, setEventConfig] = useState<EventConfig>(defaultConfig);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch events dynamically to ensure latest data
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                console.log('📅 Loaded events:', data);
                setEventConfig(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load events:', err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        // Return children without event features while loading
        return <>{children}</>;
    }

    return (
        <EventProvider eventConfig={eventConfig}>
            <PromoBanner />
            {children}
        </EventProvider>
    );
}
