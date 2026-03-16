import { Metadata } from "next";
import MarketsContent from "./MarketsContent";

export const metadata: Metadata = {
    title: "Market Screener | Real-Time Crypto & Forex Data",
    description: "Monitor global markets in real-time with CrownEdge Broker's advanced screener. Get live prices, technical analysis, and institutional news for Crypto and Forex.",
    keywords: ["market screener", "live crypto prices", "forex data", "market analysis", "real-time trading data"],
    alternates: {
        canonical: "https://crownedgebroker.pro/markets",
    },
};

export default function MarketsPage() {
    return <MarketsContent />;
}
