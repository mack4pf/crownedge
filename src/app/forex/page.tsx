"use client";

import { motion } from "framer-motion";
import { Globe, Zap, BarChart3, TrendingUp, ArrowRight, ShieldCheck, Landmark, Repeat } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ForexPage() {
    const [rates, setRates] = useState<any>(null);

    useEffect(() => {
        // Real-time Forex Rates (Public API)
        fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
            .then(res => res.json())
            .then(data => setRates(data.usd));
    }, []);

    const pairs = ["eur", "gbp", "jpy", "chf", "aud", "cad"];

    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] -z-10 rounded-full" />
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase">
                            <Repeat size={14} />
                            <span>Global Currency Exchange</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                            FOREX <br />
                            <span className="gold-gradient">AUTHORITY</span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                            Access the $6.6 Trillion a day Forex market with CrownEdge's institutional-grade infrastructure. Our AI engine optimizes currency swaps for maximum yield and zero slippage.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="gold-button px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Start Trading</Link>
                            <Link href="/markets" className="bg-white/5 border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Live Spreads</Link>
                        </div>
                    </div>

                    <div className="glass p-10 rounded-[48px] border-white/5 space-y-8">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Major FX Pairs (Real-Time)</h4>
                        <div className="space-y-6">
                            {rates && pairs.map(pair => (
                                <div key={pair} className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] uppercase">
                                            {pair}
                                        </div>
                                        <span className="font-bold uppercase tracking-tighter">USD / {pair}</span>
                                    </div>
                                    <span className="font-mono font-bold text-lg">{(1 / rates[pair]).toFixed(5)}</span>
                                </div>
                            ))}
                            {!rates && Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded-xl" />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Forex Advantages */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
                    <AdvantageItem icon={<Zap />} title="0.0 Pips" desc="Raw spreads directly from liquidity providers." />
                    <AdvantageItem icon={<Globe />} title="24/5 Market" desc="Trade global currencies around the clock." />
                    <AdvantageItem icon={<Landmark />} title="Tier 1 Liquidity" desc="Deep pools of capital for large-scale orders." />
                    <AdvantageItem icon={<ShieldCheck />} title="AI Hedging" desc="Automated protection against market shifts." />
                </div>
            </section>

            {/* AI Forex Trading */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto glass p-16 md:p-24 rounded-[64px] border-white/5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gold/5 blur-[100px] -z-10" />
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight uppercase">
                        AI OPTIMIZED <br />
                        <span className="gold-gradient">LIQUIDITY</span>
                    </h2>
                    <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Our Forex engine uses neural networks to predict currency fluctuations with 94% accuracy, placing trades for users to secure consistent investment growth.
                    </p>
                    <Link href="/register" className="gold-button px-12 py-5 rounded-2xl text-xl hover:scale-105 transition-transform active:scale-95">
                        Claim Your Edge
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function AdvantageItem({ icon, title, desc }: any) {
    return (
        <div className="glass p-8 rounded-3xl border-white/5 space-y-4 hover:border-brand-gold/30 transition-all">
            <div className="text-brand-gold">{icon}</div>
            <h4 className="font-bold uppercase tracking-tight">{title}</h4>
            <p className="text-xs text-zinc-500 font-medium">{desc}</p>
        </div>
    )
}
