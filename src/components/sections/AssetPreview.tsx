"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ChevronRight, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AssetPreview() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopAssets = async () => {
            try {
                // Fetch real institutional crypto data
                const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false");
                if (res.ok) {
                    const data = await res.json();
                    setAssets(data);
                }
            } catch (err) {
                console.error("Home market fetch error:", err);
            }
            setLoading(false);
        };

        fetchTopAssets();
        const interval = setInterval(fetchTopAssets, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="markets" className="py-32 px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 blur-[200px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase">
                            <Zap size={14} />
                            <span>Live Execution Hub</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                            INSTITUTIONAL <br />
                            <span className="gold-gradient">ASSET FEED</span>
                        </h2>
                    </div>
                    <Link href="/markets" className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl hover:bg-brand-gold hover:text-black transition-all hover:scale-105 active:scale-95 duration-500">
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Enter Exchange</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-64 glass rounded-[40px] animate-pulse" />
                        ))
                    ) : (
                        assets.map((asset, idx) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                className="glass p-8 rounded-[40px] border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Subtle internal glow on hover */}
                                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-gold/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-all">
                                            <img src={asset.image} alt={asset.name} className="w-10 h-10 object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl tracking-tight">{asset.name}</h4>
                                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{asset.symbol} / USD</span>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-xl border ${asset.price_change_percentage_24h >= 0 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        <ArrowUpRight size={16} className={asset.price_change_percentage_24h < 0 ? "rotate-90" : ""} />
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Market Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black tracking-tighter tabular-nums">${asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">24h Change</span>
                                        <span className={`text-sm font-black ${asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {asset.price_change_percentage_24h >= 0 ? '+' : ''}{asset.price_change_percentage_24h.toFixed(2)}%
                                        </span>
                                    </div>
                                    <Link href="/register" className="bg-white/5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all">
                                        Trade Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
