"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

const categoryBadge = {
    Technology: "bg-indigo-700/90 text-white",
    Health: "bg-emerald-700/90 text-white",
    Community: "bg-sky-700/90 text-white",
    Education: "bg-purple-700/90 text-white",
    Art: "bg-pink-600/90 text-white",
    Environment: "bg-emerald-700/90 text-white",
};

function formatNumber(n) {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n}`;
}

export default function ExploreCard({ campaign }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(t);
    }, []);

    const deadline = campaign.deadline ? new Date(campaign.deadline) : null;
    const expired = deadline && deadline < now;
    const daysLeft = deadline && !expired
        ? Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
        : null;
    const progress = Math.min(100, ((campaign.raisedAmount || 0) / (campaign.fundingGoal || 1)) * 100);
    const badge = categoryBadge[campaign.category] || "bg-slate-700/90 text-white";

    return (
        <Link href={`/explore/${campaign._id}`} className="group block bg-white rounded-lg border border-slate-200/30 overflow-hidden flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(53,37,205,0.08)] transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                {campaign.image ? (
                    <Image src={campaign.image} alt={campaign.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <svg className="w-14 h-14 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider backdrop-blur-md ${badge}`}>
                    {(campaign.category || "General").toUpperCase()}
                </span>
                {expired ? (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-slate-700/80 text-white backdrop-blur-md">Ended</span>
                ) : daysLeft !== null && daysLeft <= 7 ? (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-red-500/80 text-white backdrop-blur-md">
                        {daysLeft === 0 ? "Ending Today" : `${daysLeft}d left`}
                    </span>
                ) : null}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">{campaign.title}</h3>
                    <Heart size={20} className="text-slate-400 hover:text-red-500 transition-colors shrink-0 ml-2" />
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{campaign.story || "No description available."}</p>
                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-indigo-700">{formatNumber(campaign.raisedAmount || 0)} <span className="text-slate-400 font-normal">raised</span></span>
                        <span className="text-sm font-semibold text-emerald-600">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                        <span>{(campaign.backersCount || 0).toLocaleString()} Backers</span>
                        {expired ? (
                            <span className="text-red-500 font-bold">ENDED</span>
                        ) : daysLeft !== null ? (
                            <span>{daysLeft === 0 ? "Ending" : `${daysLeft} Days Left`}</span>
                        ) : (
                            <span>Ongoing</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function ExploreCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-slate-200/30 overflow-hidden animate-pulse flex flex-col">
            <div className="h-48 bg-slate-200" />
            <div className="p-5 space-y-3 flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="mt-auto pt-4 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}
