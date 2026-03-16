import { Metadata } from "next";
import ForgotPasswordContent from "./ForgotPasswordContent";

export const metadata: Metadata = {
    title: "Forgot Password | Institutional Account Recovery",
    description: "Recover access to your CrownEdge Broker account. Enter your institutional email to receive a secure password reset link.",
    keywords: ["forgot password", "account recovery", "trading login help"],
    alternates: {
        canonical: "https://crownedgebroker.pro/forgot-password",
    },
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordContent />;
}
