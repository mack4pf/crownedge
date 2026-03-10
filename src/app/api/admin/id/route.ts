import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        const admin = await User.findOne({ email: 'admintrader@crownedgebroker.pro' });
        if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        return NextResponse.json({ id: admin._id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
