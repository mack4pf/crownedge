import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Reset your password | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password for your institutional trading account. If you didn't make this request, you can safely ignore this email.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">Reset Password</a>
                    </div>
                    <p style="font-size: 12px; color: #555; text-align: center;">This link will expire in 1 hour.</p>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 CrownEdge Broker. Institutional-Grade Trading. Secure & Encrypted.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset email');
    }
};

export const sendVerificationEmail = async (email: string, code: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Verify your account | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #d4af3720;">
                    <h1 style="color: #d4af37; text-align: center; font-size: 28px; margin-bottom: 30px;">Security Verification</h1>
                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">To finalize your institutional trading account, please enter the following 6-digit verification code:</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="display: inline-block; background-color: #d4af37; color: black; padding: 20px 40px; border-radius: 15px; font-weight: 900; font-size: 32px; letter-spacing: 12px; font-family: monospace;">
                            ${code}
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
                        This code will expire in 10 minutes. <br />
                        If you did not request this code, please secure your account immediately.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #555; text-align: center;">&copy; 2026 CrownEdge Broker. Institutional-Grade Trading. Secure & Encrypted.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Welcome to CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <p style="font-size: 16px; line-height: 1.6;">Welcome, <strong>${name}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Your institutional trading account is now active. You have been granted access to the elite trading floor.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">Access Dashboard</a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 CrownEdge Broker. Institutional-Grade Trading. Secure & Encrypted.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

export const sendDepositPendingEmail = async (email: string, amount: string | number, method: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Deposit Received - Pending Verification | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #d4af3720;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <h3 style="text-align: center; color: #ffd700;">Deposit Receipt Received</h3>
                    <p style="font-size: 16px; line-height: 1.6;">We have received your proof of payment for the amount of <strong>${amount}</strong> via <strong>${method}</strong>.</p>
                    <p style="font-size: 16px; line-height: 1.6;">Our compliance team is currently verifying the transaction. Your funds will be credited to your balance once confirmed.</p>
                    <div style="text-align: center; margin: 30px 0; background: #0a0d14; padding: 20px; border-radius: 10px; border: 1px solid #ffffff10;">
                        <p style="margin: 0; font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 2px;">Status</p>
                        <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #d4af37;">PENDING VERIFICATION</p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #555; text-align: center;">&copy; 2026 CrownEdge Broker.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending deposit pending email:', error);
    }
};

export const sendDepositApprovedEmail = async (email: string, amount: string | number) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Deposit Approved! Funds Credited | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #00ff0020;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <h3 style="text-align: center; color: #00ff00;">Success! Deposit Confirmed</h3>
                    <p style="font-size: 16px; line-height: 1.6;">Your deposit of <strong>${amount}</strong> has been successfully verified and credited to your trading balance.</p>
                    <p style="font-size: 16px; line-height: 1.6;">You can now start placing trades or subscribing to VIP signals.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #00ff00; color: black; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">Go to Trading Terminal</a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #555; text-align: center;">&copy; 2026 CrownEdge Broker.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending deposit approved email:', error);
    }
};

export const sendBalanceAddedEmail = async (email: string, amount: string | number, currency: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <auth@crownedgebroker.pro>',
            to: email,
            subject: 'Account Credited | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #d4af3720;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">Hello,</p>
                    <p style="font-size: 18px; line-height: 1.6; text-align: center;">Your trading account has been credited with <strong>${amount} ${currency}</strong> via direct deposit. You can start trading now!</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #d4af37; color: black; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase;">Open Trading Terminal</a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #555; text-align: center;">&copy; 2026 CrownEdge Broker.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending balance added email:', error);
    }
};

export const sendCustomTemplateEmail = async (email: string, subject: string, title: string, body: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <support@crownedgebroker.pro>',
            to: email,
            subject: `${subject} | CrownEdge Broker`,
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; border: 1px solid #d4af3730;">
                    <h1 style="color: #d4af37; text-align: center; margin-bottom: 20px;">CrownEdge Broker</h1>
                    <div style="background: #0a0d14; padding: 30px; border-radius: 15px; border: 1px solid #ffffff05;">
                        <h2 style="color: #fff; font-size: 20px; margin-top: 0;">${title}</h2>
                        <p style="font-size: 16px; line-height: 1.8; color: #ccc;">${body}</p>
                    </div>
                    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
                        If you have any questions, please contact your account manager via WhatsApp.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 11px; color: #444; text-align: center; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 CrownEdge Broker | Institutional Grade Security</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending custom template email:', error);
    }
};

export const sendChatPendingEmail = async (email: string) => {
    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'CrownEdge Broker <support@crownedgebroker.pro>',
            to: email,
            subject: 'New Unread Message from Account Manager | CrownEdge Broker',
            html: `
                <div style="font-family: sans-serif; background-color: #05070a; color: white; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; border: 1px solid #d4af3730;">
                    <h1 style="color: #d4af37; text-align: center;">CrownEdge Broker</h1>
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 80px; height: 80px; background: #d4af37; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                            <span style="font-size: 40px;">💬</span>
                        </div>
                        <h2 style="color: #fff; font-size: 24px;">You have a pending message!</h2>
                    </div>
                    <p style="font-size: 16px; line-height: 1.8; color: #ccc; text-align: center;">
                        To make more profit and secure your account, please login and contact your account manager immediately. 
                        A message is waiting for your response in the institutional trading floor.
                    </p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #d4af37; color: black; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 2px;">Login & Reply Now</a>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
                    <p style="font-size: 11px; color: #444; text-align: center; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 CrownEdge Broker | Institutional Grade Trading</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending chat pending email:', error);
    }
};
