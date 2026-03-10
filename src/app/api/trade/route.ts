import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Trade from '@/models/Trade';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;
        const { asset, type, amount, duration } = await req.json();

        // Validation
        if (!asset || !type || !amount || !duration) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!['BUY', 'SELL'].includes(type)) {
            return NextResponse.json({ error: 'Invalid trade type. Must be BUY or SELL' }, { status: 400 });
        }

        if (amount <= 0) {
            return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
        }

        // Check user balance
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < amount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Deduct amount from balance immediately
        user.balance -= amount;

        // Win/Loss logic: 5% chance of winning
        const random = Math.random() * 100;
        const isWin = random <= 5; // 5% chance

        let payout = 0;
        let status: 'WIN' | 'LOSS';

        if (isWin) {
            // Win: user gets back investment + 50% profit
            payout = amount * 1.5;
            status = 'WIN';
            user.balance += payout;
        } else {
            // Loss: user loses 20% of investment (gets back 80%)
            const refund = amount * 0.80;
            payout = refund;
            status = 'LOSS';
            user.balance += refund;
        }

        await user.save();

        // Create trade record
        const trade = await Trade.create({
            userId,
            asset,
            type,
            amount,
            entryPrice: Math.random() * 100000, // Simulated
            exitPrice: Math.random() * 100000,   // Simulated
            status,
            duration,
            payout,
        });

        return NextResponse.json({
            success: true,
            trade: {
                id: trade._id,
                asset: trade.asset,
                type: trade.type,
                amount: trade.amount,
                status: trade.status,
                payout: trade.payout,
                duration: trade.duration,
            },
            newBalance: user.balance,
            result: status,
            profit: isWin ? (payout - amount) : -(amount - payout),
        });

    } catch (error: any) {
        console.error('Trade Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
