import { Metadata } from "next";
import ForexContent from "./ForexContent";

export const metadata: Metadata = {
    title: "Forex Trading | Institutional Currency Exchange (FX)",
    description: "Access the $6.6 Trillion a day Forex market with CrownEdge Broker. 0.0 pips, Tier-1 liquidity, and AI-optimized hedging for serious currency traders.",
    keywords: ["forex trading", "fx market", "currency exchange", "institutional forex", "AI forex trading", "low spread forex"],
    alternates: {
        canonical: "https://crownedgebroker.pro/forex",
    },
};

export default function ForexPage() {
    return <ForexContent />;
}
