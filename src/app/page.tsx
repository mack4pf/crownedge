import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AssetPreview from "@/components/sections/AssetPreview";
import { Shield, Zap, Globe, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-brand-gold selection:text-black">
      <Navbar />

      <main>
        <Hero />

        {/* Features Split */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <FeatureSmall
              icon={<Zap className="text-brand-gold" size={24} />}
              title="0.0s Latency"
              desc="Institutional connectivity."
            />
            <FeatureSmall
              icon={<Lock className="text-brand-gold" size={24} />}
              title="Cold Storage"
              desc="Assets secured offline."
            />
            <FeatureSmall
              icon={<Globe className="text-brand-gold" size={24} />}
              title="Global Access"
              desc="Trade from anywhere."
            />
            <FeatureSmall
              icon={<Shield className="text-brand-gold" size={24} />}
              title="FCA Regulated"
              desc="Compliant operations."
            />
          </div>
        </section>

        <AssetPreview />

        {/* Call to Action Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-purple/20 blur-[150px] -z-10" />
          <div className="max-w-5xl mx-auto glass p-16 md:p-24 rounded-[64px] border-brand-gold/20 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-brand-gold rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-gold/40">
              <Shield size={42} className="text-black" />
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              READY TO TAKE <br />
              THE <span className="gold-gradient">CROWN?</span>
            </h2>

            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join over 500,000 elite traders globally. Open your institutional account
              in less than 3 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="gold-button px-12 py-5 rounded-2xl text-xl hover:scale-105 transition-transform active:scale-95">
                Open Free Account
              </button>
              <button className="px-12 py-5 rounded-2xl text-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureSmall({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{desc}</p>
    </div>
  )
}
