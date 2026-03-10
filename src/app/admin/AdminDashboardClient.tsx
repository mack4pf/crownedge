"use client";

import { useState, useMemo, useEffect, useRef, ReactNode } from "react";
import {
    CheckCircle2, XCircle, AlertCircle,
    Settings as SettingsIcon, Users, CreditCard,
    Search, Plus, MapPin, Mail,
    User as UserIcon, LogOut, ExternalLink,
    Clock, ShieldCheck, TrendingUp, DollarSign,
    RefreshCw, ChevronRight, Menu, X, ArrowUpRight,
    MessageSquare, Send, FileText, ChevronDown, LayoutDashboard,
    Image as ImageIcon, Paperclip, ChevronLeft, Radio
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from '@/components/ui/NotificationBell';

export default function AdminDashboardClient({ users, deposits, withdrawals, settings }: any) {
    const [activeTab, setActiveTab] = useState("DASHBOARD");
    const [finSubTab, setFinSubTab] = useState<"DEPOSITS" | "WITHDRAWALS">("DEPOSITS");
    const [localSettings, setLocalSettings] = useState(settings);
    const [userSearch, setUserSearch] = useState("");
    const [notif, setNotif] = useState<{ show: boolean, msg: string, type: "success" | "error" }>({ show: false, msg: "", type: "success" });

    // Modals
    const [selectedUserForMoney, setSelectedUserForMoney] = useState<any>(null);
    const [selectedUserForMsg, setSelectedUserForMsg] = useState<any>(null);

    // Messaging (One-way Notification) State
    const [msgSubject, setMsgSubject] = useState("");
    const [msgTitle, setMsgTitle] = useState("");
    const [msgBody, setMsgBody] = useState("");
    const [isSendingMsg, setIsSendingMsg] = useState(false);

    // Chat (Live Two-way) State
    const [chatTarget, setChatTarget] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatImage, setChatImage] = useState<string | null>(null);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const TEMPLATES = [
        {
            id: 1,
            name: "Withdrawal Pending",
            subject: "Withdrawal Request Received",
            title: "Your Withdrawal is Being Processed",
            body: "We have received your withdrawal request. Please note that it typically takes 3 hours to 4 business days to process and verify the funds before they are released to your destination wallet."
        },
        {
            id: 2,
            name: "Withdrawal Held (Hold)",
            subject: "Security Hold on Withdrawal",
            title: "Action Required: Withdrawal Temporary Held",
            body: "Your recent withdrawal request has been flagged due to suspicious activity in your account. To proceed with the release of your funds, you are required to perform a security verification deposit of [AMOUNT] [CURRENCY]. Once verified, both amounts will be available for withdrawal."
        },
        {
            id: 3,
            name: "Account Upgrade",
            subject: "Account Tier Upgrade Required",
            title: "Institutional Account Upgrade",
            body: "To unlock higher trading limits and priority withdrawals, your account needs to be upgraded to the Elite Institutional Tier. Please contact your account manager for the specific requirements for your region."
        },
        {
            id: 4,
            name: "KYC Verified",
            subject: "KYC Verification Successful",
            title: "Account Fully Verified",
            body: "Congratulations! Your account has passed our institutional KYC verification process. All restriction levels have been lifted and your account is now in good standing."
        },
        {
            id: 5,
            name: "Direct Refund",
            subject: "Refund Credited to Account",
            title: "Transaction Refund Notice",
            body: "A recent transaction has been reversed and the amount has been successfully refunded back to your primary trading balance. You may now continue your trading activities."
        }
    ];

    const applyTemplate = (t: any) => {
        setMsgSubject(t.subject);
        setMsgTitle(t.title);
        setMsgBody(t.body);
    };

    // Auto-hide notifications
    useEffect(() => {
        if (notif.show) {
            const timer = setTimeout(() => setNotif({ ...notif, show: false }), 4000);
            return () => clearTimeout(timer);
        }
    }, [notif]);

    const showMessage = (msg: string, type: "success" | "error" = "success") => {
        setNotif({ show: true, msg, type });
    };

    // Chat Logic
    useEffect(() => {
        if (activeTab === "CHATS" && chatTarget) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab, chatTarget]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        if (!chatTarget) return;
        const res = await fetch(`/api/messages?userId=${chatTarget._id}`);
        if (res.ok) {
            const data = await res.json();
            setMessages(data);
        }
    };

    const handleSendChat = async () => {
        if (!chatTarget || (!chatInput.trim() && !chatImage)) return;

        const payload = {
            receiverId: chatTarget._id,
            content: chatInput,
            image: chatImage
        };

        const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setChatInput("");
            setChatImage(null);
            fetchMessages();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setChatImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Filter deposits
    const pendingDeposits = deposits.filter((d: any) => d.status === "PENDING");

    // Search Users
    const filteredUsers = useMemo(() => {
        return users.filter((u: any) =>
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [users, userSearch]);

    // Actions
    const handleApproveDeposit = async (id: string, userId: string, amount: number) => {
        const res = await fetch("/api/admin/deposits/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId, amount })
        });
        if (res.ok) {
            showMessage("Deposit approved and verified!");
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleRejectDeposit = async (id: string) => {
        const res = await fetch("/api/admin/deposits/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            showMessage("Deposit rejected.");
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleUpdateWithdrawal = async (id: string, status: string) => {
        const res = await fetch("/api/admin/withdrawals/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status })
        });
        if (res.ok) {
            showMessage(`Withdrawal status updated to ${status.replace('_', ' ')}`);
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleUpdateSetting = async (key: string, value: string) => {
        const res = await fetch("/api/admin/settings/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value })
        });
        if (res.ok) showMessage("Global setting updated!");
    };

    const [addMoneyAmt, setAddMoneyAmt] = useState("");
    const handleAddMoneySubmit = async () => {
        if (!selectedUserForMoney || !addMoneyAmt) return;
        const res = await fetch("/api/admin/users/add-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: selectedUserForMoney._id, amount: parseFloat(addMoneyAmt) })
        });
        if (res.ok) {
            showMessage("Balance updated and user notified via email!");
            setSelectedUserForMoney(null);
            setAddMoneyAmt("");
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedUserForMsg || !msgSubject || !msgBody) return;
        setIsSendingMsg(true);
        const res = await fetch("/api/admin/users/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: selectedUserForMsg._id,
                subject: msgSubject,
                title: msgTitle,
                body: msgBody
            })
        });
        setIsSendingMsg(false);
        if (res.ok) {
            showMessage("Custom institutional message sent to user!");
            setSelectedUserForMsg(null);
            setMsgSubject("");
            setMsgTitle("");
            setMsgBody("");
        } else {
            showMessage("Failed to send message", "error");
        }
    };

    const TABS = [
        { id: "DASHBOARD", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { id: "FINANCIALS", label: "Capital", icon: <CreditCard size={20} /> },
        { id: "USERS", label: "Traders", icon: <Users size={20} /> },
        { id: "SUBS", label: "VIP Subs", icon: <TrendingUp size={20} /> },
        { id: "CHATS", label: "Chats", icon: <MessageSquare size={20} /> },
        { id: "SETTINGS", label: "Control", icon: <SettingsIcon size={20} /> },
    ];

    const stats = [
        { label: "Active Traders", value: users.length, color: "blue", icon: <Users size={16} /> },
        { label: "Pending Tasks", value: pendingDeposits.length, color: "gold", icon: <Clock size={16} /> },
        { label: "Security Level", value: "Level 4", color: "green", icon: <ShieldCheck size={16} /> },
    ];

    return (
        <div className="min-h-screen bg-[#020408] text-zinc-100 flex flex-col md:flex-row pb-20 md:pb-0">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-[#070a0f] border-r border-white/5 sticky top-0 h-screen p-8 shrink-0 shadow-2xl">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold flex items-center justify-center p-0.5">
                        <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
                            <ShieldCheck className="text-brand-gold" size={24} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black italic tracking-tighter">CROWN <span className="text-brand-gold">EDGE</span></h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Admin Console</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20" : "text-zinc-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold/20 to-transparent border border-brand-gold/20 flex items-center justify-center">
                            <UserIcon className="text-brand-gold" size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase">Root Admin</p>
                            <p className="text-[10px] text-zinc-500 font-bold">Secure Session Active</p>
                        </div>
                    </div>
                    <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-zinc-500 font-bold text-[10px] uppercase tracking-widest hover:text-red-400 hover:border-red-400/30 transition-all flex items-center justify-center gap-2">
                        <LogOut size={14} /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 overflow-x-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#070a0f] border-b border-white/5 px-6 py-5 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-brand-gold" size={24} />
                        <h1 className="text-lg font-black italic tracking-tighter uppercase">Admin <span className="text-brand-gold underline decoration-white/20 underline-offset-4 decoration-2">Core</span></h1>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_green]" />
                </header>

                {/* Notifications */}
                <AnimatePresence>
                    {notif.show && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${notif.type === "success" ? "bg-[#0a1f13] border-green-500/30 text-green-400" : "bg-[#1f0a0a] border-red-500/30 text-red-400"
                                }`}
                        >
                            {notif.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{notif.msg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">

                    {/* Welcome Section */}
                    {activeTab !== "CHATS" && (
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <p className="text-brand-gold font-black uppercase text-[10px] tracking-[0.4em] mb-3">Institutional Control</p>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">System <span className="text-zinc-500">Overview</span></h2>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {stats.map(s => (
                                    <div key={s.label} className="glass min-w-[140px] px-6 py-5 rounded-3xl border-white/5 text-center flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                                            {s.icon}
                                        </div>
                                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">{s.label}</p>
                                        <p className="text-xl font-black text-white">{s.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dynamic Tabs */}
                    <AnimatePresence mode="wait">
                        {activeTab === "DASHBOARD" && (
                            <motion.div key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DashCard label="Real-Time Orders" value={pendingDeposits.length} color="gold" desc="Pending for review" />
                                    <DashCard label="Total Userbase" value={users.length} color="blue" desc="Verified traders" />
                                    <DashCard label="System Integrity" value="OPTIMAL" color="green" desc="No breaches detected" />
                                </div>

                                <div className="glass p-8 rounded-[40px] border-white/5">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 border-b border-white/5 pb-6 flex items-center justify-between">
                                        Recent Activity Log
                                        <TrendingUp className="text-zinc-800" size={16} />
                                    </h3>
                                    <div className="space-y-6">
                                        {deposits.slice(0, 5).map((d: any) => (
                                            <div key={d._id} className="flex items-center justify-between pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                        <UserIcon className="text-zinc-600" size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase">{d.userId?.email || 'System Account'}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{d.method} Transaction</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-white">+{d.currency} {d.amountLocal.toLocaleString()}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${d.status === 'APPROVED' ? 'text-green-500' : 'text-brand-gold'}`}>{d.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "FINANCIALS" && (
                            <motion.div key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="flex p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
                                    <button
                                        onClick={() => setFinSubTab("DEPOSITS")}
                                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${finSubTab === "DEPOSITS" ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20" : "text-zinc-500 hover:text-white"}`}
                                    >Incoming Payments</button>
                                    <button
                                        onClick={() => setFinSubTab("WITHDRAWALS")}
                                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${finSubTab === "WITHDRAWALS" ? "bg-brand-gold text-black shadow-lg shadow-brand-gold/20" : "text-zinc-500 hover:text-white"}`}
                                    >Outbound Requests</button>
                                </div>

                                {finSubTab === "DEPOSITS" ? (
                                    <div className="grid gap-6">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Deposit Queue ({pendingDeposits.length})</h4>
                                        {pendingDeposits.length === 0 ? (
                                            <div className="glass p-16 text-center rounded-[40px] border-white/5">
                                                <p className="text-zinc-500 font-black uppercase text-xs tracking-[0.4em]">Zero Deposits Pending</p>
                                            </div>
                                        ) : (
                                            pendingDeposits.map((d: any) => (
                                                <div key={d._id} className="glass p-6 md:p-8 rounded-[40px] border-white/5 hover:border-brand-gold/20 transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center">
                                                            <ArrowUpRight className="text-zinc-500" size={30} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-black uppercase">{d.userId?.name || 'Trader'}</h4>
                                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{d.userId?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                                                        <div>
                                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Amount</p>
                                                            <p className="text-xl font-black italic">{d.currency} {d.amountLocal.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Method</p>
                                                            <p className="text-xs font-black text-brand-gold">{d.method}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button onClick={() => handleApproveDeposit(d._id, d.userId?._id, d.amountLocal)} className="py-4 px-8 bg-brand-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Approve</button>
                                                        <button onClick={() => handleRejectDeposit(d._id)} className="py-4 px-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Withdrawal Requests ({withdrawals.filter((w: any) => w.status !== 'APPROVED' && w.status !== 'REJECTED').length})</h4>
                                        {withdrawals.length === 0 ? (
                                            <div className="glass p-16 text-center rounded-[40px] border-white/5">
                                                <p className="text-zinc-500 font-black uppercase text-xs tracking-[0.4em]">Zero Withdrawal Requests</p>
                                            </div>
                                        ) : (
                                            withdrawals.map((w: any) => (
                                                <div key={w._id} className="glass p-8 rounded-[40px] border-white/5 hover:border-brand-gold/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center shadow-2xl">
                                                            <CreditCard className={`${w.status === 'UNDER_REVIEW' ? 'text-brand-gold' : 'text-zinc-500'}`} size={30} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-black uppercase tracking-tight">{w.userId?.name || 'Trader'}</h4>
                                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{w.userId?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 max-w-xl">
                                                        <div>
                                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Dest. Wallet</p>
                                                            <p className="text-[10px] font-mono text-zinc-300 break-all select-all bg-black/40 p-2 rounded-lg">{w.walletAddress}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Amount</p>
                                                            <p className="text-xl font-black italic">{w.currency} {w.amountLocal.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Status</p>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${w.status === 'PENDING' ? 'text-zinc-500' : w.status === 'UNDER_REVIEW' ? 'text-brand-gold animate-pulse' : 'text-white'}`}>{w.status.replace('_', ' ')}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => handleUpdateWithdrawal(w._id, "APPROVED")} className="p-4 bg-green-600 text-white rounded-2xl hover:bg-green-500 transition-all shadow-lg shadow-green-600/20" title="Approve Payment"><CheckCircle2 size={20} /></button>
                                                        <button onClick={() => handleUpdateWithdrawal(w._id, "UNDER_REVIEW")} className="p-4 bg-brand-gold text-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-brand-gold/20" title="Mark Under Review"><Clock size={20} /></button>
                                                        <button onClick={() => setSelectedUserForMsg(w.userId)} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20" title="Send Security Alert"><Mail size={20} /></button>
                                                        <button onClick={() => handleUpdateWithdrawal(w._id, "REJECTED")} className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/10" title="Reject Payment"><X size={20} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "USERS" && (
                            <motion.div key="usr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 ml-2">Market Participants</h3>
                                    <div className="relative group w-full md:w-96">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-gold transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="FILTER DATABASE BY NAME OR EMAIL..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="w-full bg-[#070a0f] border-2 border-white/5 rounded-[30px] py-5 pl-16 pr-8 text-xs font-black uppercase tracking-[0.2em] focus:outline-none focus:border-brand-gold/30 transition-all placeholder:text-zinc-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredUsers.map((u: any) => (
                                        <div key={u._id} className="glass p-7 rounded-[40px] border-white/5 space-y-6 group hover:border-white/10 transition-all">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-[24px] bg-black flex items-center justify-center font-black text-2xl text-white border border-white/5 shadow-2xl">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black uppercase tracking-tight">{u.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_green]" />
                                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                        {u.country || 'N/A'}
                                                    </div>
                                                    {u.subscription && u.subscription !== 'none' && (
                                                        <div className="px-5 py-2.5 bg-brand-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/20 flex items-center gap-2">
                                                            <TrendingUp size={12} /> {u.subscription}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-[#05070a] p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mb-1.5">Net Equity</p>
                                                        <p className="text-xl font-black italic text-brand-gold select-all">{u.currency} {u.balance.toLocaleString()}</p>
                                                    </div>
                                                    <button onClick={() => setSelectedUserForMoney(u)} className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all">
                                                        <DollarSign size={20} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedUserForMsg(u)}
                                                    className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center justify-between hover:bg-brand-gold/10 hover:border-brand-gold/30 transition-all group/msg"
                                                >
                                                    <div className="text-left">
                                                        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mb-1.5">Direct institutional Notification</p>
                                                        <p className="text-xs font-black uppercase tracking-widest group-hover/msg:text-white">Email Template</p>
                                                    </div>
                                                    <Mail size={20} className="text-zinc-700 group-hover/msg:text-brand-gold" />
                                                </button>
                                                <button
                                                    onClick={() => { setChatTarget(u); setActiveTab("CHATS"); }}
                                                    className="col-span-1 md:col-span-2 bg-[#0a0d14] border border-white/5 p-5 rounded-[28px] flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
                                                >
                                                    <MessageSquare size={18} className="text-brand-gold" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Live Secure Chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "CHATS" && (
                            <motion.div key="cht" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 relative">
                                {/* Chat Sidebar (Contacts) */}
                                <div className={`w-full md:w-80 glass rounded-[40px] border-white/5 flex flex-col overflow-hidden shrink-0 ${chatTarget ? "hidden md:flex" : "flex"}`}>
                                    <div className="p-6 border-b border-white/5">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Client Conversations</h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                            <input
                                                type="text"
                                                placeholder="SEARCH CONTACTS..."
                                                className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold focus:outline-none"
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto no-scrollbar">
                                        {filteredUsers.map((u: any) => (
                                            <button
                                                key={u._id}
                                                onClick={() => setChatTarget(u)}
                                                className={`w-full p-5 flex items-center gap-4 border-b border-white/5 transition-all text-left ${chatTarget?._id === u._id ? "bg-brand-gold/10 border-r-4 border-r-brand-gold" : "hover:bg-white/5"}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-black text-brand-gold border border-white/10 shrink-0">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-black uppercase truncate">{u.name}</p>
                                                    <p className="text-[9px] text-zinc-600 font-bold truncate uppercase">{u.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notification Bell */}
                                <div className="ml-auto mr-4">
                                    <NotificationBell fetchUrl="/api/admin/notifications" />
                                </div>
                                {/* Chat Window */}
                                <div className={`flex-1 glass rounded-[40px] border-white/5 flex flex-col overflow-hidden relative ${!chatTarget ? "hidden md:flex" : "flex"}`}>
                                    {!chatTarget ? (
                                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                                <MessageSquare className="text-zinc-800" size={40} />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter">Client Chat Node</h3>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">Select a market participant from the left to start a secure institutional dialogue.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Chat Header */}
                                            <div className="p-5 md:p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setChatTarget(null)}
                                                        className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
                                                    >
                                                        <ChevronLeft size={24} />
                                                    </button>
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                                                        <UserIcon className="text-brand-gold" size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs md:text-sm font-black uppercase">{chatTarget.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            <p className="text-[8px] md:text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Session Secure</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
                                                {messages.map((m: any, idx) => {
                                                    const isMe = m.senderId === chatTarget._id ? false : true;
                                                    return (
                                                        <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                            <div className={`max-w-[80%] md:max-w-[70%] space-y-2`}>
                                                                <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${isMe ? "bg-brand-gold text-black rounded-br-none shadow-lg shadow-brand-gold/10" : "bg-white/5 text-zinc-200 border border-white/10 rounded-bl-none"}`}>
                                                                    {m.content}
                                                                    {m.image && (
                                                                        <img src={m.image} className="mt-2 rounded-xl border border-black/20 max-w-full" alt="Shared attachment" />
                                                                    )}
                                                                </div>
                                                                <p className={`text-[8px] font-black uppercase tracking-widest text-zinc-600 ${isMe ? "text-right mr-2" : "text-left ml-2"}`}>
                                                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div ref={chatEndRef} />
                                            </div>

                                            {/* Input Area */}
                                            <div className="p-6 bg-black/40 border-t border-white/5 space-y-4">
                                                {chatImage && (
                                                    <div className="relative inline-block">
                                                        <img src={chatImage} className="w-20 h-20 object-cover rounded-xl border-2 border-brand-gold" />
                                                        <button onClick={() => setChatImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 border-2 border-black">
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <label className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all shrink-0">
                                                        <Paperclip className="text-zinc-500" size={20} />
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="TYPE SECURE MESSAGE..."
                                                        className="flex-1 bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-brand-gold/40"
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                                                    />
                                                    <button
                                                        onClick={handleSendChat}
                                                        className="w-14 h-14 rounded-2xl bg-brand-gold text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-brand-gold/10 shrink-0"
                                                    >
                                                        <Send size={24} />
                                                    </button>
                                                    <ActionButton
                                                        href="/dashboard/subscription"
                                                        icon={<Radio size={22} />}
                                                        label="Get Signals"
                                                        color="purple"
                                                    />                            </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "SUBS" && (
                            <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="text-center space-y-3">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">VIP Signal <span className="text-brand-gold">Subscriptions</span></h3>
                                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed italic">Monitor all institutional alpha access plans across active traders.</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {users.filter((u: any) => u.subscription && u.subscription !== 'none').map((u: any) => (
                                        <div key={u._id} className="glass p-8 rounded-[40px] border-white/5 space-y-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-3xl rounded-full" />
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                                                    <TrendingUp size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-white">{u.name}</p>
                                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{u.email}</p>
                                                </div>
                                            </div>

                                            <div className="p-5 rounded-3xl bg-black/40 border border-white/5 space-y-3">
                                                <div className="flex justify-between items-center text-[9px] uppercase font-black">
                                                    <span className="text-zinc-500 tracking-widest">ACTIVE TIER</span>
                                                    <span className="text-brand-gold italic">{u.subscription}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[9px] uppercase font-black">
                                                    <span className="text-zinc-500 tracking-widest">PORTFOLIO</span>
                                                    <span className="text-white italic">{u.currency} {u.balance.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => { setChatTarget(u); setActiveTab("CHATS"); }} className="flex-1 py-3 bg-white/5 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/5">Signal Support</button>
                                                <button onClick={() => setSelectedUserForMsg(u)} className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 italic">Email Signals</button>
                                            </div>
                                        </div>
                                    ))}
                                    {users.filter((u: any) => u.subscription && u.subscription !== 'none').length === 0 && (
                                        <div className="col-span-full py-20 text-center glass rounded-[40px] border-white/5">
                                            <TrendingUp className="mx-auto text-zinc-800 mb-4" size={40} />
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">No active VIP subscriptions detected in the ledger.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "SETTINGS" && (
                            <motion.div key="set" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto space-y-8">
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">System <span className="text-brand-gold">Parameters</span></h3>
                                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed">Global configuration node for gateways <br />and institutional touchpoints.</p>
                                </div>
                                <div className="space-y-6">
                                    {localSettings.map((s: any) => (
                                        <div key={s.key} className="glass p-10 rounded-[48px] border-white/5 space-y-6 hover:shadow-2xl transition-all">
                                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-brand-gold">
                                                    <SettingsIcon size={18} />
                                                </div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">{s.key.replace(/_/g, ' ')}</p>
                                            </div>
                                            <div className="relative group/input">
                                                <textarea
                                                    rows={1}
                                                    className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-xs font-bold font-mono text-zinc-100 focus:outline-none focus:border-brand-gold/40 transition-all pr-24 no-scrollbar resize-none"
                                                    value={s.value}
                                                    onChange={(e) => {
                                                        const next = localSettings.map((item: any) => item.key === s.key ? { ...item, value: e.target.value } : item);
                                                        setLocalSettings(next);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleUpdateSetting(s.key, s.value)}
                                                    className="absolute right-3 top-3 bottom-3 px-5 bg-brand-gold text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-gold/10"
                                                >
                                                    COMMIT
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-zinc-700 font-bold uppercase italic tracking-widest">{s.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#070a0f]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-5 flex justify-around items-center rounded-t-[36px] shadow-[0_-20px_50px_rgba(0,0,0,0.4)]">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === tab.id ? "text-brand-gold -translate-y-2" : "text-zinc-700"
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                        {activeTab === tab.id && <motion.div layoutId="nav-glow" className="h-1 w-6 bg-brand-gold rounded-full shadow-[0_0_15px_#d4af37]" />}
                    </button>
                ))}
            </nav>

            {/* Modal: Add Money */}
            <AnimatePresence>
                {selectedUserForMoney && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="glass w-full max-w-md p-10 rounded-[50px] border-white/10 relative shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                            <button onClick={() => setSelectedUserForMoney(null)} className="absolute right-8 top-8 text-zinc-500 hover:text-white transition-colors">
                                <X size={28} />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-8">
                                <div className="w-24 h-24 rounded-[32px] bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                                    <DollarSign className="text-brand-gold" size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Adjust Portfolio</h3>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] leading-relaxed">Direct balance credit for <br /><span className="text-brand-gold font-black">{selectedUserForMoney.name}</span></p>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="00.00"
                                            autoFocus
                                            value={addMoneyAmt}
                                            onChange={(e) => setAddMoneyAmt(e.target.value)}
                                            className="w-full bg-black/50 border-2 border-white/5 rounded-3xl py-7 px-8 text-4xl font-black text-center text-white focus:outline-none focus:border-brand-gold transition-all italic tracking-tighter shadow-inner"
                                        />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 font-black text-2xl italic pointer-events-none">$</div>
                                    </div>
                                    <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em]">Currency denominated in {selectedUserForMoney.currency || 'USD'}</p>
                                </div>

                                <button
                                    onClick={handleAddMoneySubmit}
                                    className="w-full py-6 bg-brand-gold text-black rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:scale-[1.03] active:scale-95 transition-all"
                                >
                                    Confirm Inject
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal: Custom Message */}
            <AnimatePresence>
                {selectedUserForMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="glass w-full max-w-2xl p-8 md:p-12 rounded-[50px] border-white/10 relative overflow-y-auto max-h-[90vh] no-scrollbar shadow-[0_0_100px_rgba(59,130,246,0.1)]">
                            <button onClick={() => setSelectedUserForMsg(null)} className="absolute right-8 top-8 text-zinc-500 hover:text-white">
                                <X size={28} />
                            </button>

                            <div className="space-y-10">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <Mail className="text-blue-500" size={30} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Direct User Alert</h3>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Recipient: <span className="text-white">{selectedUserForMsg.email}</span></p>
                                    </div>
                                </div>

                                {/* Templates Selector */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2 italic">Select Institutional Template</p>
                                    <div className="flex flex-wrap gap-2">
                                        {TEMPLATES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => applyTemplate(t)}
                                                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all"
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Email Subject</label>
                                        <input
                                            value={msgSubject}
                                            onChange={(e) => setMsgSubject(e.target.value)}
                                            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-blue-500/40 transition-all shadow-inner"
                                            placeholder="Enter subject line..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Message Header Title</label>
                                        <input
                                            value={msgTitle}
                                            onChange={(e) => setMsgTitle(e.target.value)}
                                            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-blue-500/40 transition-all shadow-inner"
                                            placeholder="Main attention title..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Detailed Message Body</label>
                                        <textarea
                                            rows={6}
                                            value={msgBody}
                                            onChange={(e) => setMsgBody(e.target.value)}
                                            className="w-full bg-black/40 border-2 border-white/5 rounded-[24px] py-5 px-6 text-xs font-bold text-white leading-relaxed focus:outline-none focus:border-blue-500/40 transition-all shadow-inner no-scrollbar"
                                            placeholder="Compose document body..."
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSendingMsg}
                                    onClick={handleSendMessage}
                                    className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_50px_rgba(37,99,235,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isSendingMsg ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                                    {isSendingMsg ? "TRANSMITTING..." : "DISPATCH ALERT"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DashCard({ label, value, color, desc }: { label: string, value: string | number, color: string, desc: string }) {
    const colorMap: any = {
        gold: "from-brand-gold/10 text-brand-gold border-brand-gold/20 shadow-brand-gold/5",
        blue: "from-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5",
        green: "from-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5"
    }

    return (
        <div className={`glass p-8 rounded-[48px] border-white/5 bg-gradient-to-br ${colorMap[color]} shadow-2xl space-y-4 group`}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 leading-none">{label}</p>
            <p className="text-4xl font-black tracking-tighter italic leading-none">{value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 border-t border-white/5 pt-4">{desc}</p>
        </div>
    );
}

function ActionButton({ href, icon, label, color }: { href: string; icon: ReactNode; label: string; color: string }) {
    const colorMap: Record<string, string> = {
        green: "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30",
        red: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30",
        gold: "bg-brand-gold hover:brightness-110 text-black shadow-lg shadow-brand-gold/30",
        purple: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30",
    };

    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${colorMap[color]}`}
        >
            {icon}
            <span className="text-xs font-black uppercase tracking-[0.15em]">{label}</span>
        </Link>
    );
}

