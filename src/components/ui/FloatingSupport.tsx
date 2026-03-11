"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingSupport() {
    const pathname = usePathname();
    const [whatsapp, setWhatsapp] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Don't show on chat page
    const isChatPage = pathname?.includes("/dashboard/chats") || pathname?.includes("/admin");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings/public");
                const data = await res.json();
                if (data.whatsapp) setWhatsapp(data.whatsapp);
            } catch (err) {
                console.error("Failed to fetch WhatsApp setting:", err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        // Delay visibility slightly
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isChatPage || !whatsapp) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100]"
                >
                    <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group block"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Live Institutional Support
                        </div>

                        {/* Button */}
                        <div className="relative w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-green-500/30 hover:scale-110 active:scale-90 transition-all border-2 border-white/20">
                            <MessageCircle size={32} />
                        </div>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
