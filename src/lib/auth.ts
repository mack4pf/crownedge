import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await dbConnect();
                } catch (dbErr: any) {
                    console.error("NextAuth authorize: Database connection failed:", dbErr.message);
                    throw new Error("Secure trading servers are currently unavailable. Please try again later.");
                }

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const email = credentials.email.toLowerCase().trim();
                const user = await User.findOne({ email }).select("+password");

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    balance: user.balance,
                    currency: user.currency,
                    country: user.country,
                    isVerified: user.isVerified,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.balance = (user as any).balance;
                token.currency = (user as any).currency;
                token.country = (user as any).country;
                token.isVerified = (user as any).isVerified;
            }

            // Handle updating session manually (e.g. after email verification)
            if (trigger === "update" && session) {
                if (session.isVerified !== undefined) {
                    token.isVerified = session.isVerified;
                }
                if (session.user) {
                    return { ...token, ...session.user };
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).balance = token.balance;
                (session.user as any).currency = token.currency;
                (session.user as any).country = token.country;
                (session.user as any).isVerified = token.isVerified;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
