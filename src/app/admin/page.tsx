import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import Setting from "@/models/Setting";
import Withdrawal from "@/models/Withdrawal";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // Check if the user is authorized (admintrader@crownedgebroker.pro or role admin)
    if (!session || !session.user) {
        redirect("/login");
    }

    const email = session.user.email;
    if (email !== "admintrader@crownedgebroker.pro") {
        redirect("/dashboard"); // Kick regular users out
    }

    await dbConnect();

    // Aggregate admin stats
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
    const deposits = await Deposit.find().populate('userId', 'name email').sort({ createdAt: -1 }).lean();
    const withdrawals = await Withdrawal.find().populate('userId', 'name email').sort({ createdAt: -1 }).lean();
    const requiredSettings = [
        { key: 'telegram_contact', value: 'crownedgebroker', description: 'Telegram username or link' },
        { key: 'whatsapp_number', value: '+1234567890', description: 'WhatsApp contact number' },
        { key: 'subscription_basic_vip_price', value: '500', description: 'Basic VIP monthly price in USD' },
        { key: 'subscription_silver_vip_price', value: '750', description: 'Silver VIP monthly price in USD' },
        { key: 'subscription_gold_vip_price', value: '2500', description: 'Gold VIP monthly price in USD' },
        { key: 'subscription_diamond_vip_price', value: '5000', description: 'Diamond VIP monthly price in USD' },
    ];

    for (const setting of requiredSettings) {
        await Setting.findOneAndUpdate({ key: setting.key }, { $setOnInsert: setting }, { upsert: true });
    }

    const settings = await Setting.find().lean();

    // Mongoose strings to primitives for client component
    const safeUsers = users.map(u => ({ ...u, _id: u._id.toString() }));
    const safeDeposits = deposits.map(d => ({
        ...d,
        _id: d._id.toString(),
        userId: d.userId ? { ...d.userId, _id: d.userId._id.toString() } : null,
        createdAt: (d as any).createdAt.toISOString()
    }));
    const safeWithdrawals = withdrawals.map(w => ({
        ...w,
        _id: w._id.toString(),
        userId: w.userId ? { ...w.userId, _id: w.userId._id.toString() } : null,
        createdAt: (w as any).createdAt.toISOString()
    }));
    const safeSettings = settings.map(s => ({ ...s, _id: s._id.toString() }));

    return (
        <AdminDashboardClient
            users={safeUsers}
            deposits={safeDeposits}
            withdrawals={safeWithdrawals}
            settings={safeSettings}
        />
    );
}
