"use client";

import { useEffect, useState, useRef } from "react";
import { User, ShieldCheck, Mail, Globe, MapPin, UploadCloud, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [selfieImage, setSelfieImage] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/dashboard");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ text: "File size must be less than 5MB", type: "error" });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmitKYC = async () => {
        if (!frontImage || !backImage || !selfieImage) {
            setMessage({ text: "Please upload all 3 required documents.", type: "error" });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/kyc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ frontImage, backImage, selfieImage }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ text: data.message, type: "success" });
                fetchData(); // refresh status
            } else {
                setMessage({ text: data.error, type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred during upload.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-brand-gold" size={40} />
            </div>
        );
    }

    const { verificationStatus } = user || {};

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Account <span className="text-brand-gold">Profile & KYC</span></h1>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Manage your institutional identity and compliance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-8">
                    <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden text-center group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="w-24 h-24 mx-auto rounded-[32px] bg-black border border-white/10 flex items-center justify-center text-3xl font-black text-brand-gold shadow-2xl mb-6 relative">
                            {user?.name?.charAt(0) || 'U'}
                            {verificationStatus === 'verified' && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-black rounded-full p-1.5 border-[3px] border-[#0a0f16]">
                                    <ShieldCheck size={16} />
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{user?.name}</h2>

                        <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] px-4 py-1.5 rounded-full mb-8">
                            <Mail size={12} className="text-brand-gold" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user?.email}</span>
                        </div>

                        <div className="space-y-4 text-left border-t border-white/5 pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <Globe size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Base Currency</span>
                                </div>
                                <span className="text-sm font-black text-white">{user?.currency}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <MapPin size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Region</span>
                                </div>
                                <span className="text-sm font-black text-white">{user?.country || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* KYC Submission Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
                    <div className="glass p-8 md:p-12 rounded-[32px] border-white/5 h-full">
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center justify-center md:justify-start gap-3 mb-2">
                                <ShieldCheck className="text-brand-gold" size={24} />
                                Institutional Verification (KYC)
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest">
                                Comply with global anti-money laundering regulations by submitting valid identification.
                            </p>
                        </div>

                        {verificationStatus === 'verified' ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center animate-pulse">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-green-500 uppercase tracking-tight mb-2">Account Verified</h4>
                                    <p className="text-zinc-400 text-sm font-medium">Your identity has been successfully authenticated by our compliance team.</p>
                                </div>
                            </div>
                        ) : verificationStatus === 'pending' ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-pulse">
                                    <Loader2 size={48} className="animate-spin" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-amber-500 uppercase tracking-tight mb-2">Review in Progress</h4>
                                    <p className="text-zinc-400 text-sm font-medium">Your documents are securely held and are being reviewed by compliance officers.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {verificationStatus === 'rejected' && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex gap-4 text-red-500">
                                        <XCircle size={24} className="shrink-0" />
                                        <div>
                                            <p className="text-sm font-black uppercase mb-1">Verification Rejected</p>
                                            <p className="text-xs font-medium text-red-400">Unfortunately, your uploaded documents were not accepted. Please ensure they are clear, valid, and recent, then submit them again.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DocumentUploadBox label="Front of ID" image={frontImage} setImage={setFrontImage} onUpload={handleFileUpload} />
                                    <DocumentUploadBox label="Back of ID" image={backImage} setImage={setBackImage} onUpload={handleFileUpload} />
                                </div>

                                <div className="max-w-md mx-auto">
                                    <DocumentUploadBox label="Selfie with ID" image={selfieImage} setImage={setSelfieImage} onUpload={handleFileUpload} />
                                </div>

                                {message && (
                                    <div className={`p-4 rounded-xl text-xs font-bold flex gap-3 items-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        <AlertCircle size={16} />
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmitKYC}
                                    disabled={submitting}
                                    className="w-full py-5 rounded-2xl bg-brand-gold text-black font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-gold/20 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                                    {submitting ? "Uploading Securely..." : "Submit Documents"}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function DocumentUploadBox({ label, image, setImage, onUpload }: { label: string; image: string | null; setImage: (s: string | null) => void; onUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: any) => void }) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">{label}</p>
            <label className="block w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 hover:border-brand-gold/40 bg-[var(--card-bg)] transition-all cursor-pointer overflow-hidden group relative">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpload(e, setImage)} />
                {image ? (
                    <img src={image} alt="Upload Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 group-hover:text-brand-gold transition-colors space-y-2">
                        <UploadCloud size={32} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Click to Upload</span>
                    </div>
                )}
            </label>
        </div>
    );
}
