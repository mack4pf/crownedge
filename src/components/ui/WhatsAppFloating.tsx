"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFloating() {
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
                <motion.a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100] group"
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-all animate-pulse" />
                        <div className="relative bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20">
                            <MessageCircle size={28} />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#0a0d14]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Live Institutional Support</p>
                        </div>
                    </div>
                </motion.a>
            )}
        </AnimatePresence>
    );
}
