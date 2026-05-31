import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MessageCircle, Send } from 'lucide-react';

const buildTelegramLink = (contact: string) => {
    const trimmed = contact.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://t.me/${trimmed.replace(/^@/, '')}`;
};

const buildWhatsAppLink = (number: string, email?: string | null) => {
    const cleanNumber = number.replace(/\D/g, '');
    const text = encodeURIComponent(`Hello, I am ${email || 'a CrownEdge Broker client'}, and I need assistance with my CrownEdge Broker account.`);
    return `https://wa.me/${cleanNumber}?text=${text}`;
};

export default async function SupportRedirectPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();
    const settings = await Setting.find({ key: { $in: ['telegram_contact', 'whatsapp_number'] } }).lean();
    const telegram = settings.find((setting) => setting.key === 'telegram_contact')?.value || 'crownedgebroker';
    const whatsapp = settings.find((setting) => setting.key === 'whatsapp_number')?.value || '+1234567890';

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md glass border-white/10 rounded-[32px] p-8 space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Support Channel</h1>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        Choose how you want to contact your account manager.
                    </p>
                </div>

                <div className="grid gap-3">
                    <a
                        href={buildTelegramLink(telegram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl bg-sky-500 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="flex items-center gap-3"><Send size={18} /> Telegram</span>
                        <span className="text-[10px] opacity-80">First Option</span>
                    </a>

                    <a
                        href={buildWhatsAppLink(whatsapp, session.user?.email)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl bg-green-500 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="flex items-center gap-3"><MessageCircle size={18} /> WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
