"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, DollarSign, TrendingUp, TrendingDown,
    Zap, Activity, Loader2, Copy, Cpu,
    Bitcoin, CheckCircle2, AlertCircle
} from "lucide-react";

// Asset lists
const ASSETS = {
    crypto: [
        { symbol: "BINANCE:BTCUSDT", name: "Bitcoin / TetherUS" },
        { symbol: "BINANCE:ETHUSDT", name: "Ethereum / TetherUS" },
        { symbol: "BINANCE:BNBUSDT", name: "BNB / TetherUS" },
        { symbol: "BINANCE:SOLUSDT", name: "Solana / TetherUS" },
        { symbol: "BINANCE:XRPUSDT", name: "XRP / TetherUS" }
    ],
    forex: [
        { symbol: "FX:EURUSD", name: "Euro / US Dollar" },
        { symbol: "FX:GBPUSD", name: "British Pound / US Dollar" },
        { symbol: "FX:USDJPY", name: "US Dollar / Japanese Yen" },
        { symbol: "FX:AUDUSD", name: "Australian Dollar / US Dollar" },
        { symbol: "FX:USDCAD", name: "US Dollar / Canadian Dollar" }
    ]
};

const TIMEFRAMES = [
    { label: "30s", value: 30 },
    { label: "1m", value: 60 },
    { label: "3m", value: 180 },
    { label: "5m", value: 300 },
    { label: "10m", value: 600 },
    { label: "15m", value: 900 },
    { label: "30m", value: 1800 },
    { label: "1h", value: 3600 },
];

const MINERS = [
    { name: "Starter Miner", priceUSD: 2000, dailyReturn: "0.5%" },
    { name: "Pro Miner", priceUSD: 5000, dailyReturn: "0.5%" },
    { name: "Elite Miner", priceUSD: 10000, dailyReturn: "0.5%" },
    { name: "Master Miner", priceUSD: 50000, dailyReturn: "0.5%" }
];

export default function TradingTerminal() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const [market, setMarket] = useState<"crypto" | "forex">("crypto");
    const [selectedAsset, setSelectedAsset] = useState(ASSETS.crypto[0]);
    const [amount, setAmount] = useState<string>("100");
    const [duration, setDuration] = useState(60);
    const [balance, setBalance] = useState<number>(0);
    const [currency, setCurrency] = useState("USD");
    const [tradeMode, setTradeMode] = useState<"amount" | "lot">("amount");
    const [modal, setModal] = useState<{ show: boolean, message: string, type: "error" | "success" }>({ show: false, message: "", type: "error" });
    const [tradePendingModal, setTradePendingModal] = useState<{ show: boolean, details: any } | null>(null);
    const LOT_SIZE = 1000;

    // UI states
    const [trading, setTrading] = useState(false);
    const [tradeResult, setTradeResult] = useState<any>(null);
    const [activeTradeTimer, setActiveTradeTimer] = useState<number | null>(null);

    const [conversionRate, setConversionRate] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch user balance and conversion rate
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/dashboard");
                if (res.ok) {
                    const data = await res.json();
                    setBalance(data.user.balance);
                    setCurrency(data.user.currency);

                    if (data.user.currency !== "USD") {
                        const rateRes = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
                        const rateData = await rateRes.json();
                        if (rateData.rates[data.user.currency]) {
                            setConversionRate(rateData.rates[data.user.currency]);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        fetchUserData();
    }, []);

    // TradingView Widget Loader (Replaced by iframe)


    // Format currency symbol
    const sym = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).formatToParts(0).find(x => x.type === 'currency')?.value || '$';

    // Trade execution
    const executeTrade = async (type: "BUY" | "SELL") => {
        let tradeAmount = parseFloat(amount);
        if (isNaN(tradeAmount) || tradeAmount <= 0) return setModal({ show: true, message: "Enter a valid amount", type: "error" });
        if (tradeMode === "lot") tradeAmount = tradeAmount * LOT_SIZE;

        if (tradeAmount > balance) return setModal({ show: true, message: "Insufficient balance", type: "error" });

        setTrading(true);
        setTradeResult(null);

        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    asset: selectedAsset.name,
                    type,
                    amount: tradeAmount,
                    duration
                })
            });

            const data = await res.json();

            if (res.ok) {
                setBalance(data.newBalance);

                // Show confirmation modal
                setTradePendingModal({
                    show: true,
                    details: {
                        type,
                        amount: tradeAmount,
                        asset: selectedAsset.name,
                        duration
                    }
                });

                // Start countdown
                setActiveTradeTimer(duration);
                const timerId = setInterval(() => {
                    setActiveTradeTimer((prev) => {
                        if (prev && prev <= 1) {
                            clearInterval(timerId);
                            setTrading(false);
                            setTradeResult(data);
                            return null;
                        }
                        return prev ? prev - 1 : null;
                    });
                }, 1000);
            } else {
                setModal({ show: true, message: data.error, type: "error" });
                setTrading(false);
            }
        } catch (err) {
            console.error(err);
            setModal({ show: true, message: "Trade execution failed", type: "error" });
            setTrading(false);
        }
    };

    const handleMarketSwitch = (m: "crypto" | "forex") => {
        setMarket(m);
        setSelectedAsset(ASSETS[m][0]);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const [purchasingMiner, setPurchasingMiner] = useState<number | null>(null);

    const handleBuyMiner = async (miner: typeof MINERS[0], index: number) => {
        const localPrice = Math.ceil(miner.priceUSD * conversionRate);
        if (balance < localPrice) {
            return setModal({ show: true, message: "Insufficient balance to purchase this cloud mining contract", type: "error" });
        }

        setPurchasingMiner(index);
        try {
            const res = await fetch("/api/mining/buy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planName: miner.name,
                    priceUSD: miner.priceUSD,
                    priceLocal: localPrice,
                    currency: currency
                })
            });
            const data = await res.json();

            if (res.ok) {
                setBalance(data.newBalance);
                setModal({ show: true, message: data.message, type: "success" });
            } else {
                setModal({ show: true, message: data.error, type: "error" });
            }
        } catch (err) {
            setModal({ show: true, message: "Network error processing contract purchase", type: "error" });
        }
        setPurchasingMiner(null);
    };

    return (
        <div className="space-y-6 lg:space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Trading <span className="gold-gradient">Terminal</span>
                        {activeTradeTimer && (
                            <span className="flex items-center gap-2 px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 rounded-full text-brand-gold text-sm animate-pulse">
                                <Activity size={16} /> Live Trade: {formatTime(activeTradeTimer)}
                            </span>
                        )}
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Execute institutional-grade binary trades securely.</p>
                </div>
                <div className="glass px-5 py-3 rounded-2xl flex items-center gap-4 border-brand-gold/20 shadow-lg shadow-brand-gold/10">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Balance</span>
                    <span className="text-xl font-black tabular-nums">{sym}{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Main Terminal Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ════════════ CHART SECTION (Left/Top) ════════════ */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Market / Asset Selector */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass p-2 rounded-2xl border-white/5">
                        <div className="flex p-1 bg-white/5 rounded-xl w-full sm:w-auto">
                            <button
                                onClick={() => handleMarketSwitch("crypto")}
                                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${market === "crypto" ? "bg-brand-gold text-black shadow-lg" : "text-zinc-400 hover:text-white"}`}
                            >
                                Crypto
                            </button>
                            <button
                                onClick={() => handleMarketSwitch("forex")}
                                className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${market === "forex" ? "bg-brand-gold text-black shadow-lg" : "text-zinc-400 hover:text-white"}`}
                            >
                                Forex
                            </button>
                        </div>
                        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                            <div className="flex gap-2">
                                {ASSETS[market].map((asset) => (
                                    <button
                                        key={asset.symbol}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${selectedAsset.symbol === asset.symbol ? "bg-white/10 border-brand-gold/50 text-brand-gold" : "border-white/5 text-zinc-400 hover:bg-white/5"}`}
                                    >
                                        {asset.name.split(" / ")[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="glass rounded-[28px] border-white/5 overflow-hidden h-[500px] lg:h-[600px] relative group pointer-events-auto">
                        <div className="absolute inset-0 z-10 bg-[#05070a]">
                            <iframe
                                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d14&symbol=${selectedAsset.symbol}&interval=1&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=05070a&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
                                style={{ width: "100%", height: "100%" }}
                                frameBorder="0"
                                scrolling="no"
                                allowFullScreen
                            />
                        </div>

                        {/* Instant Loader / Skeleton */}
                        <div className="absolute inset-0 bg-[#05070a] flex flex-col items-center justify-center gap-4 z-0">
                            <div className="w-16 h-16 rounded-full border-4 border-brand-gold/10 border-t-brand-gold animate-spin" />
                            <div className="text-center">
                                <p className="text-xs font-black uppercase text-brand-gold tracking-[0.3em] animate-pulse">Initializing Terminal</p>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Connecting to {selectedAsset.name.split(" / ")[0]} Liquidity Source...</p>
                            </div>
                        </div>

                        {/* Chart Overlay (Institutional Branding) */}
                        <div className="absolute top-6 left-6 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                                <Activity className="text-brand-gold" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Secure Feed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════════ ORDER SECTION (Right/Bottom) ════════════ */}
                <div className="space-y-6">
                    {/* Trade Panel */}
                    <div className="glass p-6 md:p-8 rounded-[28px] border-brand-gold/20 shadow-2xl shadow-brand-gold/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -z-10 rounded-full" />

                        <h2 className="text-xl font-black mb-6 uppercase tracking-wider flex items-center gap-2">
                            <Zap className="text-brand-gold" size={20} /> Execute Trade
                        </h2>

                        {/* Amount */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <DollarSign size={12} /> {tradeMode === "amount" ? `Amount (${currency})` : "Lot Size"}
                                </label>
                                <div className="flex p-0.5 bg-white/5 rounded-lg border border-white/5">
                                    <button
                                        onClick={() => { setTradeMode("amount"); setAmount("100"); }}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${tradeMode === "amount" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                                    >Money</button>
                                    <button
                                        onClick={() => { setTradeMode("lot"); setAmount("0.1"); }}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${tradeMode === "lot" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}
                                    >Lot</button>
                                </div>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={amount}
                                    step={tradeMode === "lot" ? "0.01" : "1"}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={trading}
                                    className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-5 py-4 text-xl font-black focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all text-white disabled:opacity-50"
                                />
                                {tradeMode === "lot" && (
                                    <p className="text-[10px] text-zinc-500 font-bold mt-2 text-right">
                                        ≈ {sym}{(parseFloat(amount) * LOT_SIZE || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} Margin
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Timeframe */}
                        <div className="space-y-2 mb-8">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock size={12} /> Timeframe
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {TIMEFRAMES.map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setDuration(t.value)}
                                        disabled={trading}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all border ${duration === t.value ? "bg-brand-gold text-black border-brand-gold" : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => executeTrade("BUY")}
                                disabled={trading}
                                className="bg-green-600 hover:bg-green-500 hover:-translate-y-1 active:translate-y-0 text-white py-5 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-green-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {trading && activeTradeTimer ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <TrendingUp size={28} className="group-hover:scale-110 transition-transform" />
                                )}
                                <span className="font-black tracking-widest uppercase text-sm">BUY</span>
                            </button>
                            <button
                                onClick={() => executeTrade("SELL")}
                                disabled={trading}
                                className="bg-red-600 hover:bg-red-500 hover:-translate-y-1 active:translate-y-0 text-white py-5 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {trading && activeTradeTimer ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <TrendingDown size={28} className="group-hover:scale-110 transition-transform" />
                                )}
                                <span className="font-black tracking-widest uppercase text-sm">SELL</span>
                            </button>
                        </div>
                    </div>

                    {/* Trade Result Modal (In-place) */}
                    <AnimatePresence>
                        {tradeResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`p-6 rounded-[28px] border shadow-2xl relative overflow-hidden ${tradeResult.result === "WIN"
                                    ? "bg-green-500/10 border-green-500/30 shadow-green-500/20"
                                    : "bg-red-500/10 border-red-500/30 shadow-red-500/20"
                                    }`}
                            >
                                <button
                                    onClick={() => setTradeResult(null)}
                                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                                >
                                    <CheckCircle2 size={20} />
                                </button>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tradeResult.result === "WIN" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                                        {tradeResult.result === "WIN" ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Trade Complete</p>
                                        <h3 className={`text-2xl font-black ${tradeResult.result === "WIN" ? "text-green-500" : "text-red-500"}`}>
                                            {tradeResult.result === "WIN" ? "WIN" : "LOSS"}
                                        </h3>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-zinc-400 text-sm font-medium">Profit / Loss:</span>
                                    <span className={`font-black text-lg tabular-nums ${tradeResult.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                                        {tradeResult.profit > 0 ? "+" : ""}{sym}{tradeResult.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Copy Trading Quick Action */}
                    <button className="w-full glass p-5 rounded-2xl border-white/10 hover:border-brand-purple/50 transition-all flex items-center justify-between group shadow-lg hover:shadow-brand-purple/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center border border-brand-purple/30 group-hover:scale-110 transition-transform">
                                <Copy size={20} className="text-brand-purple" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-sm text-white">Copy Pro Traders</h4>
                                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Automate your success</p>
                            </div>
                        </div>
                        <AlertCircle size={18} className="text-zinc-500 group-hover:text-brand-gold transition-colors" />
                    </button>
                </div>
            </div>

            {/* ════════════ MINING MACHINES ════════════ */}
            <div className="mt-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Cpu className="text-brand-gold" /> Cloud Mining Contracts
                        </h2>
                        <p className="text-zinc-400 text-sm mt-1">Purchase hashing power and earn 1% every 48 hours directly to your balance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MINERS.map((miner, idx) => {
                        const localPrice = Math.ceil(miner.priceUSD * conversionRate);
                        return (
                            <div key={idx} className="glass p-6 rounded-[24px] border-white/5 hover:border-brand-gold/30 transition-all group relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold to-brand-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5 group-hover:border-brand-gold/20">
                                    <Bitcoin size={24} className="text-brand-gold" />
                                </div>

                                <h3 className="text-xl font-bold mb-1">{miner.name}</h3>
                                <p className="text-3xl font-black tabular-nums mb-4">{sym}{localPrice.toLocaleString()}</p>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Return Rate</span>
                                        <span className="font-bold text-green-500">1% / 48 hrs</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-zinc-500">Est. Profit</span>
                                        <span className="font-bold">{sym}{(localPrice * 0.01).toLocaleString()} / 2 days</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBuyMiner(miner, idx)}
                                    disabled={purchasingMiner === idx}
                                    className="w-full py-3 rounded-xl border border-white/10 text-sm font-bold uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all text-white group-hover:border-brand-gold/50 group-hover:text-brand-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {purchasingMiner === idx && <Loader2 size={16} className="animate-spin" />}
                                    Purchase Contract
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ════════════ MODAL ════════════ */}
            <AnimatePresence>
                {modal.show && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a0d14] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modal.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                {modal.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{modal.type === "success" ? "Success" : "Error"}</h3>
                            <p className="text-zinc-400 text-sm mb-6">{modal.message}</p>
                            <button
                                onClick={() => setModal({ ...modal, show: false })}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Trade Interaction Modal */}
                {tradePendingModal?.show && (
                    <motion.div
                        className="fixed inset-0 z-[101] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            className="bg-[#0a0d14] border-2 border-brand-gold/20 rounded-[40px] p-10 max-w-md w-full shadow-[0_0_100px_rgba(212,175,55,0.1)] flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-2xl ${tradePendingModal.details.type === "BUY" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                                {tradePendingModal.details.type === "BUY" ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Trade <span className="text-brand-gold">Dispatched</span></h3>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Institutional Order Received</p>

                            <div className="w-full space-y-4 mb-10">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Asset</span>
                                    <span className="text-white font-black uppercase tracking-tight">{tradePendingModal.details.asset}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Position</span>
                                    <span className={`font-black uppercase tracking-widest ${tradePendingModal.details.type === "BUY" ? "text-green-500" : "text-red-500"}`}>
                                        {tradePendingModal.details.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Margin</span>
                                    <span className="text-brand-gold font-black tabular-nums text-lg">
                                        {sym}{tradePendingModal.details.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Expiry</span>
                                    <span className="text-white font-black uppercase tracking-widest">{tradePendingModal.details.duration} Seconds</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setTradePendingModal(null)}
                                className="w-full py-5 rounded-2xl bg-brand-gold text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-gold/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Monitioring Trade...
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
