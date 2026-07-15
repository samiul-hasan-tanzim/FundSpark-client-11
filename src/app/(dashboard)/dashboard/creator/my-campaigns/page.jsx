"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

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
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCampaigns = () => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/my`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => {
            setCampaigns(data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchCampaigns();
    }, [session]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/delete/${deleteTarget}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.user?.email}` },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to delete campaign");
            } else {
                toast.success(data.message || "Campaign deleted");
                setDeleteTarget(null);
                fetchCampaigns();
            }
        } catch {
            toast.error("Network error");
        }
        setDeleting(false);
    };

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
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/dashboard/creator/edit-campaign/${c._id}`} className="inline-flex px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                                                        Edit
                                                    </Link>
                                                    <button onClick={() => setDeleteTarget(c._id)} className="inline-flex px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold text-gray-900 text-center mb-2 ${poppins.className}`}>Delete Campaign?</h3>
                        <p className={`text-sm text-gray-500 text-center mb-6 ${inter.className}`}>
                            This will permanently delete the campaign and refund all approved supporters. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={deleting} className={`flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 ${inter.className}`}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleting} className={`flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${inter.className}`}>
                                {deleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Deleting...
                                    </>
                                ) : "Delete Campaign"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
