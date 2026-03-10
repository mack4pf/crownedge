import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).email !== 'admintrader@crownedgebroker.pro') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id, status } = await req.json();

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        // If rejection, we should refund the user balance? 
        // Usually, the balance is deducted at request time.
        if (status === 'REJECTED' && withdrawal.status !== 'REJECTED') {
            const user = await User.findById(withdrawal.userId);
            if (user) {
                user.balance += withdrawal.amountLocal;
                await user.save();
            }
        }

        withdrawal.status = status;
        await withdrawal.save();

        return NextResponse.json({ success: true, withdrawal });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
