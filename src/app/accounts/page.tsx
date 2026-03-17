import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ShieldCheck, Zap, Globe, Award, TrendingUp, Landmark, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Account Tiers | Institutional Trading Levels",
    description: "Explore CrownEdge Broker account levels. From Basic to Platinum Plus, discover the institutional benefits, leverage options, and premium support tailored for elite traders.",
    keywords: ["trading account tiers", "silver trading account", "gold level broker", "platinum investment account", "institutional leverage"],
    alternates: {
        canonical: "https://crownedgebroker.pro/accounts",
    },
};

const TIERS = [
    {
        name: "Basic",
        level: "L1",
        color: "#71717a",
        minDeposit: "$50",
        leverage: "1:100",
        features: ["Standard Execution", "Email Support", "Daily Market Briefing", "Web Terminal Access"],
        payout: "82%"
    },
    {
        name: "Silver",
        level: "L2",
        color: "#a1a1aa",
        minDeposit: "$2,000",
        leverage: "1:200",
        features: ["Priority Execution", "24/5 Live Support", "Basic AI Integration", "Signal Dashboard Access"],
        payout: "85%",
        popular: true
    },
    {
        name: "Gold",
        level: "L3",
        color: "#d4af37",
        minDeposit: "$10,000",
        leverage: "1:500",
        features: ["High-Frequency Execution", "Personal Account Manager", "Advanced AI Prediction Hub", "Institutional Liquidity Pool"],
        payout: "92%"
    },
    {
        name: "Platinum Plus",
        level: "L4",
        color: "#c084fc",
        minDeposit: "$50,000",
        leverage: "1:1000",
        features: ["Zero Latency Routing", "Dedicated Portfolio Team", "Quantum AI Access", "Exclusive VIP Events"],
        payout: "98%"
    }
];

export default function AccountsPage() {
    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] -z-10 rounded-full" />
                <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase">
                        <Award size={14} />
                        <span>Institutional Standards</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                        ACCOUNT <br />
                        <span className="gold-gradient">TIERS</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto">
                        CrownEdge offers a multi-tiered infrastructure designed to scale with your ambition. Choose the level that matches your professional trading requirements.
                    </p>
                </div>
            </section>

            {/* Tiers Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TIERS.map((tier, idx) => (
                        <div 
                            key={idx} 
                            className={`glass p-8 rounded-[40px] border-white/5 relative flex flex-col transition-all hover:translate-y-[-10px] ${tier.popular ? 'ring-2 ring-brand-gold/30' : ''}`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-brand-gold/20">
                                    Institutional Choice
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 block">{tier.level}</span>
                                <h3 className="text-3xl font-black uppercase tracking-tight" style={{ color: tier.color }}>{tier.name}</h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black">{tier.minDeposit}</span>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Min. Deposit</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest">Leverage</span>
                                    <span className="font-black text-white">{tier.leverage}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest">Payout Up To</span>
                                    <span className="font-black text-green-500">{tier.payout}</span>
                                </div>
                                <div className="pt-4 space-y-3">
                                    {tier.features.map((feature, fidx) => (
                                        <div key={fidx} className="flex gap-3 text-xs font-medium text-zinc-400">
                                            <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link 
                                href="/register" 
                                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center ${tier.popular ? 'bg-brand-gold text-black hover:scale-105 active:scale-95 shadow-xl shadow-brand-gold/10' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'}`}
                            >
                                Open {tier.name} Account
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Table (Desktop Only) */}
            <section className="py-24 px-6 bg-white/[0.02] hidden lg:block">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-black mb-16 text-center uppercase tracking-tighter">Feature <span className="gold-gradient">Comparison</span></h2>
                    <div className="glass rounded-[40px] border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Feature</th>
                                    {TIERS.map(t => <th key={t.name} className="p-8 text-center text-sm font-black uppercase tracking-widest" style={{ color: t.color }}>{t.name}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <ComparisonRow label="Min. Deposit" values={["$50", "$2,000", "$10,000", "$50,000"]} />
                                <ComparisonRow label="Leverage" values={["1:100", "1:200", "1:500", "1:1000"]} />
                                <ComparisonRow label="AI Prediction Hub" values={["Email Only", "Standard", "Advanced", "Quantum"]} />
                                <ComparisonRow label="Liquidity Type" values={["Standard", "Pool A", "Institutional", "Prime Brokerage"]} />
                                <ComparisonRow label="Account Manager" values={[<XIcon />, <XIcon />, <CheckIcon />, <CheckIcon />]} />
                                <ComparisonRow label="Withdrawal Priority" values={["Standard", "Fast", "Instant", "Ultra-Fast"]} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Regulatory Note */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto p-12 glass rounded-[48px] border-white/5 space-y-6">
                    <ShieldCheck size={48} className="mx-auto text-brand-gold" />
                    <h2 className="text-3xl font-black uppercase tracking-tight">SECURE & <span className="gold-gradient">REGULATED</span></h2>
                    <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                        All account tiers are protected by our institutional-grade security infrastructure. We maintain strict compliance with global financial regulations to ensure your capital remains safe and accessible at all times.
                    </p>
                    <div className="flex justify-center gap-8 grayscale opacity-30 pt-4">
                        <div className="flex items-center gap-2"><Landmark size={18} /> <span className="text-[10px] font-black uppercase">FCA License</span></div>
                        <div className="flex items-center gap-2"><Globe size={18} /> <span className="text-[10px] font-black uppercase">Global Hub</span></div>
                        <div className="flex items-center gap-2"><ShieldAlert size={18} /> <span className="text-[10px] font-black uppercase">AML Secure</span></div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ComparisonRow({ label, values }: { label: string, values: any[] }) {
    return (
        <tr className="hover:bg-white/[0.01] transition-colors">
            <td className="p-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</td>
            {values.map((v, i) => (
                <td key={i} className="p-8 text-center text-sm font-medium text-white">{v}</td>
            ))}
        </tr>
    )
}

function CheckIcon() {
    return <CheckCircle2 size={18} className="text-green-500 mx-auto" />
}

function XIcon() {
    return <span className="text-zinc-800 text-lg font-black">—</span>
}
