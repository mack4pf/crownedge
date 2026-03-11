import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

export async function GET() {
    try {
        await dbConnect();
        const settings = await Setting.find({ key: 'whatsapp_number' }).lean();
        const whatsapp = settings.find(s => s.key === 'whatsapp_number')?.value || "";

        return NextResponse.json({ whatsapp });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
