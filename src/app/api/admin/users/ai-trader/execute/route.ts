import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Trade from '@/models/Trade';
import { sendCustomTemplateEmail } from '@/lib/mail';

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

        const profitAmount = amount || user.aiProfitTarget || 0;
        if (profitAmount <= 0) {
            return NextResponse.json({ error: 'Invalid profit amount' }, { status: 400 });
        }

        const oldBalance = user.balance;

        // Add profit to balance
        user.balance += profitAmount;
        await user.save();

        if (oldBalance < 10000 && user.balance >= 10000 && user.email) {
            await sendCustomTemplateEmail(
                user.email,
                "Action Required: VIP Signal Required",
                "Signal Purchase Required",
                `Your account profit has reached the 10,000 threshold. To continue trading and enable withdrawals, you must purchase a VIP Signal Subscription immediately. Please contact your account manager to purchase your signal.`
            );
        }

        // Create the trade record for history
        await Trade.create({
            userId,
            asset: "AI trader profit TP",
            type: "BUY",
            amount: profitAmount,
            entryPrice: 0,
            exitPrice: 0,
            status: "WIN",
            payout: profitAmount,
            duration: 0
        });

        return NextResponse.json({ success: true, message: `Profit of ${profitAmount} added to user account` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
