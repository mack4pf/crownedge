"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingSupport() {
    const pathname = usePathname();
    const whatsappNumber = "1234567890"; // User can change this easily
    const message = "Hello CrownEdge Support, I need assistance with my account.";

    if (pathname?.startsWith('/admin')) return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-8 right-8 z-[100]"
        >
            <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group block"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />

                {/* Tooltip */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Contact Support
                </div>

                {/* Button */}
                <div className="relative w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-green-500/30 hover:scale-110 active:scale-90 transition-all">
                    <MessageCircle size={32} fill="currentColor" />
                </div>
            </a>
        </motion.div>
    );
}
