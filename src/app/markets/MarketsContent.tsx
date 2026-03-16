"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp,
    Newspaper,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Zap,
    Globe,
    Coins,
    ChevronRight,
    RefreshCcw
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MarketsContent() {
    const [activeTab, setActiveTab] = useState("crypto");
    const [prices, setPrices] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const priceRes = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false");
            if (priceRes.ok) {
                const priceData = await priceRes.json();
                setPrices(priceData);
            }

            const newsRes = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
            if (newsRes.ok) {
                const newsData = await newsRes.json();
                const now = Date.now();
                const filteredNews = newsData.Data.filter((item: any) => (now - item.published_on * 1000) < 86400000).slice(0, 10);
                setNews(filteredNews);
            }

            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error("Data fetch error:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase mb-4">
                            <Globe size={12} />
                            <span>Real-Time Market Data</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                            Market <span className="gold-gradient">Screener</span>
                        </h1>
                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            <RefreshCcw size={10} className={loading ? "animate-spin" : ""} />
                            Last Update: {lastUpdated || "Connecting..."}
                        </div>
                    </div>

                    <div className="flex w-full md:w-auto bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                        <TabButton active={activeTab === "crypto"} label="Crypto" onClick={() => setActiveTab("crypto")} />
                        <TabButton active={activeTab === "news"} label="News Feed" onClick={() => setActiveTab("news")} />
                        <TabButton active={activeTab === "stats"} label="Analytics" onClick={() => setActiveTab("stats")} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === "crypto" && (
                            <div className="space-y-4 md:space-y-0 md:glass md:rounded-[40px] md:border-white/5 md:overflow-hidden">
                                <div className="hidden md:grid grid-cols-4 px-8 py-6 bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    <span>Asset</span>
                                    <span className="text-right">Price</span>
                                    <span className="text-right">24h Change</span>
                                    <span className="text-right">Action</span>
                                </div>

                                <div className="divide-y divide-white/[0.02] space-y-4 md:space-y-0">
                                    {prices.map((coin) => (
                                        <div key={coin.id} className="glass md:bg-transparent md:border-none p-6 md:px-8 md:py-6 rounded-[32px] md:rounded-none flex flex-col md:grid md:grid-cols-4 items-center gap-4 md:gap-0 hover:bg-white/[0.02] transition-colors group">
                                            <div className="flex items-center gap-4 self-start md:self-auto">
                                                <img src={coin.image} alt={coin.name} className="w-10 h-10 md:w-8 md:h-8 rounded-full" />
                                                <div>
                                                    <p className="font-bold tracking-tight text-lg md:text-base">{coin.name}</p>
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{coin.symbol}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between md:justify-end w-full md:w-auto items-center">
                                                <span className="md:hidden text-[10px] font-black text-zinc-600 uppercase">Price</span>
                                                <span className="font-mono font-bold text-lg md:text-base">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>

                                            <div className="flex justify-between md:justify-end w-full md:w-auto items-center">
                                                <span className="md:hidden text-[10px] font-black text-zinc-600 uppercase">24h Change</span>
                                                <div className={`flex items-center gap-1 font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto md:text-right mt-2 md:mt-0">
                                                <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    Trade Asset <ChevronRight size={14} className="md:hidden" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {prices.length === 0 && Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="h-24 bg-white/5 animate-pulse rounded-[32px] md:rounded-none mb-4 md:mb-0" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "news" && (
                            <div className="grid gap-6">
                                {news.map((item) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={item.id}
                                        className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer group"
                                        onClick={() => window.open(item.url, '_blank')}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-brand-gold/20 text-brand-gold">
                                                    {item.source_info.name}
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-bold uppercase whitespace-nowrap">
                                                <Clock size={12} /> {new Date(item.published_on * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold leading-snug group-hover:text-brand-gold transition-colors line-clamp-2 md:line-clamp-none">
                                            {item.title}
                                        </h3>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === "stats" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatsCard title="Volatility Index" value="4.2% (High)" desc="Market sentiment is shifting towards institutional accumulation." icon={<Zap size={24} />} />
                                <StatsCard title="Total Liquidity" value="$84.2B" desc="Combined liquidity from 1inch and 0x protocols." icon={<Coins size={24} />} />
                                <StatsCard title="Top Gainer" value="Bitcoin (+3.1%)" desc="Whale wallets showing massive buy orders." icon={<TrendingUp size={24} />} />
                                <StatsCard title="Fear & Greed" value="65 (Greed)" desc="Market is currently in an expansion phase." icon={<Globe size={24} />} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-10 lg:sticky lg:top-32 h-fit">
                        <div className="glass p-8 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl -z-10" />
                            <Zap className="text-brand-gold mb-6" size={32} />
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Alpha Signal</h4>
                            <p className="text-3xl font-black uppercase mb-4 tracking-tighter line-clamp-1">Buy Bitcoin</p>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">REAL-TIME DATA: Whale inflow has increased by 12% in the last 4 hours on 1inch Network.</p>
                        </div>

                        <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
                            <StatItem icon={<TrendingUp size={16} />} label="Global Volume" value="$128B" />
                            <StatItem icon={<Coins size={16} />} label="USDT Liquidity" value="$82B" />
                            <StatItem icon={<Newspaper size={16} />} label="News Alerts" value={`${news.length} Live`} />
                        </div>

                        <div className="p-8 rounded-[40px] bg-brand-gold flex flex-col items-center text-center shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)]">
                            <h4 className="text-black font-black text-2xl tracking-tighter leading-none mb-4 uppercase">Unlock<br />Full Access</h4>
                            <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function TabButton({ active, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
            {label}
        </button>
    );
}

function StatItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-none last:pb-0">
            <div className="flex items-center gap-3 text-zinc-500">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-gold border border-white/5">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-sm font-black tracking-tight">{value}</span>
        </div>
    );
}

function StatsCard({ title, value, desc, icon }: any) {
    return (
        <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden group">
            <div className="text-brand-gold mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{title}</h4>
            <p className="text-2xl font-black uppercase mb-3 tracking-tighter">{value}</p>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}
