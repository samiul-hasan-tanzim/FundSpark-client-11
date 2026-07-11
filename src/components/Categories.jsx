"use client";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";
import { categories } from "@/lib/homeData";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Categories() {
    return (
        <section id="categories" className="py-20 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${poppins.className}`}>Explore by Category</h2>
                    <p className={`mt-3 text-gray-500 max-w-lg mx-auto ${inter.className}`}>Find campaigns that match your interests</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link key={cat.name} href={`/campaigns?category=${cat.name.toLowerCase()}`}
                            className="group bg-white rounded-[24px] p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 mx-auto rounded-[18px] flex items-center justify-center mb-3 transition-all duration-300"
                                style={{ backgroundColor: `${cat.color}15` }}
                            >
                                <svg className="w-6 h-6 transition-colors" fill="none" stroke={cat.color} viewBox="0 0 24 24" style={{ stroke: cat.color }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                                </svg>
                            </div>
                            <h3 className={`text-sm font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors ${poppins.className}`}>{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
