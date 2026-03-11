"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, TrendingUp, Bitcoin, BarChart3, Cpu, Building2, LogIn, UserPlus, LogOut, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
    { href: "/markets", label: "Markets", icon: <BarChart3 size={20} /> },
    { href: "/crypto", label: "Crypto", icon: <Bitcoin size={20} /> },
    { href: "/forex", label: "Forex", icon: <TrendingUp size={20} /> },
    { href: "/platform", label: "Platform", icon: <Cpu size={20} /> },
    { href: "/company", label: "Company", icon: <Building2 size={20} /> },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#05070a]/95 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-brand-gold/30">
                            <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter gold-gradient leading-none uppercase">CrownEdge</span>
                            <span className="text-[10px] tracking-[0.3em] font-medium text-zinc-400">BROKER</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {NAV_LINKS.map((link) => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-6">
                        {session ? (
                            <>
                                {session.user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-xs font-black uppercase tracking-[0.2em] text-brand-gold hover:brightness-110 transition-all flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-xl border border-brand-gold/20"
                                    >
                                        <ShieldAlert size={14} />
                                        Admin Control
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="text-xs font-black uppercase tracking-[0.2em] hover:text-brand-gold transition-colors flex items-center gap-2"
                                >
                                    <Cpu size={14} className="text-brand-gold" />
                                    Terminal
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Exit
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] hover:text-brand-gold transition-colors">Login</Link>
                                <Link href="/register" className="gold-button px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/10 hover:scale-105 active:scale-95 transition-all">Register</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger — in top navbar */}
                    <button
                        className="md:hidden relative w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 hover:border-brand-gold/30 transition-all"
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
                </div>
            </nav>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Slide Panel from Left */}
                        <motion.div
                            className="fixed inset-y-0 left-0 z-[58] w-[300px] md:hidden flex flex-col overflow-y-auto"
                            style={{
                                background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)",
                            }}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Header */}
                            <motion.div
                                className="p-8 pb-6 border-b border-white/5"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-3"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="relative w-12 h-12 overflow-hidden rounded-2xl border border-brand-gold/30 shadow-lg shadow-brand-gold/10">
                                            <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black tracking-tighter gold-gradient leading-none uppercase">CrownEdge</span>
                                            <span className="text-[9px] tracking-[0.3em] font-medium text-zinc-500">BROKER</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 hover:border-brand-gold/30 transition-all"
                                    >
                                        <X size={20} className="text-zinc-400" />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Nav Links */}
                            <div className="flex-1 px-6 py-8 space-y-1">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                                        >
                                            <span className="text-zinc-600 group-hover:text-brand-gold transition-colors duration-200">
                                                {link.icon}
                                            </span>
                                            <span className="text-sm font-bold uppercase tracking-[0.15em]">{link.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Auth Buttons */}
                            <motion.div
                                className="p-6 pt-2 space-y-3 border-t border-white/5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                {session ? (
                                    <>
                                        {session.user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-black uppercase tracking-[0.2em]"
                                            >
                                                <ShieldAlert size={18} />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="gold-button flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/10"
                                        >
                                            <Cpu size={18} />
                                            Go to Terminal
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-white/10 text-zinc-400 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em]"
                                        >
                                            <LogOut size={18} />
                                            Terminate Session
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-[0.2em]"
                                        >
                                            <LogIn size={18} className="text-brand-gold" />
                                            Login Terminal
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="gold-button flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/10"
                                        >
                                            <UserPlus size={18} />
                                            Apply for Access
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            {/* Footer Badge */}
                            <motion.div
                                className="px-6 pb-8 pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.45 }}
                            >
                                <div className="px-4 py-3 rounded-xl bg-brand-gold/5 border border-brand-gold/10 text-center">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold/60">Institutional-Grade Trading</p>
                                    <p className="text-[8px] mt-1 text-zinc-600 tracking-wider">&copy; 2026 CrownEdge Broker</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-sm font-medium text-zinc-400 hover:text-brand-gold transition-all duration-300 uppercase tracking-widest relative group"
        >
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}
