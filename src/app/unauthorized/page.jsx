"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function UnauthorizedPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(t);
        } else {
            router.push("/");
        }
    }, [countdown, router]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/20">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
                    </svg>
                </div>
                <h1 className={`text-3xl font-bold text-gray-900 mb-3 ${poppins.className}`}>Access Denied</h1>
                <p className={`text-gray-500 mb-2 leading-relaxed ${inter.className}`}>
                    You don&apos;t have permission to access this page.
                </p>
                <p className={`text-sm text-gray-400 mb-8 ${inter.className}`}>
                    Redirecting to home in {countdown} seconds...
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Home
                    </Link>
                    {session && (
                        <Link
                            href={session.user.role === "creator" ? "/dashboard/creator" : session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/supporter"}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            My Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
