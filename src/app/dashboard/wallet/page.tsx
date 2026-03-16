"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, Bitcoin, Wallet as WalletIcon,
    Upload, CheckCircle2, Copy, AlertCircle, Loader2,
    Banknote, Zap, ArrowRight, ArrowLeft
} from "lucide-react";

export default function WalletPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const [activeView, setActiveView] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
    const [step, setStep] = useState(1);

    const [methods, setMethods] = useState<any>({});
    const [selectedMethod, setSelectedMethod] = useState<string>("BTC");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [balance, setBalance] = useState(0);
    const [modal, setModal] = useState<{ show: boolean, message: string, type: "success" | "error" }>({ show: false, message: "", type: "success" });
    const [copied, setCopied] = useState(false);
    const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    // Withdraw state
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawMethod, setWithdrawMethod] = useState("BTC");
    const [walletAddress, setWalletAddress] = useState("");
    const [withdrawalCode, setWithdrawalCode] = useState("");

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const res = await fetch("/api/wallet/deposit");
                const data = await res.json();
                if (data.success) {
                    setMethods(data.paymentMethods);
                    setBalance(data.user?.balance || 0);
                }
            } catch (err) {
                console.error("Failed to load methods");
            }
            setFetching(false);
        };
        fetchMethods();
    }, []);

    const getPaymentDetails = () => {
        switch (selectedMethod) {
            case "BTC": return { title: "Bitcoin Address", value: methods.payment_btc || "Loading..." };
            case "ETH": return { title: "Ethereum Address", value: methods.payment_eth || "Loading..." };
            case "USDT": return { title: "USDT (TRC20) Address", value: methods.payment_usdt || "Loading..." };
            case "BANK": return { title: "Bank Transfer Details", value: methods.payment_bank || "Loading..." };
            case "PIX": return { title: "Pix Key", value: methods.payment_pix || "Loading..." };
            default: return { title: "", value: "" };
        }
    };

    const details = getPaymentDetails();

    const handleCopy = () => {
        navigator.clipboard.writeText(details.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            return setModal({ show: true, message: "File is too large, please select an image under 5MB.", type: "error" });
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setReceiptBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleNextStep1 = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return setModal({ show: true, message: "Please enter a valid amount", type: "error" });
        }
        setStep(2);
    };

    const handleNextStep2 = () => {
        setStep(3);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/wallet/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(amount), method: selectedMethod, receiptUrl: receiptBase64 })
            });
            const data = await res.json();
            if (res.ok) {
                setModal({ show: true, message: `Deposit of ${amount} is pending. Check your email for updates.`, type: "success" });
                setAmount("");
                setReceiptBase64(null);
                setFileName("");
                setStep(1);
            } else {
                setModal({ show: true, message: data.error, type: "error" });
            }
        } catch (err) {
            setModal({ show: true, message: "Network error", type: "error" });
        }
        setLoading(false);
    };

    const handleWithdraw = async () => {
        const amt = parseFloat(withdrawAmount);
        if (isNaN(amt) || amt <= 0) return setModal({ show: true, message: "Enter a valid amount", type: "error" });
        if (!walletAddress) return setModal({ show: true, message: "Enter your wallet address / bank details", type: "error" });

        setLoading(true);
        try {
            const res = await fetch("/api/wallet/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amt, method: withdrawMethod, walletAddress, withdrawalCode })
            });
            const data = await res.json();
            if (res.ok) {
                setModal({ show: true, message: "Withdrawal request submitted. Your funds are now under review.", type: "success" });
                setWithdrawAmount("");
                setWalletAddress("");
                setBalance(data.newBalance);
            } else {
                setModal({ show: true, message: data.error, type: "error" });
            }
        } catch (err) {
            setModal({ show: true, message: "Network error", type: "error" });
        }
        setLoading(false);
    };

    if (fetching) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-3">
                    Institutional <span className="gold-gradient">Capital</span>
                </h1>
                <div className="flex justify-center mt-6">
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setActiveView("DEPOSIT")}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "DEPOSIT" ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20" : "text-zinc-500 hover:text-white"}`}
                        >Deposit</button>
                        <button
                            onClick={() => setActiveView("WITHDRAW")}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === "WITHDRAW" ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20" : "text-zinc-500 hover:text-white"}`}
                        >Withdraw</button>
                    </div>
                </div>
            </div>

            {activeView === "DEPOSIT" && (
                <div className="flex justify-center items-center gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? "bg-brand-gold text-black" : "bg-white/10 text-zinc-500"}`}>
                                {step > i ? <CheckCircle2 size={16} /> : i}
                            </div>
                            {i < 3 && <div className={`w-12 h-1 rounded-full ${step > i ? "bg-brand-gold" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>
            )}

            <div className="glass p-6 md:p-8 rounded-[28px] border-brand-gold/20 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeView === "DEPOSIT" ? (
                        <>
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <h2 className="text-xl font-black uppercase tracking-wider text-white mb-6">Enter Amount & Select Method</h2>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Amount ({user?.currency || "USD"})</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount..."
                                            className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-5 py-4 text-xl font-black focus:outline-none focus:border-brand-gold/50 transition-all text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <MethodCard id="BTC" icon={<Bitcoin />} label="Bitcoin" active={selectedMethod === "BTC"} onClick={() => setSelectedMethod("BTC")} />
                                            <MethodCard id="ETH" icon={<Zap />} label="Ethereum" active={selectedMethod === "ETH"} onClick={() => setSelectedMethod("ETH")} />
                                            <MethodCard id="USDT" icon={<WalletIcon />} label="USDT" active={selectedMethod === "USDT"} onClick={() => setSelectedMethod("USDT")} />
                                            <MethodCard id="BANK" icon={<Banknote />} label="Bank Transfer" active={selectedMethod === "BANK"} onClick={() => setSelectedMethod("BANK")} />
                                            <MethodCard id="PIX" icon={<CreditCard />} label="Pix Pay" active={selectedMethod === "PIX"} onClick={() => setSelectedMethod("PIX")} />
                                        </div>
                                    </div>
                                    <button onClick={handleNextStep1} className="w-full mt-6 gold-button py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        Continue <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold mb-4"><ArrowLeft size={16} /> Back</button>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{details.title}</p>
                                        <p className="text-sm font-mono text-zinc-200 break-all select-all mt-2 p-3 bg-black/40 rounded-lg">{details.value}</p>
                                        <button onClick={handleCopy} className="w-full py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                            {copied ? "Copied!" : "Copy Details"}
                                        </button>
                                    </div>
                                    <div className="glass p-6 rounded-2xl border-brand-gold/10 text-center">
                                        <p className="text-zinc-400 text-xs font-bold leading-relaxed">Please send exactly <span className="text-white font-black">{amount} {user?.currency || "USD"}</span> worth of {selectedMethod} to the address above.</p>
                                    </div>
                                    <button onClick={handleNextStep2} className="w-full mt-6 gold-button py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:scale-[1.02] transition-all italic">
                                        I Have Transferred <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold mb-4"><ArrowLeft size={16} /> Back</button>
                                    <h2 className="text-xl font-black uppercase tracking-wider text-white mb-6">Proof of Payment</h2>
                                    <div className="space-y-4">
                                        <div onClick={() => document.getElementById('receipt-upload')?.click()} className="w-full py-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all cursor-pointer group">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-gold transition-colors">
                                                <Upload size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{fileName || "Select Receipt Image"}</p>
                                                <p className="text-[10px] text-zinc-600 font-bold mt-2 uppercase">PNG, JPG up to 5MB</p>
                                            </div>
                                            <input type="file" id="receipt-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                        {receiptBase64 && (
                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                                                <img src={receiptBase64} alt="Receipt Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={handleSubmit} disabled={loading || !receiptBase64} className="w-full mt-6 gold-button py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest disabled:opacity-50">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Deposit"}
                                    </button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div key="withdraw" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <h2 className="text-xl font-black uppercase tracking-wider text-white">Capital Withdrawal</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Amount to Withdraw</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-5 py-4 text-xl font-black focus:border-brand-gold/50 transition-all text-white"
                                    />
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 italic">Available: {user?.currency} {balance.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Withdrawal Method</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <MethodCard id="BTC" icon={<Bitcoin />} label="Bitcoin" active={withdrawMethod === "BTC"} onClick={() => setWithdrawMethod("BTC")} />
                                        <MethodCard id="USDT" icon={<WalletIcon />} label="USDT (TRC20)" active={withdrawMethod === "USDT"} onClick={() => setWithdrawMethod("USDT")} />
                                        <MethodCard id="ETH" icon={<Zap />} label="Ethereum" active={withdrawMethod === "ETH"} onClick={() => setWithdrawMethod("ETH")} />
                                        <MethodCard id="BANK" icon={<Banknote />} label="Bank Transfer" active={withdrawMethod === "BANK"} onClick={() => setWithdrawMethod("BANK")} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Recipient Details</label>
                                    <textarea
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                        placeholder="Wallet address or Bank account details..."
                                        rows={3}
                                        className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold focus:border-brand-gold/50 transition-all text-white resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Withdrawal Pin/Code</label>
                                    <input
                                        type="text"
                                        value={withdrawalCode}
                                        onChange={(e) => setWithdrawalCode(e.target.value)}
                                        placeholder="Enter your withdrawal pin or code..."
                                        className="w-full bg-[#0a0d14] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold focus:border-brand-gold/50 transition-all text-white"
                                    />
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 italic">
                                        Check your email or if you have no withdrawal code purchase your withdrawal code for you to complete your transaction you need to purchase withdrawal code.
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleWithdraw} disabled={loading} className="w-full mt-6 bg-white text-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initiate Request <ArrowRight size={18} /></>}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {modal.show && (
                    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0d14] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modal.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                {modal.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{modal.type === "success" ? "Capital Processed" : "Error"}</h3>
                            <p className="text-zinc-400 text-sm mb-6">{modal.message}</p>
                            <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MethodCard({ id, icon, label, active, onClick }: { id: string, icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${active
                ? "bg-brand-gold/10 border-brand-gold shadow-lg shadow-brand-gold/10"
                : "bg-white/5 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white"
                }`}
        >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? "bg-brand-gold text-black" : "bg-white/10"}`}>
                {icon}
            </div>
            <span className={`font-bold text-[10px] uppercase tracking-widest ${active ? "text-white" : ""}`}>{label}</span>
        </button>
    );
}
