"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid institutional credentials");
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError("Unable to connect to the institutional servers.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[150px] -z-10 rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="relative w-12 h-12 overflow-hidden rounded-2xl border border-brand-gold/30 shadow-2xl">
                            <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Login to <br /><span className="gold-gradient uppercase">CrownEdge</span></h1>
                    <p className="text-zinc-500 font-medium">Access your institutional trading account.</p>
                </div>

                <form onSubmit={handleLogin} className="glass p-10 md:p-12 rounded-[48px] border-white/5 shadow-2xl space-y-8">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-xs font-bold uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <InputField
                            label="Institutional Email"
                            placeholder="name@company.com"
                            icon={<Mail size={20} />}
                            type="email"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            required
                        />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secure Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-brand-gold uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center text-zinc-600 group-focus-within:text-brand-gold transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#0c0f14] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/30 transition-all placeholder:text-zinc-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <input type="checkbox" id="remember" className="w-5 h-5 rounded-md bg-white/5 border-white/10 checked:bg-brand-gold transition-all cursor-pointer" />
                        <label htmlFor="remember" className="text-xs font-medium text-zinc-400 cursor-pointer">Remember this device for 30 days</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="gold-button w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-lg group shadow-2xl shadow-brand-gold/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={22} />
                        ) : (
                            <>Sign In <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" /></>
                        )}
                    </button>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-zinc-500 font-medium">
                            Don&apos;t have an elite account?{" "}
                            <Link href="/register" className="text-brand-gold font-bold hover:underline">Apply Now</Link>
                        </p>
                    </div>
                </form>

                <div className="mt-12 flex justify-center items-center gap-6 text-zinc-600">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Encypted</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">System Live</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function InputField({ label, placeholder, icon, type, value, onChange, required }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-zinc-600 group-focus-within:text-brand-gold transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full bg-[#0c0f14] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/30 transition-all placeholder:text-zinc-700"
                />
            </div>
        </div>
    )
}
