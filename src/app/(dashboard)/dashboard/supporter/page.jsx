"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function SupporterDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ totalContributions: 0, pendingContributions: 0, approvedContributions: 0, totalCreditsContributed: 0 });
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/supporter/stats`, {
                cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).catch(() => ({})),
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contributions/approved`, {
                cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).catch(() => []),
        ]).then(([statsData, contribs]) => {
            setStats({
                totalContributions: statsData.totalContributions || 0,
                pendingContributions: statsData.pendingContributions || 0,
                approvedContributions: statsData.approvedContributions || 0,
                totalCreditsContributed: statsData.totalCreditsContributed || 0,
            });
            setContributions(contribs);
            setLoading(false);
        });
    }, [session]);

    const statCards = [
        { label: "Total Contributions", value: stats.totalContributions, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "from-[#4F46E5] to-[#7C3AED]" },
        { label: "Pending", value: stats.pendingContributions, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-[#F59E0B] to-[#D97706]" },
        { label: "Approved", value: stats.approvedContributions, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-[#10B981] to-[#059669]" },
        { label: "Credits Contributed", value: `${stats.totalCreditsContributed}`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "from-[#0EA5E9] to-[#0284C7]" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Welcome back, {session?.user?.name?.split(" ")[0] || "Supporter"}</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Here&apos;s an overview of your contribution activity.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((card) => (
                    <div key={card.label} className="relative group">
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className={`text-lg font-semibold text-gray-900 ${poppins.className}`}>Approved Contributions</h2>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Contributions that have been approved by creators</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">{stats.approvedContributions} approved</span>
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
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No approved contributions yet. Start supporting campaigns!</p>
                        <Link href="/explore" className={`inline-block mt-3 px-5 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all ${inter.className}`}>
                            Explore Campaigns
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Campaign</th>
                                    <th className="text-left px-6 py-3 font-medium">Creator</th>
                                    <th className="text-right px-6 py-3 font-medium">Amount</th>
                                    <th className="text-right px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className={`px-6 py-4 text-sm font-medium text-gray-900 ${inter.className}`}>{c.campaignTitle}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 ${inter.className}`}>{c.creatorName}</td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{c.contributionAmount} credits</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                c.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                                                c.status === "pending" ? "bg-amber-50 text-amber-600" :
                                                "bg-red-50 text-red-600"
                                            } ${inter.className}`}>
                                                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/supporter/purchase-credits" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors ${inter.className}`}>Purchase Credits</p>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Buy more credits to support campaigns</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
                <Link href="/dashboard/supporter/my-contributions" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors ${inter.className}`}>View All Contributions</p>
                        <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>Check your contribution history</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
