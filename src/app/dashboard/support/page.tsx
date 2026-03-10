import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function SupportRedirectPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();
    const whatsappSetting = await Setting.findOne({ key: 'whatsapp_number' });
    const number = whatsappSetting?.value || "+1234567890";

    // Clean number (remove '+' or spaces) to create a standard WA link
    const cleanNumber = number.replace(/[^4-9A-Za-z0-9]/g, '');

    const waLink = `https://wa.me/${cleanNumber}?text=Hello,%20I%20am%20${session.user?.email},%20and%20I%20need%20assistance%20with%20my%20CrownEdge%20Broker%20account.`;

    redirect(waLink);

    return null;
}
