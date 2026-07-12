"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Timer, Leaf } from "lucide-react";

export default function TopCampaigns({ campaigns }) {
    const formatCurrency = (val) => {
        if (!val) return "$0";
        const n = Number(val);
        if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "K";
        return "$" + n.toLocaleString();
    };

    const formatNumber = (val) => {
        if (!val) return "0";
        const n = Number(val);
        if (n >= 1000) return (n / 1000).toFixed(0) + "," + (n % 1000 > 0 ? Math.round(n % 1000) : "000");
        return n.toLocaleString();
    };

    const raisedPercent = (campaign) => {
        const goal = campaign.fundingGoal || campaign.goal || 0;
        const raised = campaign.raised || campaign.raisedAmount || 0;
        if (!goal || goal === 0) return 0;
        return Math.min(Math.round((raised / goal) * 100), 999);
    };

    return (
        <section className="py-20 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex justify-between items-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900">Top Funded Campaigns</h2>
                    <div className="flex gap-3">
                        <button type="button" className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-indigo-700 hover:text-white transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button type="button" className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-indigo-700 hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {campaigns.length === 0 ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 animate-pulse flex flex-col">
                                <div className="h-64 bg-slate-200" />
                                <div className="p-6 space-y-4">
                                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 rounded w-full" />
                                    <div className="h-2 bg-slate-200 rounded w-full" />
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-slate-200 rounded w-20" />
                                        <div className="h-4 bg-slate-200 rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        campaigns.slice(0, 3).map((campaign, i) => {
                            const pct = raisedPercent(campaign);
                            return (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 hover:shadow-2xl transition-all group flex flex-col">
                                    <div className="relative overflow-hidden h-64">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={campaign.title} src={campaign.image || "/placeholder.jpg"} />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-700 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-indigo-700 animate-pulse"></span>
                                            TRENDING
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6 flex-1 flex flex-col">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{campaign.category || "General"}</span>
                                                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                                    <Timer size={14} />
                                                    {campaign.daysLeft || "30"} days left
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{campaign.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 mt-3">{campaign.description}</p>
                                        </div>
                                        <div className="mt-auto space-y-3">
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-linear-to-r from-emerald-500 to-sky-500" style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-center font-semibold">
                                                <div className="space-y-1">
                                                    <p className="text-slate-900">{formatCurrency(campaign.raised || campaign.raisedAmount)}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">Raised ({pct}%)</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-slate-900">{formatNumber(campaign.backers)}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase">Backers</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="mt-16 text-center">
                    <Link href="/explore" className="inline-block px-10 py-4 border-2 border-indigo-700 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-700 hover:text-white transition-all duration-300">Explore All 400+ Active Projects</Link>
                </div>
            </div>
        </section>
    );
}
