"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    User,
    Lock,
    Globe,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const userSession = session?.user as any;

    const [name, setName] = useState(userSession?.name || "");
    const [country, setCountry] = useState(userSession?.country || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return setStatus({ type: 'error', message: "Passwords do not match" });
        }

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/user/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, country, password: password || undefined })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: "Settings updated successfully" });
                // Update session client-side
                await update({ name, country });
                setPassword("");
                setConfirmPassword("");
            } else {
                setStatus({ type: 'error', message: data.error || "Failed to update settings" });
            }
        } catch (err) {
            setStatus({ type: 'error', message: "Network error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                    Account <span className="gold-gradient">Settings</span>
                </h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                    Manage your institutional profile and security
                </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Status Message */}
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                                ? "bg-green-500/10 border-green-500/20 text-green-500"
                                : "bg-red-500/10 border-red-500/20 text-red-500"
                            }`}
                    >
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-xs font-bold uppercase tracking-wider">{status.message}</p>
                    </motion.div>
                )}

                {/* Profile Section */}
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl -z-10" />
                    <div className="flex items-center gap-3 mb-2">
                        <User className="text-brand-gold" size={20} />
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Institutional Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-brand-gold/50 transition-all text-white outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Email (Institutional)</label>
                            <input
                                type="email"
                                value={userSession?.email}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-zinc-500 cursor-not-allowed outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Resident Country</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-5 py-3.5 text-sm font-bold focus:border-brand-gold/50 transition-all text-white outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Currency</label>
                            <input
                                type="text"
                                value={userSession?.currency}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-zinc-500 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="text-brand-gold" size={20} />
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Security & Password</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-brand-gold/50 transition-all text-white outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold focus:border-brand-gold/50 transition-all text-white outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="gold-button px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
