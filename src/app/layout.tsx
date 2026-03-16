import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import FloatingSupport from "@/components/ui/FloatingSupport";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://crownedgebroker.pro"),
  title: {
    default: "CrownEdge Broker | Institutional-Grade Trading Platform",
    template: "%s | CrownEdge Broker"
  },
  description: "Experience the ultimate trading edge with CrownEdge Broker. Secure, fast, and professional trading for serious investors. Access global markets with institutional-grade technology, including Forex, Crypto, and Binary Options.",
  keywords: ["trading", "broker", "institutional trading", "forex", "crypto", "binary options", "crownedge", "crownedge broker", "AI trading", "secure broker"],
  authors: [{ name: "CrownEdge Team" }],
  creator: "CrownEdge Broker",
  publisher: "CrownEdge Broker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://crownedgebroker.pro",
  },
  openGraph: {
    title: "CrownEdge Broker | Institutional-Grade Trading Platform",
    description: "Experience the ultimate trading edge with CrownEdge Broker. Secure, fast, and professional trading for serious investors.",
    url: "https://crownedgebroker.pro",
    siteName: "CrownEdge Broker",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/trading-team.png",
        width: 1200,
        height: 630,
        alt: "CrownEdge Broker Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrownEdge Broker | Institutional-Grade Trading Platform",
    description: "Experience the ultimate trading edge with CrownEdge Broker. Secure, fast, and professional trading for serious investors.",
    images: ["/trading-team.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "CrownEdge Broker",
    "url": "https://crownedgebroker.pro",
    "logo": "https://crownedgebroker.pro/favicon.ico",
    "description": "Institutional-grade trading platform offering forex, crypto, and binary options trading with AI-powered execution.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "UK"
    },
    "sameAs": [
      "https://twitter.com/crownedgebroker",
      "https://facebook.com/crownedgebroker"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <FloatingSupport />
        </AuthProvider>
      </body>
    </html>
  );
}
