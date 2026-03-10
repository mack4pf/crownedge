import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        // For demonstration, we'll return a mock "System Status" and check DB connection
        // In a real app, this might fetch market data
        return NextResponse.json({
            status: 'Elite System Online',
            database: 'Connected',
            latency: '1.2ms',
            active_traders: 4920,
            timestamp: new Date().toISOString()
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Institutional System Down',
            message: error.message
        }, { status: 500 });
    }
}
