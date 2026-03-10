import { useEffect, useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
}

export default function NotificationBell({ fetchUrl }: { fetchUrl: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
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
                    const data: Notification[] = await res.json();
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
        <div className="relative inline-block">
            <Link href="#" className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white">
                        {unreadCount}
                    </span>
                )}
            </Link>
            {/* Simple dropdown preview */}
            <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-20">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <h3 className="text-sm font-black uppercase text-zinc-200">Notifications</h3>
                    {loading && <RefreshCw className="animate-spin text-zinc-400" size={16} />}
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-zinc-500 text-center">No new notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-3 border-b border-white/5 last:border-0">
                                <p className="text-xs font-black text-zinc-200">{n.title}</p>
                                <p className="text-[10px] text-zinc-400 mt-1">{n.message}</p>
                                <p className="text-[9px] text-zinc-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
