import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import eventsData from '@/data/events.json';

// Edge Config ID and Team ID (for writing via Vercel API)
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID || 'ecfg_x6qqbqbcxqgar0xrcklr0frqzexl';
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

// GET - Read events from Edge Config (production) or local file (development)
export async function GET() {
    try {
        // Try Edge Config first (production)
        if (process.env.EDGE_CONFIG) {
            const events = await get('events');
            if (events) {
                return NextResponse.json(events);
            }
        }

        // Fallback to local file (development or if Edge Config not set)
        return NextResponse.json(eventsData);
    } catch (error) {
        console.error('Error fetching events:', error);
        // Return local data as fallback
        return NextResponse.json(eventsData);
    }
}

// PUT - Update events via Vercel Edge Config API
export async function PUT(request: NextRequest) {
    try {
        const updatedEvents = await request.json();

        // In development, just return success (can't write to file in API route)
        if (!VERCEL_API_TOKEN || process.env.NODE_ENV === 'development') {
            console.log('Development mode: Events would be saved:', updatedEvents);
            return NextResponse.json({
                success: true,
                message: 'Development mode - changes are temporary',
                data: updatedEvents
            });
        }

        // Update Edge Config via Vercel API
        const response = await fetch(
            `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [
                        {
                            operation: 'upsert',
                            key: 'events',
                            value: updatedEvents,
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Edge Config update failed:', error);
            throw new Error(`Failed to update Edge Config: ${error}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Events updated successfully',
            data: updatedEvents
        });
    } catch (error) {
        console.error('Error updating events:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update events' },
            { status: 500 }
        );
    }
}
