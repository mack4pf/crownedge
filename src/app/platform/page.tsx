import { Metadata } from "next";
import PlatformContent from "./PlatformContent";

export const metadata: Metadata = {
    title: "Trading Platform | AI-Powered Execution Hub",
    description: "Experience the CrownEdge legacy. Our proprietary AI engine scans 5,000+ data points per second to deliver surgical execution for elite traders globally.",
    keywords: ["trading platform", "AI trading engine", "institutional execution", "automated trading", "professional trading hub"],
    alternates: {
        canonical: "https://crownedgebroker.pro/platform",
    },
};

export default function PlatformPage() {
    return <PlatformContent />;
}
