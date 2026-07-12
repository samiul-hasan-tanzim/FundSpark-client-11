"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function CreatorDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalRaised: 0, pendingContributions: 0 });
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (!session?.user?.email) return;
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/creator/stats`, {
                headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).catch(() => ({})),
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contributions/pending`, {
                headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).catch(() => []),
        ]).then(([statsData, contribs]) => {
            setStats({
                totalCampaigns: statsData.totalCampaigns || 0,
                activeCampaigns: statsData.activeCampaigns || 0,
                totalRaised: statsData.totalRaised || 0,
                pendingContributions: statsData.pendingContributions || contribs.length || 0,
            });
            setContributions(contribs);
            setLoading(false);
        });
    }, [session]);

    const handleContributionStatus = async (id, status) => {
        setProcessingId(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contributions/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
                body: JSON.stringify({ contributionId: id, status }),
            });
            if (res.ok) {
                setContributions(prev => prev.filter(c => c._id !== id));
                setStats(prev => ({ ...prev, pendingContributions: prev.pendingContributions - 1 }));
            }
        } finally {
            setProcessingId(null);
        }
    };

    const statCards = [
        { label: "Total Campaigns", value: stats.totalCampaigns, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "from-[#4F46E5] to-[#7C3AED]" },
        { label: "Active Campaigns", value: stats.activeCampaigns, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-[#10B981] to-[#059669]" },
        { label: "Total Raised", value: `${stats.totalRaised} credits`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "from-[#0EA5E9] to-[#0284C7]" },
        { label: "Pending Reviews", value: stats.pendingContributions, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-[#F59E0B] to-[#D97706]" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Welcome back, {session?.user?.name?.split(" ")[0] || "Creator"}</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Here&apos;s what&apos;s happening with your campaigns today.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((card) => (
                    <div key={card.label} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, ${card.color.split(" ")[0].replace("from-", "")}, ${card.color.split(" ")[1].replace("to-", "")})` }} />
                        <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                                    </svg>
                                </div>
                            </div>
                            <p className={`text-2xl font-bold text-gray-900 ${poppins.className}`}>{card.value}</p>
                            <p className={`text-xs text-gray-500 mt-1 ${inter.className}`}>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contributions Review */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className={`text-lg font-semibold text-gray-900 ${poppins.className}`}>Contributions Review</h2>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Pending contributions awaiting your decision</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full">{stats.pendingContributions} pending</span>
                </div>
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : contributions.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No pending contributions. You&apos;re all caught up!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Supporter</th>
                                    <th className="text-left px-6 py-3 font-medium">Campaign</th>
                                    <th className="text-right px-6 py-3 font-medium">Amount</th>
                                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                                                    {c.supporterName?.[0]?.toUpperCase() || "S"}
                                                </div>
                                                <span className={`text-sm font-medium text-gray-900 ${inter.className}`}>{c.supporterName || "Anonymous"}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 ${inter.className}`}>{c.campaignTitle}</td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{c.contributionAmount} credits</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleContributionStatus(c._id, 'approved')} disabled={processingId === c._id} className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full hover:bg-emerald-100 disabled:opacity-50 transition-colors">Approve</button>
                                                <button onClick={() => handleContributionStatus(c._id, 'rejected')} disabled={processingId === c._id} className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full hover:bg-red-100 disabled:opacity-50 transition-colors">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/creator/add-campaign" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors ${inter.className}`}>Launch New Campaign</p>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Create a new fundraising campaign</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
                <Link href="/dashboard/creator/withdrawals" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors ${inter.className}`}>Withdraw Funds</p>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Withdraw your raised credits</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
