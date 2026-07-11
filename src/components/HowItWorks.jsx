"use client";
import { Poppins, Inter } from "next/font/google";
import { howItWorks } from "@/lib/homeData";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${poppins.className}`}>How It Works</h2>
                    <p className={`mt-3 text-gray-500 max-w-lg mx-auto ${inter.className}`}>Get started in three simple steps</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {howItWorks.map((step, i) => (
                        <div key={i} className="group relative bg-[#F8FAFC] rounded-[24px] p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {i + 1}
                            </div>
                            <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-[20px] flex items-center justify-center mb-5 group-hover:bg-[#4F46E5] group-hover:text-white transition-all duration-300">
                                <svg className="w-7 h-7 text-[#4F46E5] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                                </svg>
                            </div>
                            <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${poppins.className}`}>{step.title}</h3>
                            <p className={`text-sm text-gray-500 leading-relaxed ${inter.className}`}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
