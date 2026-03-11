import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Trade from '@/models/Trade';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        // Get fresh user data
        const user = await User.findById(userId).select('-password -verificationCode -resetToken');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // ==========================================
        // MINER AUTO-PAYOUT LOGIC (1% every 48 hours)
        // ==========================================
        try {
            // Import dynamically to avoid circular dependency issues at the top if any
            const Miner = (await import('@/models/Miner')).default;
            const activeMiners = await Miner.find({ userId, status: 'ACTIVE' });

            let totalMinerPayout = 0;
            const now = new Date();
            const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

            for (const miner of activeMiners) {
                const timeSinceLastPaid = now.getTime() - new Date(miner.lastPaidAt).getTime();

                // If 48 hours have passed
                if (timeSinceLastPaid >= FORTY_EIGHT_HOURS) {
                    // Calculate how many 48-hour cycles have passed
                    const cycles = Math.floor(timeSinceLastPaid / FORTY_EIGHT_HOURS);

                    // 1% per 48h cycle
                    const payoutAmount = (miner.purchasePriceLocal * 0.01) * cycles;
                    totalMinerPayout += payoutAmount;

                    miner.lastPaidAt = now;
                    await miner.save();
                }
            }

            if (totalMinerPayout > 0) {
                // We must use the full User model to save properly, or update directly
                await User.findByIdAndUpdate(userId, {
                    $inc: { balance: totalMinerPayout }
                });
                user.balance += totalMinerPayout; // update local object for response
            }
        } catch (minerError) {
            console.error('Miner payout error:', minerError);
        }
        // ==========================================

        // Get recent trades (last 10)
        const recentTrades = await Trade.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Calculate P&L from completed trades
        const completedTrades = await Trade.find({ userId, status: { $in: ['WIN', 'LOSS'] } });
        let totalProfit = 0;
        let totalLoss = 0;
        let wins = 0;
        let losses = 0;

        completedTrades.forEach((trade: any) => {
            if (trade.status === 'WIN') {
                totalProfit += (trade.payout || 0);
                wins++;
            } else {
                totalLoss += trade.amount;
                losses++;
            }
        });

        const pendingTrades = await Trade.countDocuments({ userId, status: 'PENDING' });

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
                balance: user.balance,
                currency: user.currency,
                country: user.country,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified,
                aiTraderActive: user.aiTraderActive,
                aiProfitTarget: user.aiProfitTarget,
                createdAt: user.createdAt,
            },
            stats: {
                totalProfit,
                totalLoss,
                netPnL: totalProfit - totalLoss,
                wins,
                losses,
                winRate: (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 0,
                pendingTrades,
                totalTrades: wins + losses,
            },
            recentTrades: recentTrades.map((t: any) => ({
                id: t._id,
                asset: t.asset,
                type: t.type,
                amount: t.amount,
                status: t.status,
                payout: t.payout,
                createdAt: t.createdAt,
            })),
        });
    } catch (error: any) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
