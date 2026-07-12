"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const statusStyles = {
    approved: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    rejected: "bg-red-50 text-red-600",
};

export default function MyCampaigns() {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/my`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => {
            setCampaigns(data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [session]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>My Campaigns</h1>
                    <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Manage all your fundraising campaigns.</p>
                </div>
                <Link href="/dashboard/creator/add-campaign" className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all">
                    + New Campaign
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-14 h-14 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className={`text-sm text-gray-500 mb-4 ${inter.className}`}>You haven&apos;t created any campaigns yet.</p>
                        <Link href="/dashboard/creator/add-campaign" className="inline-flex px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all">
                            Create Your First Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Campaign</th>
                                    <th className="text-left px-6 py-3 font-medium">Category</th>
                                    <th className="text-right px-6 py-3 font-medium">Raised</th>
                                    <th className="text-right px-6 py-3 font-medium">Goal</th>
                                    <th className="text-right px-6 py-3 font-medium">Status</th>
                                    <th className="text-right px-6 py-3 font-medium">Date</th>
                                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {campaigns.map(c => {
                                    const progress = Math.min(100, ((c.raisedAmount || 0) / (c.fundingGoal || 1)) * 100);
                                    return (
                                        <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                        {c.image ? (
                                                            <Image src={c.image} alt={c.title} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                                        )}
                                                    </div>
                                                    <Link href={`/explore/${c._id}`} className={`text-sm font-medium text-gray-900 hover:text-[#4F46E5] transition-colors ${inter.className}`}>
                                                        {c.title}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm text-gray-600 ${inter.className}`}>{c.category || "General"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-sm font-semibold text-gray-900 ${inter.className}`}>{c.raisedAmount || 0}</span>
                                                <div className="w-24 ml-auto mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full" style={{ width: `${progress}%` }} />
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>{c.fundingGoal}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[c.status] || "bg-gray-50 text-gray-600"} ${inter.className}`}>
                                                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/dashboard/creator/edit-campaign/${c._id}`} className="inline-flex px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
