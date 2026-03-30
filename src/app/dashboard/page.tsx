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
    Cpu
} from "lucide-react";
import DepositPrompt from "@/components/ui/DepositPrompt";

// Currency symbols
const SYMBOLS: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥",
    BRL: "R$", ZAR: "R", MAD: "MAD", CAD: "C$", AUD: "A$",
    CHF: "CHF", INR: "₹", SGD: "S$", HKD: "HK$", NZD: "NZ$",
    KRW: "₩", MXN: "$", SAR: "﷼", AED: "د.إ", THB: "฿",
    BTC: "₿", TRY: "₺", PLN: "zł", RUB: "₽", PHP: "₱",
    IDR: "Rp", MYR: "RM", VND: "₫", SEK: "kr", NOK: "kr",
    NGN: "₦", GHS: "GH₵", KES: "Ksh", UGX: "USh", EGP: "E£",
    DZD: "DA", TND: "DT",
};

interface DashboardData {
    user: {
        name: string;
        email: string;
        balance: number;
        actualDeposit: number;
        currency: string;
        country: string;
        role: string;
        status: string;
        isVerified: boolean;
        aiTraderActive?: boolean;
        aiProfitTarget?: number;
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
    const [aiLoading, setAiLoading] = useState(false);

    const handleToggleAI = async () => {
        if (!dashData?.user) return;
        setAiLoading(true);
        const newStatus = !(dashData.user as any).aiTraderActive;
        try {
            const res = await fetch("/api/user/ai-trader/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: newStatus })
            });
            if (res.ok) {
                // Refresh data
                const dashRes = await fetch("/api/dashboard");
                const data = await dashRes.json();
                if (dashRes.ok) setDashData(data);
            }
        } catch (err) {
            console.error(err);
        }
        setAiLoading(false);
    };

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

            {/* ═══════════ PORTFOLIO OVERVIEW — 3 HERO CARDS ═══════════ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* ──── Actual Deposit ──── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="relative glass p-7 rounded-[28px] border-white/5 overflow-hidden group hover:border-cyan-500/20 transition-all"
                >
                    <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/8 blur-3xl -z-10 rounded-full group-hover:bg-cyan-500/15 transition-all" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 blur-2xl -z-10 rounded-full" />
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/10">
                            <CircleDollarSign className="text-cyan-400" size={22} />
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actual Deposit</p>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tabular-nums tracking-tight">
                        {sym}{(user?.actualDeposit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[10px] text-zinc-600 font-medium mt-2">Original deposited capital</p>
                    <div className="mt-4 h-[3px] rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: `${Math.min(100, (user?.actualDeposit || 0) > 0 ? 100 : 0)}%` }} />
                    </div>
                </motion.div>

                {/* ──── Available Balance ──── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative glass p-7 rounded-[28px] border-white/5 overflow-hidden group hover:border-brand-gold/20 transition-all"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/8 blur-3xl -z-10 rounded-full group-hover:bg-brand-gold/15 transition-all" />
                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-brand-gold/5 blur-2xl -z-10 rounded-full" />
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 bg-brand-gold/10 rounded-2xl border border-brand-gold/10">
                            <Wallet className="text-brand-gold" size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Available Balance</p>
                            <p className="text-[10px] text-zinc-600 font-medium">{user?.currency || "USD"} Account</p>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tabular-nums tracking-tight">
                        {sym}{(user?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        {user?.isVerified ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500"><ShieldCheck size={12} /> Verified</span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500"><ShieldAlert size={12} /> Unverified</span>
                        )}
                        <span className="text-zinc-700">•</span>
                        <span className="text-[10px] font-bold text-zinc-500">{user?.status === "active" ? "Active" : "Pending"}</span>
                    </div>
                    <div className="mt-4 h-[3px] rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full" style={{ width: `${Math.min(100, (user?.balance || 0) > 0 ? 100 : 0)}%` }} />
                    </div>
                </motion.div>

                {/* ──── Profit ──── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative glass p-7 rounded-[28px] border-white/5 overflow-hidden group hover:border-green-500/20 transition-all"
                >
                    <div className="absolute top-0 right-0 w-36 h-36 bg-green-500/8 blur-3xl -z-10 rounded-full group-hover:bg-green-500/15 transition-all" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 blur-2xl -z-10 rounded-full" />
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/10">
                                <TrendingUp className="text-green-500" size={22} />
                            </div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Total Profit</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${(stats?.totalProfit || 0) > 0 ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-500"}`}>
                            {(stats?.totalProfit || 0) > 0 ? "Earning" : "—"}
                        </span>
                    </div>
                    <h2 className={`text-3xl md:text-4xl font-black tabular-nums tracking-tight ${(stats?.totalProfit || 0) > 0 ? "text-green-400" : ""}`}>
                        +{sym}{(stats?.totalProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[10px] text-zinc-600 font-medium mt-2">Accumulated trading gains</p>
                    <div className="mt-4 h-[3px] rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: `${Math.min(100, (stats?.totalProfit || 0) > 0 ? 100 : 0)}%` }} />
                    </div>
                </motion.div>
            </div>

            {/* ═══════════ SECONDARY STATS ROW ═══════════ */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {/* Net P&L */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    className="glass p-6 rounded-[24px] border-white/5 hover:border-brand-gold/10 transition-all"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-white/5 rounded-xl">
                            {(stats?.netPnL || 0) >= 0
                                ? <TrendingUp className="text-green-500" size={18} />
                                : <TrendingDown className="text-red-500" size={18} />
                            }
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${(stats?.netPnL || 0) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {(stats?.netPnL || 0) >= 0 ? "Profit" : "Loss"}
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Net P&L</p>
                    <h3 className={`text-xl font-black tabular-nums ${(stats?.netPnL || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {(stats?.netPnL || 0) >= 0 ? "+" : ""}{sym}{Math.abs(stats?.netPnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </motion.div>

                {/* Win Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-[24px] border-white/5 hover:border-brand-gold/10 transition-all"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-white/5 rounded-xl">
                            <Trophy className="text-brand-gold" size={18} />
                        </div>
                        <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-brand-gold/10 text-brand-gold">
                            {stats?.totalTrades || 0} Trades
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Win Rate</p>
                    <h3 className="text-xl font-black tabular-nums">{stats?.winRate || 0}%</h3>
                    <p className="text-[10px] text-zinc-600 mt-1 font-medium">
                        {stats?.wins || 0}W / {stats?.losses || 0}L
                        {(stats?.pendingTrades || 0) > 0 && ` • ${stats?.pendingTrades} active`}
                    </p>
                </motion.div>

                {/* Total Loss */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="glass p-6 rounded-[24px] border-white/5 hover:border-red-500/10 transition-all col-span-2 md:col-span-1"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-white/5 rounded-xl">
                            <TrendingDown className="text-red-400" size={18} />
                        </div>
                        <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-red-500/10 text-red-400">
                            Total Loss
                        </span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Total Loss</p>
                    <h3 className="text-xl font-black tabular-nums text-red-400">
                        -{sym}{(stats?.totalLoss || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </motion.div>
            </div>

            {/* ═══════════ AI NEURAL TERMINAL ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="relative group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-brand-gold/5 to-purple-500/10 blur-3xl opacity-30 group-hover:opacity-50 transition-all -z-10" />
                <div className="glass p-8 rounded-[40px] border-white/5 relative bg-[#0a0d14]/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className={`p-5 rounded-3xl border transition-all duration-500 shadow-2xl ${user?.aiTraderActive ? 'bg-purple-600/20 border-purple-500/30 text-purple-400 shadow-purple-500/20' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                                <Cpu className={`${user?.aiTraderActive ? 'animate-pulse' : ''}`} size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter">AI Neural <span className="text-purple-400">Terminal</span></h3>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user?.aiTraderActive ? 'bg-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {user?.aiTraderActive ? 'Online & Optimizing' : 'System Standby'}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium max-w-md">Activate institutional-grade neural trading algorithms. When enabled, our AI agents manage your portfolio to hit specific institutional profit targets.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Institutional TP</p>
                                <p className="text-xl font-black tabular-nums text-white">{sym}{(user as any)?.aiProfitTarget?.toLocaleString() || "0.00"}</p>
                            </div>
                            <div className="flex-1 md:flex-none">
                                <button
                                    onClick={handleToggleAI}
                                    disabled={aiLoading}
                                    className={`w-full md:w-48 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${user?.aiTraderActive ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'gold-button text-black'}`}
                                >
                                    {aiLoading ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : user?.aiTraderActive ? (
                                        'Deactivate AI'
                                    ) : (
                                        'Activate System'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

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
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${["BUY", "CALL", "DEPOSIT", "AI TRADED"].includes(trade.type)
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-red-500/10 text-red-500"
                                        }`}>
                                        {["BUY", "CALL", "DEPOSIT", "AI TRADED"].includes(trade.type)
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
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${["WIN", "DEPOSITED SUCCESSFUL", "AI TRADED PROFIT"].includes(trade.status) ? "text-green-500" :
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
