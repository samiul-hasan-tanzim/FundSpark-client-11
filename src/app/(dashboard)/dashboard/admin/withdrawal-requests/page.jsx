"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import toast from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const statusStyles = {
    approved: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    rejected: "bg-red-50 text-red-600",
};

export default function WithdrawalRequests() {
    const { data: session } = useSession();
    const [tab, setTab] = useState("pending");
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWithdrawals = () => {
        if (!session?.user?.email) return;
        const endpoint = tab === "pending"
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/withdrawals/pending`
            : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/withdrawals/all`;
        fetch(endpoint, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setWithdrawals(data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { setLoading(true); fetchWithdrawals(); }, [session, tab]);

    const handleApprove = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/withdrawals/approve`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ withdrawalId: id }),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success("Withdrawal approved!");
            setWithdrawals(prev => prev.filter(w => w._id !== id));
        } else {
            toast.error(data.message || "Failed to approve withdrawal");
        }
    };

    const handleReject = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/withdrawals/reject`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ withdrawalId: id }),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success("Withdrawal rejected!");
            setWithdrawals(prev => prev.filter(w => w._id !== id));
        } else {
            toast.error(data.message || "Failed to reject withdrawal");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Withdrawal Requests</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Review and manage withdrawal requests from creators.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button onClick={() => setTab("pending")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${inter.className} ${tab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    Pending
                </button>
                <button onClick={() => setTab("history")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${inter.className} ${tab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    History
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : withdrawals.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>
                            {tab === "pending" ? "No pending withdrawal requests." : "No withdrawal history."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Creator</th>
                                    <th className="text-right px-6 py-3 font-medium">Credits</th>
                                    <th className="text-right px-6 py-3 font-medium">Value</th>
                                    {tab === "history" && <th className="text-right px-6 py-3 font-medium">Status</th>}
                                    <th className="text-right px-6 py-3 font-medium">Date</th>
                                    {tab === "pending" && <th className="text-right px-6 py-3 font-medium">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.map((w) => (
                                    <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                                                    {w.creatorName?.[0]?.toUpperCase() || "C"}
                                                </div>
                                                <span className={`text-sm font-medium text-gray-900 ${inter.className}`}>{w.creatorName || "Creator"}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{w.amount}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 text-right ${inter.className}`}>${w.dollarValue}</td>
                                        {tab === "history" && (
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[w.status] || "bg-gray-50 text-gray-600"} ${inter.className}`}>
                                                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                                </span>
                                            </td>
                                        )}
                                        <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>
                                            {new Date(w.createdAt).toLocaleDateString()}
                                        </td>
                                        {tab === "pending" && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleApprove(w._id)} className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all">Approve</button>
                                                    <button onClick={() => handleReject(w._id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all">Reject</button>
                                                </div>
                                            </td>
                                        )}
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
