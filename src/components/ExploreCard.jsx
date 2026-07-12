"use client";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const categoryColors = {
    Technology: { bg: "bg-indigo-50", text: "text-indigo-600" },
    Health: { bg: "bg-emerald-50", text: "text-emerald-600" },
    Community: { bg: "bg-sky-50", text: "text-sky-600" },
    Education: { bg: "bg-purple-50", text: "text-purple-600" },
    Art: { bg: "bg-amber-50", text: "text-amber-600" },
    Environment: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

export default function ExploreCard({ campaign }) {
    const now = new Date();
    const deadline = campaign.deadline ? new Date(campaign.deadline) : null;
    const expired = deadline && deadline < now;
    const daysLeft = deadline
        ? Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)))
        : null;
    const progress = Math.min(100, ((campaign.raisedAmount || 0) / (campaign.fundingGoal || 1)) * 100);
    const colors = categoryColors[campaign.category] || { bg: "bg-gray-50", text: "text-gray-600" };

    return (
        <Link href={`/explore/${campaign._id}`} className="group block bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/50">
            {/* Image */}
            <div className="relative h-52 bg-gray-100 overflow-hidden">
                {campaign.image ? (
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {/* Category badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full shadow-sm`}>
                    {campaign.category || "General"}
                </span>
                {expired ? (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-sm">Expired</span>
                ) : daysLeft !== null && daysLeft <= 7 && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        {daysLeft === 0 ? "Ending" : `${daysLeft}d left`}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className={`text-base font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors leading-snug ${poppins.className}`}>
                    {campaign.title}
                </h3>
                <p className={`text-sm text-gray-500 mt-1.5 ${inter.className}`}>
                    by {campaign.creatorName || "Anonymous"}
                </p>

                {/* Progress */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-semibold text-gray-900 ${inter.className}`}>{campaign.raisedAmount || 0} credits</span>
                        <span className={`text-xs text-gray-400 ${inter.className}`}>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs text-gray-400 ${inter.className}`}>Goal: {campaign.fundingGoal || 0} credits</span>
                        {daysLeft !== null && (
                            <span className={`text-xs text-gray-400 ${inter.className}`}>
                                {daysLeft > 7 ? `${daysLeft} days left` : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[9px] font-bold">
                            {(campaign.creatorName?.[0] || "C").toUpperCase()}
                        </div>
                        <span className={`text-xs text-gray-500 ${inter.className}`}>{campaign.creatorName?.split(" ")[0] || "Creator"}</span>
                    </div>
                    <span className="text-xs font-medium text-[#4F46E5] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function ExploreCardSkeleton() {
    return (
        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100/50 animate-pulse">
            <div className="h-52 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-2.5 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
        </div>
    );
}
