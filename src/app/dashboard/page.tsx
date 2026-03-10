"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownLeft,
    Zap,
    Radio,
    ShieldAlert,
    ShieldCheck,
    Loader2,
    Clock,
    Trophy,
    BarChart3,
    CircleDollarSign,
} from "lucide-react";
import DepositPrompt from "@/components/ui/DepositPrompt";
import NotificationBell from '@/components/ui/NotificationBell';

// Currency symbols
const SYMBOLS: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥",
    BRL: "R$", ZAR: "R", MAD: "MAD", CAD: "C$", AUD: "A$",
    CHF: "CHF", INR: "₹", SGD: "S$", HKD: "HK$", NZD: "NZ$",
    KRW: "₩", MXN: "$", SAR: "﷼", AED: "د.إ", THB: "฿",
    BTC: "₿", TRY: "₺", PLN: "zł", RUB: "₽", PHP: "₱",
    IDR: "Rp", MYR: "RM", VND: "₫", SEK: "kr", NOK: "kr",
};

interface DashboardData {
    user: {
        name: string;
        email: string;
        balance: number;
        currency: string;
        country: string;
        role: string;
        status: string;
        isVerified: boolean;
        createdAt: string;
    };
    stats: {
        totalProfit: number;
        totalLoss: number;
        netPnL: number;
        wins: number;
        losses: number;
        winRate: number;
        pendingTrades: number;
        totalTrades: number;
    };
    recentTrades: {
        id: string;
        asset: string;
        type: string;
        amount: number;
        status: string;
        payout: number;
        createdAt: string;
    }[];
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [dashData, setDashData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch("/api/dashboard");
                const data = await res.json();
                if (res.ok) setDashData(data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-brand-gold" size={40} />
            </div>
        );
    }

    const user = dashData?.user;
    const stats = dashData?.stats;
    const trades = dashData?.recentTrades || [];
    const sym = SYMBOLS[user?.currency || "USD"] || "$";
    const firstName = user?.name?.split(" ")[0] || "Trader";
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    return (
        <div className="space-y-8 pb-12">
            {/* ═══════════ GREETING SECTION ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
            >
                <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">{greeting}</p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Welcome, <span className="gold-gradient">{firstName}</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">
                        {user?.role === "admin" ? "Administrator" : "Premium Trader"} • {user?.email}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Markets Open
                    </span>
                </div>
            </motion.div>

            <div className="flex items-center gap-4">
                <Link href="/dashboard/settings" className="text-sm font-black uppercase text-brand-gold hover:underline">Settings</Link>
                <NotificationBell fetchUrl="/api/user/notifications" />
            </div>

            {/* ═══════════ KYC BANNER (if not verified) ═══════════ */}
            {!user?.isVerified && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5"
                >
                    <ShieldAlert size={24} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-500">Account Verification Required</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Complete your KYC to unlock full trading features, withdrawals, and higher limits.</p>
                    </div>
                    <Link
                        href="/dashboard/profile"
                        className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all"
                    >
                        Verify Now
                    </Link>
                </motion.div>
            )}

            {/* ═══════════ BALANCE & STATS ═══════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Main Balance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="md:col-span-2 glass p-7 rounded-[28px] border-white/5 relative overflow-hidden group hover:border-brand-gold/10 transition-all"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 blur-3xl -z-10 rounded-full group-hover:bg-brand-gold/10 transition-all" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-brand-gold/10 rounded-2xl">
                            <Wallet className="text-brand-gold" size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Total Balance</p>
                            <p className="text-[10px] text-zinc-600 font-medium">{user?.currency || "USD"} Account</p>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tabular-nums tracking-tight">
                        {sym}{(user?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <div className="flex items-center gap-2 mt-3">
                        {user?.isVerified ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500"><ShieldCheck size={12} /> Verified</span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500"><ShieldAlert size={12} /> Unverified</span>
                        )}
                        <span className="text-zinc-700">•</span>
                        <span className="text-[10px] font-bold text-zinc-500">{user?.status === "active" ? "Active" : "Pending"}</span>
                    </div>
                </motion.div>

                {/* Net P&L */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-7 rounded-[28px] border-white/5 hover:border-brand-gold/10 transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            {(stats?.netPnL || 0) >= 0
                                ? <TrendingUp className="text-green-500" size={22} />
                                : <TrendingDown className="text-red-500" size={22} />
                            }
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${(stats?.netPnL || 0) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {(stats?.netPnL || 0) >= 0 ? "Profit" : "Loss"}
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Net P&L</p>
                    <h3 className={`text-2xl font-black tabular-nums ${(stats?.netPnL || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {(stats?.netPnL || 0) >= 0 ? "+" : ""}{sym}{Math.abs(stats?.netPnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </motion.div>

                {/* Win Rate / Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass p-7 rounded-[28px] border-white/5 hover:border-brand-gold/10 transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <Trophy className="text-brand-gold" size={22} />
                        </div>
                        <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-brand-gold/10 text-brand-gold">
                            {stats?.totalTrades || 0} Trades
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Win Rate</p>
                    <h3 className="text-2xl font-black tabular-nums">{stats?.winRate || 0}%</h3>
                    <p className="text-[10px] text-zinc-600 mt-1 font-medium">
                        {stats?.wins || 0}W / {stats?.losses || 0}L
                        {(stats?.pendingTrades || 0) > 0 && ` • ${stats?.pendingTrades} active`}
                    </p>
                </motion.div>
            </div>

            {/* ═══════════ QUICK ACTION BUTTONS ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 px-1">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ActionButton
                        href="/dashboard/wallet"
                        icon={<ArrowUpRight size={22} />}
                        label="Deposit"
                        color="green"
                    />
                    <ActionButton
                        href="/dashboard/wallet"
                        icon={<ArrowDownLeft size={22} />}
                        label="Withdraw"
                        color="red"
                    />
                    <ActionButton
                        href="/dashboard/trading"
                        icon={<Zap size={22} />}
                        label="Start Trading"
                        color="gold"
                    />
                    <ActionButton
                        href="/dashboard/subscription"
                        icon={<Radio size={22} />}
                        label="Get Signals"
                        color="purple"
                    />
                </div>
            </motion.div>

            {/* ═══════════ RECENT HISTORY ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass rounded-[28px] border-white/5 overflow-hidden"
            >
                <div className="flex items-center justify-between p-7 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/5 rounded-xl">
                            <Clock size={18} className="text-brand-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Recent Activity</h3>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Latest transactions & trades</p>
                        </div>
                    </div>
                    {trades.length > 0 && (
                        <Link href="/dashboard/history" className="text-[10px] font-black text-brand-gold uppercase tracking-wider hover:underline">
                            View All
                        </Link>
                    )}
                </div>

                {trades.length === 0 ? (
                    <div className="px-7 pb-8 text-center py-12">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <BarChart3 size={28} className="text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 font-bold text-sm mb-1">No activity yet</p>
                        <p className="text-zinc-600 text-xs">Your trades and transactions will appear here.</p>
                        <Link href="/dashboard/trading" className="inline-flex items-center gap-2 mt-5 gold-button px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all">
                            <Zap size={16} /> Place Your First Trade
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {trades.map((trade) => (
                            <div key={trade.id} className="flex items-center justify-between px-7 py-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trade.type === "BUY" || trade.type === "CALL"
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-red-500/10 text-red-500"
                                        }`}>
                                        {trade.type === "BUY" || trade.type === "CALL"
                                            ? <TrendingUp size={18} />
                                            : <TrendingDown size={18} />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{trade.asset}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{trade.type} • {new Date(trade.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm tabular-nums">{sym}{trade.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${trade.status === "WIN" ? "text-green-500" :
                                        trade.status === "LOSS" ? "text-red-500" :
                                            trade.status === "PENDING" ? "text-amber-500" : "text-zinc-500"
                                        }`}>
                                        {trade.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* ═══════════ DEPOSIT PROMPT POPUP ═══════════ */}
            <DepositPrompt
                balance={user?.balance || 0}
                currency={user?.currency || "USD"}
            />
        </div>
    );
}

function ActionButton({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    const colorMap: Record<string, string> = {
        green: "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30",
        red: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30",
        gold: "bg-brand-gold hover:brightness-110 text-black shadow-lg shadow-brand-gold/30",
        purple: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30",
    };

    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${colorMap[color]}`}
        >
            {icon}
            <span className="text-xs font-black uppercase tracking-[0.15em]">{label}</span>
        </Link>
    );
}
