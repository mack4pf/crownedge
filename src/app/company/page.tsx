"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Award, Users, CheckCircle2, Building2, Landmark, History } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-[#05070a] text-white">
            <Navbar />

            {/* Mission Hero */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] -z-10 rounded-full" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black tracking-widest uppercase">
                            <Building2 size={14} />
                            <span>Established 2014</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                            THE INSTITUTIONAL <br />
                            <span className="gold-gradient">STANDARD</span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                            CrownEdge is not just a broker; we are a leading global investment platform. For over a decade, we have provided the infrastructure for elite traders and investors to dominate the financial markets.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Grid */}
            <section className="py-24 px-6 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <ValueCard
                            icon={<Shield className="text-brand-gold" size={32} />}
                            title="Unrivaled Security"
                            desc="Institutional-grade encryption and cold storage solutions for diversified asset protection."
                        />
                        <ValueCard
                            icon={<Globe className="text-brand-gold" size={32} />}
                            title="Global Presence"
                            desc="Licensed and regulated across multiple jurisdictions, serving clients in over 120 countries."
                        />
                        <ValueCard
                            icon={<Award className="text-brand-gold" size={32} />}
                            title="Award Winning"
                            desc="Recognized as the 'Best Investment Platform' for 5 consecutive years by Global Finance."
                        />
                    </div>
                </div>
            </section>

            {/* History & Scale */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <h2 className="text-5xl font-black tracking-tighter uppercase">A DECADE OF <span className="gold-gradient">GROWTH</span></h2>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Since our inception in 2014, CrownEdge has evolved from a specialized crypto-clearing firm into a multi-asset investment powerhouse. We manage accounts ranging from entry-level $50 portfolios to institutional $50 million sovereign funds.
                        </p>

                        <div className="space-y-6">
                            <TimelineItem year="2014" title="Foundation" desc="CrownEdge founded as a high-frequency trading firm in London." />
                            <TimelineItem year="2017" title="Global Expansion" desc="Expansion into Asian and American markets with full licensing." />
                            <TimelineItem year="2021" title="AI Revolution" desc="Launched proprietary AI investment engines for all account tiers." />
                            <TimelineItem year="2024" title="Institutional King" desc="Managing over $500M in assets across Forex, Crypto, and Stocks." />
                        </div>
                    </div>

                    <div className="relative aspect-square rounded-[48px] overflow-hidden border border-white/10 group shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="CrownEdge Headquarters"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-gold mb-1">HQ London</p>
                            <p className="text-2xl font-black uppercase tracking-tighter">Global Headquarters</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Regulatory Footer */}
            <section className="py-24 px-6 bg-brand-gold text-black text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Landmark size={48} className="mx-auto" />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">TRANS-ATLANTIC REGULATION</h2>
                    <p className="text-xl font-bold opacity-80">
                        CrownEdge Broker is a regulated investment firm. We strictly comply with global AML and KYC protocols to ensure the highest level of investor protection.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ValueCard({ icon, title, desc }: any) {
    return (
        <div className="glass p-10 rounded-[40px] border-white/5 space-y-6 hover:translate-y-[-10px] transition-all">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">{icon}</div>
            <div className="space-y-2">
                <h4 className="text-2xl font-black tracking-tighter uppercase">{title}</h4>
                <p className="text-zinc-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

function TimelineItem({ year, title, desc }: any) {
    return (
        <div className="flex gap-8 group">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-black text-xs group-hover:bg-brand-gold group-hover:text-black transition-all">
                    {year}
                </div>
                <div className="w-px flex-1 bg-white/10 my-2" />
            </div>
            <div className="pb-8">
                <h4 className="font-bold text-lg uppercase tracking-tight">{title}</h4>
                <p className="text-zinc-500 text-sm font-medium">{desc}</p>
            </div>
        </div>
    )
}
