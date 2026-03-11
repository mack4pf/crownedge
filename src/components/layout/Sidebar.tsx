"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    TrendingUp,
    Wallet,
    History,
    Settings,
    MessageSquare,
    ArrowUpRight,
    ArrowDownLeft,
    X,
    Loader2,
    User,
    ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/dashboard" },
    { icon: <TrendingUp size={20} />, label: "Trading Terminal", href: "/dashboard/trading" },
    { icon: <Wallet size={20} />, label: "VIP Wallet & Deposits", href: "/dashboard/wallet" },
    { icon: <History size={20} />, label: "Trade History", href: "/dashboard/history" },
    { icon: <TrendingUp size={20} />, label: "VIP Signal Subscription", href: "/dashboard/subscription" },
    { icon: <User size={20} />, label: "Account Profile & KYC", href: "/dashboard/profile" },
    { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
    { icon: <MessageSquare size={20} />, label: "Account Manager Chat", href: "/dashboard/chat" },
];

interface SidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

interface LevelData {
    level: string;
    color: string;
    totalActivity: number;
    progress: number;
    remaining: number;
    nextLevel: string | null;
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
    const pathname = usePathname();
    const [levelData, setLevelData] = useState<LevelData | null>(null);

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const res = await fetch("/api/account-level");
                if (res.ok) {
                    const data = await res.json();
                    setLevelData(data);
                }
            } catch (err) {
                console.error("Failed to fetch level:", err);
            }
        };
        fetchLevel();
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const sidebarContent = (
        <>
            <div className="space-y-2">
                <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Main Menu</p>
                {NAV_ITEMS.map((item, i) => (
                    <motion.div
                        key={item.href}
                        initial={mobileMenuOpen ? { opacity: 0, x: -30 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${pathname === item.href
                                ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20"
                                : "text-zinc-500 hover:text-white hover:bg-[var(--card-bg)]"
                                }`}
                        >
                            <span className={pathname === item.href ? "text-black" : "text-zinc-500 group-hover:text-brand-gold transition-colors"}>
                                {item.icon}
                            </span>
                            <span className="font-bold tracking-tight">{item.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                {/* Account Level — Real Data */}
                <div className="glass p-6 rounded-3xl border-brand-gold/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 blur-2xl -z-10" />
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Account Level</p>
                    {levelData ? (
                        <>
                            <h4 className="font-black text-lg mb-4" style={{ color: levelData.color }}>
                                {levelData.level}
                            </h4>
                            <div className="w-full bg-[var(--card-bg)] h-1.5 rounded-full mb-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${levelData.progress}%`, backgroundColor: levelData.color }}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold">
                                {levelData.nextLevel
                                    ? `${levelData.remaining} more to ${levelData.nextLevel}`
                                    : "Maximum level reached"
                                }
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 py-2">
                            <Loader2 size={14} className="animate-spin text-zinc-600" />
                            <span className="text-[10px] text-zinc-600 font-bold">Loading...</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/dashboard/wallet"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
                    >
                        <ArrowUpRight size={18} /> <span className="text-xs font-bold uppercase">Deposit</span>
                    </Link>
                    <Link
                        href="/dashboard/wallet"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
                    >
                        <ArrowDownLeft size={18} /> <span className="text-xs font-bold uppercase">Withdraw</span>
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-[var(--background)] h-screen fixed left-0 top-0 pt-28 pb-10 px-6 flex-col justify-between hidden lg:flex z-30 transition-colors duration-300">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar — slide from left */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.aside
                            className="fixed inset-y-0 left-0 z-[48] w-[300px] lg:hidden flex flex-col pt-28 pb-10 px-6 justify-between overflow-y-auto"
                            style={{
                                background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)",
                            }}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <motion.button
                                className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 hover:border-brand-gold/30 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <X size={20} className="text-zinc-400" />
                            </motion.button>

                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
