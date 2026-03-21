import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        await dbConnect();
        let { name, email, password, country, currency } = await req.json();
        email = email.toLowerCase().trim();

        // 1. Validation
        if (!name || !email || !password || !country || !currency) {
            return NextResponse.json({ error: 'All institutional fields are required' }, { status: 400 });
        }

        // 2. Check existence
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Account with this email already exists' }, { status: 400 });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Generate 6-digit Verification Code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 5. Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            country,
            currency,
            balance: 0,
            isVerified: false,
            verificationCode,
            verificationCodeExpiry
        });

        // 6. Send Verification Email
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email.',
            userId: user._id
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
