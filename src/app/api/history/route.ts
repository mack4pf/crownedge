import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Trade from '@/models/Trade';
import Deposit from '@/models/Deposit';
import Withdrawal from '@/models/Withdrawal';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        const [trades, deposits, withdrawals] = await Promise.all([
            Trade.find({ userId }).sort({ createdAt: -1 }).lean(),
            Deposit.find({ userId }).sort({ createdAt: -1 }).lean(),
            Withdrawal.find({ userId }).sort({ createdAt: -1 }).lean()
        ]);

        return NextResponse.json({
            trades,
            deposits,
            withdrawals
        });
    } catch (error) {
        console.error('History API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
