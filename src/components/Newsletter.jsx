"use client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Newsletter() {
    return (
        <section className="py-20 bg-[#F8FAFC]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${poppins.className}`}>Stay Updated</h2>
                <p className={`text-gray-500 mb-8 ${inter.className}`}>Get the latest campaigns and platform updates delivered to your inbox.</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" className={`flex-1 px-5 py-3.5 rounded-full border border-gray-200 bg-white outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all ${inter.className}`} />
                    <button type="submit" className={`px-8 py-3.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${inter.className}`}>
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
}
