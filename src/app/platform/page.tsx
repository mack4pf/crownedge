"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Cpu,
    TrendingUp,
    Users,
    Quote,
    Star,
    CheckCircle2,
    Globe,
    Award,
    Zap
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const REVIEWS = [
    { name: "Julian Thorne", role: "Hedge Fund Manager", text: "The AI precision on CrownEdge is unlike anything I've seen in 15 years. My portfolio grew from $500k to $2.1M in just 14 months.", rating: 5, avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Elena Rodriguez", role: "Retail Trader", text: "Started with $250. CrownEdge's AI executed trades perfectly while I was at work. My balance is now over $15,000.", rating: 5, avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Marcus Chen", role: "Crypto Analyst", text: "Institutional liquidity and zero latency. CrownEdge is the true king of crypto trading. Their AI handles volatility perfectly.", rating: 5, avatar: "https://i.pravatar.cc/150?u=3" },
    { name: "Sarah Williams", role: "Investment Specialist", text: "Seamless transition from traditional banking to digital assets. The AI risk management is phenomenal.", rating: 5, avatar: "https://i.pravatar.cc/150?u=4" },
    { name: "Dr. Aris Petrov", role: "Algorithm Developer", text: "I analyzed their AI logic. It's decades ahead of the competition. Managed to scale my account from $50k to $1.2M.", rating: 5, avatar: "https://i.pravatar.cc/150?u=5" },
    { name: "Linda G.", role: "Full-time Trader", text: "Trust is hard to earn in this industry. CrownEdge earned mine since 2014. Always profitable, always secure.", rating: 5, avatar: "https://i.pravatar.cc/150?u=6" },
    { name: "Kevin V.", role: "Private Investor", text: "Moved my institutional funds to CrownEdge. The service is premium, and the AI placement is surgical.", rating: 5, avatar: "https://i.pravatar.cc/150?u=7" },
    { name: "Sofia L.", role: "Tech Entrepreneur", text: "Finally a platform that uses AI correctly. It scaled my seed investment X20 in less than a year.", rating: 5, avatar: "https://i.pravatar.cc/150?u=8" },
    // ... adding more to reach toward 20 as requested
    { name: "Ahmed R.", role: "Forex Senior", text: "The spreads are raw. The AI execution is instant. CrownEdge is the industry benchmark.", rating: 5, avatar: "https://i.pravatar.cc/150?u=9" },
    { name: "Victor S.", role: "Wealth Manager", text: "I manage over $10M on this platform. The AI's ability to minimize drawdown is its greatest strength.", rating: 5, avatar: "https://i.pravatar.cc/150?u=10" },
].concat(
    Array(10).fill(null).map((_, i) => ({
        name: ["John D.", "Lisa M.", "Robert K.", "Emma W.", "David L.", "Maria G.", "Steve B.", "Chloe F.", "Mark P.", "Yuki T."][i],
        role: "Professional Trader",
        text: "The institutional edge I needed. Profitability has stayed consistent thanks to the proprietary AI engine.",
        rating: 5,
        avatar: `https://i.pravatar.cc/150?u=${i + 20}`
    }))
);

export default function PlatformPage() {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const displayedReviews = showAllReviews ? REVIEWS : REVIEWS.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-brand-purple/20 blur-[150px] -z-10" />
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-[0.2em] uppercase">
                            <Award size={14} />
                            <span>THE KING OF CRYPTO TRADING</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">
                            A LEGACY OF <br />
                            <span className="gold-gradient uppercase text-7xl md:text-9xl">EXCELLENCE</span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed font-medium max-w-xl">
                            Since 2014, CrownEdge has dominated the financial landscape. From a small boutique firm to managing over $500M in assets, we remain the institutional choice for elite traders.
                        </p>
                        <div className="flex gap-10 pt-4">
                            <div>
                                <p className="text-4xl font-black gold-gradient">10+</p>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Years Operating</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black gold-gradient">500k+</p>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Global Users</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black gold-gradient">$500M+</p>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Assets Managed</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="/wall-street.png"
                            alt="Wall Street Trading Floor"
                            width={800}
                            height={600}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* AI Section */}
            <section className="py-32 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1 relative rounded-[40px] border border-brand-gold/20 overflow-hidden group aspect-video">
                            <Image
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop"
                                alt="Professional Trading Team"
                                width={800}
                                height={600}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-brand-purple/20 mix-blend-overlay" />
                        </div>

                        <div className="order-1 lg:order-2 space-y-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-brand-gold text-[10px] font-black tracking-widest uppercase">
                                <Cpu size={14} /> <span>PROPRIETARY AI ENGINE</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight uppercase">
                                AI-POWERED <br />
                                <span className="gold-gradient">EXECUTION HUB</span>
                            </h2>
                            <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                                All CrownEdge accounts are connected to our master AI protocols. This system scans 5,000+ data points per second to identify surgical entry and exit points.
                            </p>
                            <div className="space-y-6">
                                <FeatureItem title="Hyper-Scale Management" desc="From $50 to $50M. Our AI scales logic based on account tier seamlessly." />
                                <FeatureItem title="Guaranteed Profitability" desc="Our automated placement ensures our users stay on the right side of the tape." />
                                <FeatureItem title="Risk Mitigation V4" desc="Instant hedging logic that protects capital during black swan events." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <h2 className="text-5xl font-black tracking-tighter uppercase mb-6">WHAT ELITE <span className="gold-gradient">TRADERS</span> SAY</h2>
                    <p className="text-zinc-500 font-medium">Real stories from traders who scaled their accounts with CrownEdge AI.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedReviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (i % 3) * 0.1 }}
                            className="glass p-10 rounded-[48px] border-white/5 hover:border-brand-gold/30 transition-all group"
                        >
                            <Quote className="text-brand-gold/20 mb-8 group-hover:text-brand-gold/40 transition-colors" size={40} />
                            <p className="text-lg font-medium leading-relaxed mb-8 italic text-zinc-300">"{review.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border border-brand-gold/20" />
                                <div className="text-left">
                                    <h4 className="font-bold tracking-tight">{review.name}</h4>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{review.role}</p>
                                </div>
                                <div className="ml-auto flex gap-0.5">
                                    {Array(review.rating).fill(null).map((_, j) => <Star key={j} size={10} fill="#d4af37" className="text-brand-gold" />)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {!showAllReviews && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={() => setShowAllReviews(true)}
                            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all"
                        >
                            See More Client Reviews
                        </button>
                    </div>
                )}
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto bg-brand-gold rounded-[64px] p-16 md:p-24 text-center text-black relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight uppercase relative z-10">
                        SCALE TO THE <br />
                        <span className="text-white drop-shadow-2xl">NEXT LEVEL</span>
                    </h2>
                    <p className="text-black/70 text-xl font-bold mb-12 max-w-2xl mx-auto relative z-10">
                        Stop guessing. Start winning. Let the CrownEdge AI handle the tape while you focus on life.
                    </p>
                    <Link href="/register" className="inline-block bg-black text-white px-12 py-5 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-2xl relative z-10">
                        Join the club of professional traders
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-brand-gold" />
                </div>
            </div>
            <div>
                <h4 className="font-bold tracking-tight text-lg">{title}</h4>
                <p className="text-zinc-500 text-sm">{desc}</p>
            </div>
        </div>
    )
}
