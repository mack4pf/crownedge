import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { frontImage, backImage, selfieImage } = await req.json();

        if (!frontImage || !backImage || !selfieImage) {
            return NextResponse.json({ error: 'All 3 documents are required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById((session.user as any).id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.kycFront = frontImage;
        user.kycBack = backImage;
        user.kycSelfie = selfieImage;
        user.verificationStatus = 'pending';

        await user.save();

        return NextResponse.json({ message: 'KYC documents submitted successfully. Status is now pending.' });
    } catch (error: any) {
        console.error('KYC Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Error saving documents' }, { status: 500 });
    }
}
