import { Metadata } from "next";
import RegisterContent from "./RegisterContent";

export const metadata: Metadata = {
    title: "Apply for Access | Institutional Trading Registration",
    description: "Join the elite group of traders at CrownEdge Broker. Apply for your institutional account today and gain access to AI-powered trading.",
    keywords: ["register trading account", "institutional trader application", "crownedge signup"],
    alternates: {
        canonical: "https://crownedgebroker.pro/register",
    },
};

export default function RegisterPage() {
    return <RegisterContent />;
}
