import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-[var(--border)] pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-brand-gold/30">
                                <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter gold-gradient leading-none uppercase">CrownEdge</span>
                                <span className="text-[10px] tracking-[0.3em] font-medium text-zinc-400">BROKER</span>
                            </div>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-10">
                            CrownEdge Broker is a globally recognized financial platform providing elite trading solutions
                            across Forex, Crypto, Stocks, and Commodities. Founded on the principles of speed,
                            security, and transparency.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Github size={18} />} />
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold text-foreground uppercase tracking-widest text-xs mb-8">Trading</h5>
                        <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                            <FooterLink href="/markets">Web Terminal</FooterLink>
                            <FooterLink href="/platform">Institutional AI</FooterLink>
                            <FooterLink href="/company">About Company</FooterLink>
                            <FooterLink href="/faq">Support FAQ</FooterLink>
                            <FooterLink href="/markets">Market Hours</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-foreground uppercase tracking-widest text-xs mb-8">Resources</h5>
                        <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                            <FooterLink href="#">Academy</FooterLink>
                            <FooterLink href="#">Economic Calendar</FooterLink>
                            <FooterLink href="#">API Docs</FooterLink>
                            <FooterLink href="#">Verification</FooterLink>
                            <FooterLink href="#">Trading Tools</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-foreground uppercase tracking-widest text-xs mb-8">Legal</h5>
                        <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                            <FooterLink href="/company">Privacy Policy</FooterLink>
                            <FooterLink href="/company">Terms & Conditions</FooterLink>
                            <FooterLink href="/company">Risk Disclosure</FooterLink>
                            <FooterLink href="/company">Cookie Policy</FooterLink>
                            <FooterLink href="/company">License & Regulation</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
                        © 2026 CROWNEDGEBROKER.PRO LTD. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8 grayscale opacity-20 hover:opacity-100 transition-opacity">
                        <Image src="/next.svg" alt="Next.js" width={70} height={20} />
                        <Image src="/vercel.svg" alt="Vercel" width={70} height={20} />
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-[40px] bg-[var(--card-bg)] border border-[var(--border)]">
                    <p className="text-[10px] text-zinc-500 leading-relaxed text-center uppercase tracking-widest font-medium">
                        <span className="text-brand-gold font-black">Risk Warning:</span> Trading financial instruments involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-brand-gold transition-colors block">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all">
            {icon}
        </a>
    );
}
