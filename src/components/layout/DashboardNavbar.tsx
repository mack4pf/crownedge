"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search, LogOut, Menu, X, AlertCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/ui/NotificationBell";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useRouter } from "next/navigation";

interface DashboardNavbarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ mobileMenuOpen, setMobileMenuOpen }: DashboardNavbarProps) {
    const { data: session } = useSession();
    const user = session?.user as any;
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();

    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        setShowLogoutModal(false);
        await signOut({ redirect: true, callbackUrl: "/" });
    };

    return (
        <>
            <nav className="h-20 border-b border-white/5 bg-[var(--nav-bg)] backdrop-blur-xl fixed top-0 left-0 right-0 z-40 px-6 md:px-8 flex items-center justify-between transition-colors duration-300">
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

                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 overflow-hidden rounded-lg group-hover:scale-110 transition-transform">
                            <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <span className="text-lg font-black gold-gradient tracking-tighter uppercase">CrownEdge</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 px-4 py-2 bg-[var(--card-bg)] rounded-2xl border border-white/5 w-64 xl:w-96 group focus-within:border-brand-gold/30 transition-all">
                        <Search size={18} className="text-zinc-500 group-focus-within:text-brand-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Search terminal..."
                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] opacity-70">Portfolio Value</span>
                        <span className="text-lg font-black tabular-nums tracking-tighter">${user?.balance?.toLocaleString() || '0.00'}</span>
                    </div>

                    <ThemeToggle />

                    <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

                    <NotificationBell fetchUrl="/api/user/notifications" />

                    <div
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-[var(--card-bg)] border border-white/10 hover:border-brand-gold/20 cursor-pointer transition-all group lg:min-w-[160px]"
                    >
                        <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center font-black text-white shadow-lg uppercase text-sm border border-white/10">
                            {getInitials(user?.name || 'User')}
                        </div>
                        <div className="hidden lg:block truncate max-w-[100px]">
                            <p className="text-xs font-black leading-none mb-1 truncate">{user?.name || 'User'}</p>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{user?.role === 'admin' ? 'Admin' : 'VIP'}</p>
                        </div>
                        <LogOut size={16} className="text-zinc-500 group-hover:text-red-500 transition-colors ml-auto" />
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[var(--background)] border border-white/10 rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={32} />
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2 italic">Terminate <span className="text-red-500">Session?</span></h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                                Are you sure you want to log out? You will need to re-authenticate to access the institutional terminal.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="py-4 rounded-xl border border-white/10 text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="py-4 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all outline-none"
                                >
                                    Yes, Log Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
