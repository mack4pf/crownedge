"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Lock, User, ShieldCheck, Globe, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { signIn } from "next-auth/react";

const COUNTRIES = [
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "GB" },
    { label: "South Africa", value: "ZA" },
    { label: "Morocco", value: "MA" },
    { label: "Germany", value: "DE" },
    { label: "France", value: "FR" },
    { label: "Italy", value: "IT" },
    { label: "Spain", value: "ES" },
    { label: "Canada", value: "CA" },
    { label: "Mexico", value: "MX" },
    { label: "Brazil", value: "BR" },
    { label: "Argentina", value: "AR" },
    { label: "Japan", value: "JP" },
    { label: "China", value: "CN" },
    { label: "India", value: "IN" },
    { label: "South Korea", value: "KR" },
    { label: "Singapore", value: "SG" },
    { label: "Australia", value: "AU" },
    { label: "New Zealand", value: "NZ" },
    { label: "Netherlands", value: "NL" },
    { label: "Switzerland", value: "CH" },
    { label: "Sweden", value: "SE" },
    { label: "Norway", value: "NO" },
    { label: "Portugal", value: "PT" },
    { label: "Austria", value: "AT" },
    { label: "Belgium", value: "BE" },
    { label: "Greece", value: "GR" },
    { label: "Poland", value: "PL" },
    { label: "Ireland", value: "IE" },
    { label: "Denmark", value: "DK" },
    { label: "Finland", value: "FI" },
    { label: "Czech Republic", value: "CZ" },
    { label: "Hungary", value: "HU" },
    { label: "United Arab Emirates", value: "AE" },
    { label: "Saudi Arabia", value: "SA" },
    { label: "Qatar", value: "QA" },
    { label: "Turkey", value: "TR" },
    { label: "Israel", value: "IL" },
    { label: "Malaysia", value: "MY" },
    { label: "Indonesia", value: "ID" },
    { label: "Thailand", value: "TH" },
    { label: "Vietnam", value: "VN" },
    { label: "Philippines", value: "PH" },
    { label: "Chile", value: "CL" },
    { label: "Colombia", value: "CO" },
    { label: "Peru", value: "PE" },
    { label: "Panama", value: "PA" },
    { label: "Costa Rica", value: "CR" },
    { label: "Iceland", value: "IS" },
    { label: "Russia", value: "RU" },
    { label: "Ukraine", value: "UA" },
].sort((a, b) => a.label.localeCompare(b.label));

const CURRENCIES = [
    { label: "US Dollar (USD)", value: "USD" },
    { label: "Euro (EUR)", value: "EUR" },
    { label: "British Pound (GBP)", value: "GBP" },
    { label: "Brazilian Real (BRL)", value: "BRL" },
    { label: "South African Rand (ZAR)", value: "ZAR" },
    { label: "Moroccan Dirham (MAD)", value: "MAD" },
    { label: "Japanese Yen (JPY)", value: "JPY" },
    { label: "Canadian Dollar (CAD)", value: "CAD" },
    { label: "Australian Dollar (AUD)", value: "AUD" },
    { label: "Swiss Franc (CHF)", value: "CHF" },
    { label: "Chinese Yuan (CNY)", value: "CNY" },
    { label: "Indian Rupee (INR)", value: "INR" },
    { label: "Singapore Dollar (SGD)", value: "SGD" },
    { label: "Hong Kong Dollar (HKD)", value: "HKD" },
    { label: "New Zealand Dollar (NZD)", value: "NZD" },
    { label: "Korean Won (KRW)", value: "KRW" },
    { label: "Mexican Peso (MXN)", value: "MXN" },
    { label: "Saudi Riyal (SAR)", value: "SAR" },
    { label: "UAE Dirham (AED)", value: "AED" },
    { label: "Thai Baht (THB)", value: "THB" },
    { label: "Vietnamese Dong (VND)", value: "VND" },
    { label: "Malaysian Ringgit (MYR)", value: "MYR" },
    { label: "Indonesian Rupiah (IDR)", value: "IDR" },
    { label: "Turkish Lira (TRY)", value: "TRY" },
    { label: "Swedish Krona (SEK)", value: "SEK" },
    { label: "Norwegian Krone (NOK)", value: "NOK" },
    { label: "Danish Krone (DKK)", value: "DKK" },
    { label: "Polish Zloty (PLN)", value: "PLN" },
    { label: "Russian Ruble (RUB)", value: "RUB" },
    { label: "Argentine Peso (ARS)", value: "ARS" },
    { label: "Chilean Peso (CLP)", value: "CLP" },
    { label: "Colombian Peso (COP)", value: "COP" },
    { label: "Peruvian Sol (PEN)", value: "PEN" },
    { label: "Uruguayan Peso (UYU)", value: "UYU" },
    { label: "Panamanian Balboa (PAB)", value: "PAB" },
    { label: "Costa Rican Colon (CRC)", value: "CRC" },
    { label: "Jamaican Dollar (JMD)", value: "JMD" },
    { label: "Philippine Peso (PHP)", value: "PHP" },
    { label: "New Taiwan Dollar (TWD)", value: "TWD" },
    { label: "Israeli Shekel (ILS)", value: "ILS" },
    { label: "Kuwaiti Dinar (KWD)", value: "KWD" },
    { label: "Bahraini Dinar (BHD)", value: "BHD" },
    { label: "Qatari Riyal (QAR)", value: "QAR" },
    { label: "Hungarian Forint (HUF)", value: "HUF" },
    { label: "Czech Koruna (CZK)", value: "CZK" },
    { label: "Romanian Leu (RON)", value: "RON" },
    { label: "Bulgarian Lev (BGN)", value: "BGN" },
    { label: "Croatian Kuna (HRK)", value: "HRK" },
    { label: "Icelandic Krona (ISK)", value: "ISK" },
    { label: "Bitcoin (BTC)", value: "BTC" },
].sort((a, b) => a.label.localeCompare(b.label));

import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        currency: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRegister = async (e: any) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Registration successful! Initiating secure session...");

                // Auto-login
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.error) {
                    setMessage("Account created, but verification session failed. Please check your email.");
                    setTimeout(() => router.push(`/verify?email=${encodeURIComponent(formData.email)}`), 2000);
                } else {
                    router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
                }
            } else {
                setMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            setMessage("Failed to connect to server");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[150px] -z-10 rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="relative w-12 h-12 overflow-hidden rounded-2xl border border-brand-gold/30 shadow-2xl">
                            <Image src="/brand/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">APPLY FOR <span className="gold-gradient">CROWN ACCESS</span></h1>
                    <p className="text-zinc-500 font-medium">Detailed account registration for institutional traders.</p>
                </div>

                <form onSubmit={handleRegister} className="glass p-10 md:p-14 rounded-[48px] border-white/5 shadow-2xl space-y-10">
                    {message && (
                        <div className={`p-4 rounded-xl text-center text-sm font-bold border ${message.includes('successful') ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-8">
                            <p className="text-[10px] font-black text-brand-gold tracking-[0.3em] uppercase border-b border-brand-gold/20 pb-2">Personal Information</p>
                            <InputField
                                label="Full Legal Name"
                                placeholder="Enter your full name"
                                icon={<User size={20} />}
                                type="text"
                                value={formData.name}
                                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <InputField
                                label="Institutional Email"
                                placeholder="name@institutional.com"
                                icon={<Mail size={20} />}
                                type="email"
                                value={formData.email}
                                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <InputField
                                label="Secure Password"
                                placeholder="Minimum 12 characters"
                                icon={<Lock size={20} />}
                                type="password"
                                value={formData.password}
                                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <InputField
                                label="Confirm Password"
                                placeholder="Repeat your password"
                                icon={<Lock size={20} />}
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-8">
                            <p className="text-[10px] font-black text-brand-gold tracking-[0.3em] uppercase border-b border-brand-gold/20 pb-2">Trading Preferences</p>

                            <SearchableSelect
                                label="Country of Residence"
                                options={COUNTRIES}
                                icon={<Globe size={20} />}
                                placeholder="Select or type country..."
                                onSelect={(val: string) => setFormData({ ...formData, country: val })}
                            />

                            <SearchableSelect
                                label="Preferred Account Currency"
                                options={CURRENCIES}
                                icon={<Landmark size={20} />}
                                placeholder="Select account currency..."
                                onSelect={(val: string) => setFormData({ ...formData, currency: val })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 px-1">
                        <div className="flex items-start gap-3">
                            <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 rounded-md bg-white/5 border-white/10 checked:bg-brand-gold transition-all cursor-pointer" />
                            <label htmlFor="terms" className="text-xs font-medium text-zinc-500 leading-relaxed cursor-pointer">
                                I confirm that I am a professional trader and I agree to the <Link href="#" className="text-brand-gold font-bold">Terms of Use</Link> and <Link href="#" className="text-brand-gold font-bold">Risk Disclosure</Link>.
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="gold-button w-full h-18 py-6 rounded-2xl flex items-center justify-center gap-4 text-xl group shadow-2xl shadow-brand-gold/20 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Finalize Registration"}
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <div className="pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-zinc-500 font-medium">
                            Already part of the elite?{" "}
                            <Link href="/login" className="text-brand-gold font-bold hover:underline">Log In</Link>
                        </p>
                    </div>
                </form>

                <div className="mt-10 grid grid-cols-3 gap-6">
                    <TrustSmall icon={<ShieldCheck size={20} />} label="FCA Regulated" />
                    <TrustSmall icon={<Globe size={20} />} label="Global Liquidity" />
                    <TrustSmall icon={<Lock size={20} />} label="256-Bit SSL" />
                </div>
            </motion.div>
        </div>
    );
}

function InputField({ label, placeholder, icon, type, value, onChange, required }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-zinc-600 group-focus-within:text-brand-gold transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full bg-[#0c0f14] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/30 transition-all placeholder:text-zinc-700"
                />
            </div>
        </div>
    )
}

function TrustSmall({ icon, label }: any) {
    return (
        <div className="glass py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border-white/5 grayscale opacity-50">
            <div className="text-brand-gold">{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
    )
}
