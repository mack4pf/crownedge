import { Metadata } from "next";
import CompanyContent from "./CompanyContent";

export const metadata: Metadata = {
    title: "About Us | CrownEdge Broker Institutional Standard",
    description: "Learn about CrownEdge Broker, a leading global investment platform established in 2014. Discover our mission, core values, and a decade of growth in financial markets.",
    keywords: ["about crownedge", "crownedge history", "institutional investment platform", "regulated broker", "trading infrastructure"],
    alternates: {
        canonical: "https://crownedgebroker.pro/company",
    },
};

export default function CompanyPage() {
    return <CompanyContent />;
}
