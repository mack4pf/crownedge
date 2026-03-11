"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Zap, Check, ShieldCheck,
    Star, Crown, Gem, ArrowRight, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        name: "Basic VIP",
        tier: "VIP 1",
        price: 300,
        icon: <Star className="text-blue-400" size={32} />,
        features: [
            "3 Daily VIP Signals",
            "85% Accuracy Rate",
            "Email Trade Alerts",
            "Standard Support"
        ],
        color: "blue"
    },
    {
        name: "Silver VIP",
        tier: "VIP 2",
        price: 750,
        icon: <ShieldCheck className="text-zinc-300" size={32} />,
        features: [
            "10 Daily VIP Signals",
            "90% Accuracy Rate",
            "SMS + Email Alerts",
            "Priority Support",
            "Account Growth Plan"
        ],
        color: "zinc"
    },
    {
        name: "Gold VIP",
        tier: "VIP 3",
        price: 2500,
        icon: <Crown className="text-brand-gold" size={32} />,
        features: [
            "Unlimited VIP Signals",
            "95% Accuracy Rate",
            "Real-time Logic Access",
            "Dedicated Manager",
            "VIP Trading Community"
        ],
        color: "gold",
        popular: true
    },
    {
        name: "Diamond VIP",
        tier: "VIP 4",
        price: 5000,
        icon: <Gem className="text-purple-400" size={32} />,
        features: [
            "Institutional Flow Data",
            "98% Accuracy Rate",
            "1-on-1 Mentorship",
            "Direct Admin Line",
            "Exclusive Market Re-caps"
        ],
        color: "purple"
    }
];

export default function SubscriptionPage() {
    const { data: session }: any = useSession();
    const router = useRouter();
    const [currency, setCurrency] = useState("USD");
    const [rate, setRate] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const res = await fetch("/api/dashboard");
                if (res.ok) {
                    const data = await res.json();
                    const userCurr = data.user.currency || "USD";
                    setCurrency(userCurr);

                    if (userCurr !== "USD") {
                        const rateRes = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
                        const rateData = await rateRes.json();
                        if (rateData.rates[userCurr]) {
                            setRate(rateData.rates[userCurr]);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load currency data:", err);
            }
            setLoading(false);
        };
        fetchCurrency();
    }, []);

    const formatCurrency = (amount: number) => {
        const converted = Math.ceil(amount * rate);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(converted);
    };

    const handleSubscribe = (amount: number) => {
        const localAmount = Math.ceil(amount * rate);
        router.push(`/dashboard/wallet?amount=${localAmount}&ref=subscription`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-brand-gold" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold text-xs font-black uppercase tracking-widest"
                >
                    <Zap size={14} /> VIP Signal Intelligence
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
                >
                    Institutional <span className="text-brand-gold">Tiers</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-sm max-w-2xl mx-auto font-medium"
                >
                    Unlock market-beating signals and institutional logic directly from our core trading engine. Select a plan to begin your VIP journey.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PLANS.map((plan, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`glass p-8 rounded-[40px] border-white/5 relative flex flex-col group transition-all duration-500 hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/10 ${plan.popular ? "bg-gradient-to-b from-brand-gold/10 to-transparent border-brand-gold/20 scale-105" : ""}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                {plan.icon}
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{plan.tier} Protocol</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-black italic tracking-tighter">{formatCurrency(plan.price)}</span>
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">/ Monthly</span>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                    <Check size={14} className="text-brand-gold shrink-0 mt-0.5" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.price)}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group/btn transition-all ${plan.popular ? "bg-brand-gold text-black shadow-xl shadow-brand-gold/20" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}
                        >
                            Subscribe Now <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Verification Note */}
            <div className="glass p-8 rounded-[40px] border-white/5 bg-zinc-900/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-brand-gold border border-white/5">
                    <ShieldCheck size={24} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Institutional Handshake Guaranteed</h4>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
                    All VIP subscriptions are processed through secure liquidity gateways. Your signal access will be activated immediately upon transaction verification.
                </p>
            </div>
        </div>
    );
}
