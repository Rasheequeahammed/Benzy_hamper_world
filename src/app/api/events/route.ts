import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import eventsData from '@/data/events.json';

// GET - Read events from Supabase (production) or local file (fallback)
export async function GET() {
    try {
        // Try Supabase first
        const { data, error } = await supabaseAdmin
            .from('events_config')
            .select('config')
            .eq('id', 1)
            .single();

        if (error) {
            console.log('Supabase fetch error, using local data:', error.message);
            return NextResponse.json(eventsData);
        }

        if (data?.config) {
            return NextResponse.json(data.config);
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
        const updatedEvents = await request.json();

        // Upsert to Supabase (insert or update)
        const { error } = await supabaseAdmin
            .from('events_config')
            .upsert({
                id: 1,
                config: updatedEvents,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Supabase update error:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
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
