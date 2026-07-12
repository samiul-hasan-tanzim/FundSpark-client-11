import Link from "next/link";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20">
                    <span className="text-4xl font-bold text-white">404</span>
                </div>
                <h1 className={`text-3xl font-bold text-gray-900 mb-3 ${poppins.className}`}>Page Not Found</h1>
                <p className={`text-gray-500 mb-8 leading-relaxed ${inter.className}`}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
