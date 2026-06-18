import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <h1 className="text-8xl font-bold text-blue-600 mb-2"></h1>

                {/* Icon */}
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home size={36} className="text-blue-500" />
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <Link
                        href="/properties"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                        <Search size={16} />
                        Browse Properties
                    </Link>
                </div>
            </div>
        </div>
    );
}
