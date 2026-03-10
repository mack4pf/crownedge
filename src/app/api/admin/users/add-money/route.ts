import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import { sendBalanceAddedEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.email !== 'admintrader@crownedgebroker.pro') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, amount } = await req.json();

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Add money
        user.balance += amount;
        await user.save();

        // Create a fake deposit stub so it shows in history
        await Deposit.create({
            userId,
            amountLocal: amount,
            currency: user.currency || 'USD',
            method: 'SYSTEM_CREDIT',
            status: 'APPROVED'
        });

        // Send Email
        if (user.email) {
            await sendBalanceAddedEmail(user.email, amount, user.currency || 'USD');
        }

        return NextResponse.json({ success: true, message: 'Money added successfully' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
