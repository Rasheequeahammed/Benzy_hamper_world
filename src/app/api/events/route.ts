import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import eventsData from '@/data/events.json';

// Database row type
interface EventRow {
    id: string;
    name: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
    primary_color: string;
    accent_color: string;
    light_bg: string;
    banner_bg: string;
    banner_text: string;
    banner_link: string;
    banner_dismissible: boolean;
    discount_percent: number;
    hero_headline: string;
    hero_tagline: string;
    hero_image: string;
    featured_products: string[];
}

// Transform database row to frontend format
function rowToEvent(row: EventRow) {
    return {
        id: row.id,
        name: row.name,
        isActive: row.is_active,
        startDate: row.start_date,
        endDate: row.end_date,
        theme: {
            primaryColor: row.primary_color,
            accentColor: row.accent_color,
            lightBg: row.light_bg,
            bannerBg: row.banner_bg,
        },
        banner: {
            text: row.banner_text,
            link: row.banner_link,
            dismissible: row.banner_dismissible,
        },
        discountPercent: row.discount_percent,
        heroOverride: {
            headline: row.hero_headline,
            tagline: row.hero_tagline,
            image: row.hero_image,
        },
        featuredProducts: row.featured_products || [],
    };
}

// Transform frontend format to database row
function eventToRow(event: any): Partial<EventRow> {
    return {
        id: event.id,
        name: event.name,
        is_active: event.isActive,
        start_date: event.startDate,
        end_date: event.endDate,
        primary_color: event.theme?.primaryColor,
        accent_color: event.theme?.accentColor,
        light_bg: event.theme?.lightBg,
        banner_bg: event.theme?.bannerBg,
        banner_text: event.banner?.text,
        banner_link: event.banner?.link,
        banner_dismissible: event.banner?.dismissible ?? true,
        discount_percent: event.discountPercent || 0,
        hero_headline: event.heroOverride?.headline,
        hero_tagline: event.heroOverride?.tagline,
        hero_image: event.heroOverride?.image,
        featured_products: event.featuredProducts || [],
    };
}

// GET - Read events from Supabase
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('events')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.log('Supabase fetch error, using local data:', error.message);
            return NextResponse.json(eventsData);
        }

        if (data && data.length > 0) {
            const events = data.map(rowToEvent);
            return NextResponse.json({
                events,
                defaultTheme: {
                    primaryColor: '#1a1a2e',
                    accentColor: '#c9a962',
                },
            });
        }

        // Fallback to local file
        return NextResponse.json(eventsData);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(eventsData);
    }
}

// PUT - Update events in Supabase
export async function PUT(request: NextRequest) {
    try {
        const updatedConfig = await request.json();
        const events = updatedConfig.events || [];

        // Update each event
        for (const event of events) {
            const row = eventToRow(event);

            const { error } = await supabaseAdmin
                .from('events')
                .upsert(row, { onConflict: 'id' });

            if (error) {
                console.error('Error updating event:', event.id, error);
                return NextResponse.json(
                    { success: false, error: error.message },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Events updated successfully',
        });
    } catch (error) {
        console.error('Error updating events:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update events' },
            { status: 500 }
        );
    }
}

// POST - Create new event
export async function POST(request: NextRequest) {
    try {
        const newEvent = await request.json();
        const row = eventToRow(newEvent);

        const { error } = await supabaseAdmin
            .from('events')
            .insert(row);

        if (error) {
            console.error('Error creating event:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Event created successfully',
        });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create event' },
            { status: 500 }
        );
    }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('id');

        if (!eventId) {
            return NextResponse.json(
                { success: false, error: 'Event ID required' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('events')
            .delete()
            .eq('id', eventId);

        if (error) {
            console.error('Error deleting event:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
