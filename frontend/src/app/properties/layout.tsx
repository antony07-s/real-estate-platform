import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Find Properties",
  description:
    "Browse verified apartments, houses, villas and plots across India. Search properties by city, type, budget and bedrooms.",
  alternates: {
    canonical: `${SITE_URL}/properties`,
  },
  openGraph: {
    title: "Find Properties",
    description:
      "Browse verified apartments, houses, villas and plots across India.",
    url: `${SITE_URL}/properties`,
    siteName: "RealEstate Platform",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Find Properties",
    description:
      "Browse verified apartments, houses, villas and plots across India.",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
