import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;
        const { amount, method, walletAddress } = await req.json();

        if (!amount || !method || !walletAddress) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < amount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct balance immediately
        user.balance -= amount;
        await user.save();

        const withdrawal = await Withdrawal.create({
            userId,
            amountLocal: amount,
            currency: user.currency,
            method,
            walletAddress,
            status: 'PENDING'
        });

        return NextResponse.json({ success: true, withdrawal, newBalance: user.balance });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
