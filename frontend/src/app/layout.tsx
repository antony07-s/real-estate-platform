import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RealEstate Platform - Find Your Dream Home",
    template: "%s | RealEstate Platform",
  },
  description:
    "Find, buy, sell and rent properties across India. Browse thousands of verified listings.",
  keywords: [
    "real estate",
    "property",
    "buy home",
    "rent",
    "apartment",
    "villa",
  ],
  openGraph: {
    title: "RealEstate Platform",
    description: "Find your dream home",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
