import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const eventsFilePath = path.join(process.cwd(), 'src/data/events.json');

export async function GET() {
    try {
        const data = await fs.readFile(eventsFilePath, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch {
        return NextResponse.json({ events: [], defaultTheme: { primaryColor: '#1a1a2e', accentColor: '#c9a962' } });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        await fs.writeFile(eventsFilePath, JSON.stringify(body, null, 2), 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save events' }, { status: 500 });
    }
}
