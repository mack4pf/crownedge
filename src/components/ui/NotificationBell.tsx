import { useEffect, useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface AppNotification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationBell({ fetchUrl }: { fetchUrl: string }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Request browser notification permission on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await fetch(fetchUrl);
                if (res.ok) {
                    const data: AppNotification[] = await res.json();
                    setNotifications(data);
                    setUnreadCount(data.filter((n) => !n.read).length);
                    // Show native push for each new notification
                    data.forEach((n) => {
                        if (Notification.permission === 'granted') {
                            new Notification(n.title, { body: n.message });
                        }
                    });
                }
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            }
            setLoading(false);
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchUrl]);

    return (
        <div className="relative inline-block z-50">
            <button
                onClick={() => setNotifications(prev => [...prev])} // Just to trigger a re-render if needed or open
                className="flex items-center gap-1 text-zinc-400 hover:text-brand-gold transition-all relative group"
            >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:border-brand-gold/30 transition-all">
                    <Bell size={20} />
                </div>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white ring-2 ring-[#05070a] animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown - absolute positioned with high z-index and max-height */}
            <div className="absolute right-0 mt-3 w-80 bg-[#0a0d14]/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right scale-95 group-hover:scale-100 ring-1 ring-white/5">
                <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/[0.02] rounded-t-[24px]">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200">Institutional Alerts</h3>
                    </div>
                    {loading && <RefreshCw className="animate-spin text-brand-gold" size={14} />}
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                <Bell size={20} className="text-zinc-700" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No new alerts</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className={`p-4 hover:bg-white/[0.03] transition-colors relative ${!n.read ? 'bg-brand-gold/[0.02]' : ''}`}>
                                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />}
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-[11px] font-black uppercase tracking-tight ${!n.read ? 'text-white' : 'text-zinc-400'}`}>{n.title}</p>
                                    <span className="text-[8px] font-medium text-zinc-600 tabular-nums whitespace-nowrap ml-2">
                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-[10px] leading-relaxed text-zinc-500 font-medium">{n.message}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 bg-white/[0.02] border-t border-white/5 rounded-b-[24px]">
                    <Link href="/dashboard/history" className="block text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-brand-gold transition-colors">
                        View Full History Ledger
                    </Link>
                </div>
            </div>
        </div>
    );
}
