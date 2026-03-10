import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Setting from '@/models/Setting';

export async function GET() {
    try {
        await dbConnect();

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('Mack4pf$$', 10);

        let admin = await User.findOne({ email: 'admintrader@crownedgebroker.pro' });
        if (!admin) {
            admin = await User.create({
                name: 'System Admin',
                email: 'admintrader@crownedgebroker.pro',
                password: hashedPassword,
                country: 'US',
                isVerified: true,
                role: 'admin',
                balance: 0,
                status: 'active'
            });
        } else {
            // Update existing user to ensure admin role and password match
            admin.password = hashedPassword;
            admin.role = 'admin';
            admin.isVerified = true;
            await admin.save();
        }

        // Ensure default settings exist
        const DEFAULTS = [
            { key: 'whatsapp_number', value: '+1234567890', description: 'WhatsApp contact number' },
            { key: 'payment_btc', value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', description: 'Bitcoin Address' },
            { key: 'payment_eth', value: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', description: 'Ethereum Address' },
            { key: 'payment_usdt', value: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKzPGEW2', description: 'USDT TRC20 Address' },
            { key: 'payment_bank', value: 'Bank Name: Chase\nAcct: 123456789', description: 'Bank Details' },
            { key: 'payment_pix', value: 'pix@crownedgebroker.pro', description: 'Pix Key' },
        ];

        for (const def of DEFAULTS) {
            await Setting.findOneAndUpdate({ key: def.key }, { $setOnInsert: def }, { upsert: true });
        }

        return NextResponse.json({ success: true, message: 'Seeded admin and settings successfully' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
