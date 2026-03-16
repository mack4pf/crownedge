import { Metadata } from "next";
import CryptoContent from "./CryptoContent";

export const metadata: Metadata = {
    title: "Crypto Trading | Institutional Bitcoin & Altcoin Investment",
    description: "Trade Bitcoin, Ethereum, and other high-growth digital assets with CrownEdge Broker's institutional-grade AI trading platform. 0.01ms latency and deep liquidity.",
    keywords: ["crypto trading", "bitcoin", "ethereum", "institutional crypto", "AI trading", "crypto broker"],
    alternates: {
        canonical: "https://crownedgebroker.pro/crypto",
    },
};

export default function CryptoPage() {
    return <CryptoContent />;
}
