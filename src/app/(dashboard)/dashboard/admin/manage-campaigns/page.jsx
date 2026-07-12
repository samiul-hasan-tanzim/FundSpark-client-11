"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function ManageCampaigns() {
    const { data: session } = useSession();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = () => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/all`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setCampaigns(data || []); }).catch(() => {});
    };

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/all`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setCampaigns(data || []); setLoading(false); }).catch(() => setLoading(false));
    }, [session]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ campaignId: id }),
        });
        setCampaigns(prev => prev.filter(c => c._id !== id));
    };

    const statusColor = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-50 text-emerald-600";
            case "pending": return "bg-amber-50 text-amber-600";
            case "rejected": return "bg-red-50 text-red-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Manage Campaigns</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>View and remove campaigns.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No campaigns found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Title</th>
                                    <th className="text-left px-6 py-3 font-medium">Creator</th>
                                    <th className="text-left px-6 py-3 font-medium">Creator Email</th>
                                    <th className="text-right px-6 py-3 font-medium">Goal</th>
                                    <th className="text-right px-6 py-3 font-medium">Raised</th>
                                    <th className="text-center px-6 py-3 font-medium">Status</th>
                                    <th className="text-right px-6 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {campaigns.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className={`px-6 py-4 text-sm font-medium text-gray-900 ${inter.className}`}>{c.title}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 ${inter.className}`}>{c.creatorName}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-500 ${inter.className}`}>{c.creatorEmail}</td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{c.fundingGoal} credits</td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{c.raisedAmount || 0} credits</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor(c.status)}`}>
                                                {c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(c._id)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                                            >
                                                Delete
                                            </button>
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
