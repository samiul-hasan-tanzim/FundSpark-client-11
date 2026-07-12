"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function CampaignApprovals() {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = () => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/pending`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setCampaigns(data || []); }).catch(() => {});
    };

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/pending`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setCampaigns(data || []); setLoading(false); }).catch(() => setLoading(false));
    }, [session]);

    const handleApprove = async (id) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/approve`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ campaignId: id }),
        });
        setCampaigns(prev => prev.filter(c => c._id !== id));
    };

    const handleReject = async (id) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/reject`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ campaignId: id }),
        });
        setCampaigns(prev => prev.filter(c => c._id !== id));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Campaign Approvals</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Review and approve or reject pending campaigns.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No pending campaigns.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Campaign</th>
                                    <th className="text-left px-6 py-3 font-medium">Creator</th>
                                    <th className="text-left px-6 py-3 font-medium">Category</th>
                                    <th className="text-right px-6 py-3 font-medium">Goal</th>
                                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {campaigns.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className={`px-6 py-4 text-sm font-medium text-gray-900 ${inter.className}`}>{c.title}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 ${inter.className}`}>{c.creatorName}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{c.category}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{c.fundingGoal} credits</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(c._id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(c._id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
