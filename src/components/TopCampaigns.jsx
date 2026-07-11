"use client";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function TopCampaigns({ campaigns }) {
    return (
        <section id="explore" className="py-20 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${poppins.className}`}>Top Funded Campaigns</h2>
                    <p className={`mt-3 text-gray-500 max-w-lg mx-auto ${inter.className}`}>Discover the most successful campaigns on FundSpark</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.length === 0 && Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-[24px] overflow-hidden shadow-sm animate-pulse">
                            <div className="h-48 bg-gray-200" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-2 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                    ))}
                    {campaigns.map((c) => (
                        <Link key={c._id} href={`/campaigns/${c._id}`} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="h-48 bg-gray-100 overflow-hidden">
                                {c.image ? (
                                    <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-[#4F46E5] text-xs font-medium rounded-full mb-3">{c.category || "General"}</span>
                                <h3 className={`text-lg font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors ${poppins.className}`}>{c.title}</h3>
                                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>by {c.creatorName || "Anonymous"}</p>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className={`font-medium text-gray-900 ${inter.className}`}>{c.raisedAmount || 0} credits</span>
                                        <span className={`text-gray-500 ${inter.className}`}>goal: {c.fundingGoal || 0}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((c.raisedAmount || 0) / (c.fundingGoal || 1)) * 100)}%` }} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`text-xs text-gray-400 ${inter.className}`}>
                                        {c.deadline ? `${Math.max(0, Math.ceil((new Date(c.deadline) - new Date()) / (1000 * 60 * 60 * 24)))} days left` : "No deadline"}
                                    </span>
                                    <span className="text-sm font-medium text-[#4F46E5] group-hover:translate-x-1 transition-transform">View Details →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
