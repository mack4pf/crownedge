import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Deposit from '@/models/Deposit';
import User from '@/models/User';
import { sendDepositApprovedEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.email !== 'admintrader@crownedgebroker.pro') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, userId, amount } = await req.json();

        await dbConnect();

        // Mark deposit as approved
        const deposit = await Deposit.findByIdAndUpdate(id, { status: 'APPROVED' }, { new: true });
        if (!deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });

        // Add money to user balance
        const user = await User.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });

        // Send Email
        if (user?.email) {
            await sendDepositApprovedEmail(user.email, amount);
        }

        return NextResponse.json({ success: true, message: 'Deposit approved' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
