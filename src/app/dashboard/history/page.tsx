"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    History, ArrowUpRight, ArrowDownLeft,
    TrendingUp, TrendingDown, Clock,
    CheckCircle2, XCircle, FileText, Loader2,
    Filter
} from "lucide-react";

type TabType = "ALL" | "TRADES" | "DEPOSITS" | "WITHDRAWALS";

export default function HistoryPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<TabType>("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [historyData, setHistoryData] = useState<{
        trades: any[];
        deposits: any[];
        withdrawals: any[];
    }>({ trades: [], deposits: [], withdrawals: [] });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/history");
                if (res.ok) {
                    const data = await res.json();
                    setHistoryData(data);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Helper to format currency
    const formatCurrency = (amount: number, currency: string = "USD") => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    // Status styling helpers
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'WIN':
            case 'APPROVED':
                return { bg: 'bg-green-500/10', text: 'text-green-500', icon: <CheckCircle2 size={16} /> };
            case 'LOSS':
            case 'REJECTED':
                return { bg: 'bg-red-500/10', text: 'text-red-500', icon: <XCircle size={16} /> };
            case 'PENDING':
                return { bg: 'bg-zinc-500/10', text: 'text-zinc-500', icon: <Clock size={16} /> };
            case 'UNDER_REVIEW':
                return { bg: 'bg-brand-gold/10', text: 'text-brand-gold animate-pulse', icon: <Clock size={16} /> };
            default:
                return { bg: 'bg-white/5', text: 'text-white', icon: <Clock size={16} /> };
        }
    };

    // Prepare unified chronological list for "ALL" tab
    const unifiedHistory = [
        ...historyData.trades.map(t => ({ ...t, _type: 'TRADE' })),
        ...historyData.deposits.map(d => ({ ...d, _type: 'DEPOSIT' })),
        ...historyData.withdrawals.map(w => ({ ...w, _type: 'WITHDRAWAL' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filtered data based on active tab
    const getFilteredData = () => {
        switch (activeTab) {
            case "TRADES": return historyData.trades.map(t => ({ ...t, _type: 'TRADE' }));
            case "DEPOSITS": return historyData.deposits.map(d => ({ ...d, _type: 'DEPOSIT' }));
            case "WITHDRAWALS": return historyData.withdrawals.map(w => ({ ...w, _type: 'WITHDRAWAL' }));
            default: return unifiedHistory;
        }
    };

    const currentData = getFilteredData();

    return (
        <div className="space-y-8 md:space-y-12 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Ledger <span className="text-brand-gold">History</span></h1>
                    <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-2 leading-relaxed">
                        Comprehensive log of all institutional <br className="hidden md:block" />trades, deposits, and withdrawals.
                    </p>
                </div>

                {/* Tabs */}
                <div className="w-full md:w-auto overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 w-max md:w-auto">
                        {(["ALL", "TRADES", "DEPOSITS", "WITHDRAWALS"] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transition-colors whitespace-nowrap ${activeTab === tab
                                        ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20"
                                        : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-6 glass rounded-[40px] border-white/5">
                    <Loader2 className="animate-spin text-brand-gold" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Retrieving Ledger Data...</p>
                </div>
            ) : currentData.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-6 glass rounded-[40px] border-white/5 border-dashed border-2">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <History className="text-zinc-700" size={40} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-600">No Records Found</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700">Your {activeTab !== "ALL" ? activeTab.toLowerCase() : "transaction"} ledger is currently empty.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {currentData.map((item, idx) => {
                            const { date, time } = formatDate(item.createdAt);
                            const style = getStatusStyle(item.status);

                            // Determine item-specific details
                            let icon, title, subtitle, amountDisplay, amountColor;

                            if (item._type === 'TRADE') {
                                icon = item.type === 'BUY' ? <TrendingUp size={24} className="text-blue-400" /> : <TrendingDown size={24} className="text-purple-400" />;
                                title = `${item.asset} ${item.type}`;
                                subtitle = `${item.duration}s Duration`;

                                if (item.status === 'WIN') {
                                    amountDisplay = `+${formatCurrency(item.payout, item.currency)}`;
                                    amountColor = "text-green-500";
                                } else if (item.status === 'LOSS') {
                                    amountDisplay = `-${formatCurrency(item.amount, item.currency)}`;
                                    amountColor = "text-red-500";
                                } else {
                                    amountDisplay = formatCurrency(item.amount, item.currency);
                                    amountColor = "text-white";
                                }
                            } else if (item._type === 'DEPOSIT') {
                                icon = <ArrowDownLeft size={24} className="text-green-500" />;
                                title = "Capital Deposit";
                                subtitle = item.method;
                                amountDisplay = `+${formatCurrency(item.amountLocal || item.amount, item.currency)}`;
                                amountColor = item.status === 'APPROVED' ? "text-green-500" : "text-white";
                            } else if (item._type === 'WITHDRAWAL') {
                                icon = <ArrowUpRight size={24} className="text-red-500" />;
                                title = "Capital Withdrawal";
                                subtitle = item.method;
                                amountDisplay = `-${formatCurrency(item.amountLocal || item.amount, item.currency)}`;
                                amountColor = item.status === 'APPROVED' ? "text-red-500" : "text-white";
                            }

                            return (
                                <motion.div
                                    key={`${item._type}-${item._id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                                    className="glass p-5 md:p-6 rounded-[28px] border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-gold/20 transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            {icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-tight text-white mb-1">{title}</h4>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{subtitle}</p>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <p className="text-[9px] font-mono text-zinc-600 tracking-wider">{date} - {time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1.5 hidden md:block">Transaction Value</p>
                                            <p className={`text-lg md:text-xl font-black tabular-nums italic ${amountColor}`}>
                                                {amountDisplay}
                                            </p>
                                        </div>

                                        <div className={`px-4 py-2 ${style.bg} border border-white/5 rounded-xl flex items-center gap-2 min-w-[120px] justify-center shadow-inner`}>
                                            {style.icon}
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${style.text}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
