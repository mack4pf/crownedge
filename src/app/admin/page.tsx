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
