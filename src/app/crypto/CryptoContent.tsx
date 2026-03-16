"use client";

import { motion } from "framer-motion";
import { Coins, Zap, ShieldCheck, TrendingUp, ArrowRight, BarChart3, Globe, Cpu } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CryptoContent() {
    const [prices, setPrices] = useState<any[]>([]);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1")
            .then(res => res.json())
            .then(data => setPrices(data));
    }, []);

    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 blur-[150px] -z-10 rounded-full" />
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase">
                            <Zap size={14} />
                            <span>Hyper-Growth Investment</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                            CRYPTO <br />
                            <span className="gold-gradient">SUPREMACY</span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                            Dominate the digital asset markets with CrownEdge AI. We provide institutional-grade liquidity and surgical execution for the world's most profitable crypto assets.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="gold-button px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Start Investing</Link>
                            <Link href="/markets" className="bg-white/5 border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">View Market</Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CryptoStat label="Avg. APY" value="24.8%" />
                        <CryptoStat label="Trade Latency" value="0.01ms" />
                        <CryptoStat label="Volume (24h)" value="$2.4B" />
                        <CryptoStat label="Execution" value="100% AI" />
                    </div>
                </div>
            </section>

            {/* Live Prices Minimal */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 bg-white/5 p-8 rounded-[40px] border border-white/10">
                    {prices.map(coin => (
                        <div key={coin.id} className="flex items-center gap-3">
                            <img src={coin.image} alt="" className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{coin.symbol}</p>
                                <p className="font-bold">${coin.current_price.toLocaleString()}</p>
                            </div>
                            <span className={`text-[10px] font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Crypto Investment Strategies */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <h2 className="text-5xl font-black tracking-tighter uppercase mb-6">INSTITUTIONAL <span className="gold-gradient">STRATEGIES</span></h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">Our AI engine handles the complexity of crypto markets, ensuring your capital is always working in high-probability setups.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <StrategyCard
                        title="Quantum Momentum"
                        desc="Harness high-speed market movements with our proprietary momentum tracking algorithms. Perfect for high-cap assets like BTC and ETH."
                        icon={<Cpu size={32} />}
                    />
                    <StrategyCard
                        title="Delta Neutral Staking"
                        desc="Earn consistent returns regardless of market direction. Our AI manages complex derivative positions to protect your principal."
                        icon={<TrendingUp size={32} />}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}

function CryptoStat({ label, value }: any) {
    return (
        <div className="glass p-8 rounded-3xl border-white/5 text-center space-y-2">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black gold-gradient tracking-tighter">{value}</p>
        </div>
    )
}

function StrategyCard({ title, desc, icon }: any) {
    return (
        <div className="glass p-12 rounded-[48px] border-white/5 space-y-8 hover:bg-white/[0.05] transition-all group">
            <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-all">
                {icon}
            </div>
            <div className="space-y-4">
                <h4 className="text-3xl font-black tracking-tighter uppercase">{title}</h4>
                <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
            </div>
            <button className="flex items-center gap-2 text-brand-gold font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                Learn Strategy <ArrowRight size={16} />
            </button>
        </div>
    )
}
