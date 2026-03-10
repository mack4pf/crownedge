"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardNavbarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ mobileMenuOpen, setMobileMenuOpen }: DashboardNavbarProps) {
    const { data: session } = useSession();
    const user = session?.user as any;

    return (
        <nav className="h-20 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-40 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-12">
                {/* Mobile Hamburger */}
                <button
                    className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 hover:border-brand-gold/30 transition-all"
                    style={{
                        background: "linear-gradient(135deg, #0a1628 0%, #0d2040 100%)",
                    }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <AnimatePresence mode="wait">
                        {mobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={22} className="text-brand-gold" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={22} className="text-brand-gold" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="relative w-8 h-8 overflow-hidden rounded-lg">
                        <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="text-lg font-black gold-gradient tracking-tighter uppercase">CrownEdge</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 w-96 group focus-within:border-brand-gold/30 transition-all">
                    <Search size={18} className="text-zinc-500 group-focus-within:text-brand-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search assets, trades, history..."
                        className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Portfolio Balance</span>
                    <span className="text-xl font-black tabular-nums">${user?.balance?.toLocaleString() || '0.00'}</span>
                </div>

                <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all text-zinc-400 hover:text-white relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-gold rounded-full border-2 border-[#05070a]" />
                </button>

                <div
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-gold/20 cursor-pointer transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center font-bold text-white shadow-lg uppercase">
                        {user?.name?.substring(0, 2) || 'U'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold leading-none mb-1">{user?.name || 'User'}</p>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
                    </div>
                    <LogOut size={16} className="text-zinc-500 group-hover:text-red-500 transition-colors ml-2 hidden sm:block" />
                </div>
            </div>
        </nav>
    );
}
