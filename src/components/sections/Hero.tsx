"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-40 pb-20 px-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto text-center lg:text-left grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-[0.2em] mb-10 uppercase mx-auto lg:mx-0">
                        <ShieldCheck size={14} />
                        <span>Regulated Excellence Since 2014</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-8 tracking-tighter">
                        BECOME  <br />
                        A PROFITABLE  <span className="gold-gradient">TRADER</span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        Experience lightning-fast execution, deep institutional liquidity,
                        and a bespoke trading environment designed for the elite.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                        <button className="gold-button px-10 py-5 rounded-2xl text-lg flex items-center justify-center gap-3 group shadow-2xl shadow-brand-gold/20">
                            Start Trading <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                        <button className="glass px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                            <BarChart3 size={22} /> View Markets
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-16 flex flex-wrap justify-center lg:justify-start gap-12 text-zinc-500">
                        <Stat value="$14.8B" label="Total Volume" />
                        <div className="hidden sm:block w-px h-10 bg-white/10" />
                        <Stat value="2M+" label="Elite Traders" />
                        <div className="hidden sm:block w-px h-10 bg-white/10" />
                        <Stat value="< 5ms" label="Execution" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    {/* Visual Representation of Platform */}
                    <div className="glass rounded-[48px] p-2 border-white/5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                        <div className="bg-[#0c0f14] rounded-[40px] p-8 border border-white/10">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Trading Terminal 4.0</span>
                            </div>

                            <div className="space-y-6">
                                <div className="h-40 bg-white/5 rounded-3xl border border-white/5 flex items-end p-4 gap-2">
                                    {[30, 45, 35, 60, 40, 75, 55, 90, 65, 80, 70, 95].map((h, i) => (
                                        <div
                                            key={i}
                                            style={{ height: `${h}%` }}
                                            className="flex-1 bg-brand-gold/20 rounded-t-sm hover:bg-brand-gold transition-colors duration-300"
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-brand-purple/10 rounded-3xl border border-brand-purple/20 p-4">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Buy Order</p>
                                        <p className="text-xl font-black text-green-500">+1.24 BTC</p>
                                    </div>
                                    <div className="h-24 bg-brand-blue/10 rounded-3xl border border-brand-blue/20 p-4">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Profit</p>
                                        <p className="text-xl font-black text-white"><span className="text-green-500 ">+</span>$102,492</p>
                                    </div>
                                    <div className="h-24 bg-brand-blue/10 rounded-3xl border border-brand-blue/20 p-4">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Loss</p>
                                        <p className="text-xl font-black text-white"><span className="text-red-500 ">-</span>$492</p>
                                    </div>
                                    <div className="h-24 bg-brand-purple/10 rounded-3xl border border-brand-purple/20 p-4">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Sell Order</p>
                                        <p className="text-xl font-black text-red-500">-0.2487 BTC</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-6 -right-6 glass px-6 py-4 rounded-3xl shadow-2xl border border-brand-gold/20 animate-bounce-slow">
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-1">Verified User</p>
                        <p className="text-sm font-bold">Trade Level IV</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Stat({ value, label }: { value: string, label: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-3xl font-black text-white tabular-nums">{value}</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-zinc-500">{label}</span>
        </div>
    );
}
