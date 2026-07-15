"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import toast from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Reports() {
    const { data: session } = useSession();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const fetchReports = () => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/reports`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setReports(data || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchReports(); }, [session]);

    const handleRemove = async (id) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/reports/remove/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${session.user.email}` },
        });
        setReports(prev => prev.filter(r => r._id !== id));
        toast.success("Report dismissed");
    };

    const handleSuspend = async (r) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/suspend`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
                body: JSON.stringify({ campaignId: r.campaignId }),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.message || "Failed to suspend"); return; }
            toast.success(`"${r.campaignTitle}" suspended`);
            setReports(prev => prev.filter(x => x._id !== r._id));
        } catch { toast.error("Network error"); }
        setConfirmAction(null);
    };

    const handleDeleteCampaign = async (r) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
                body: JSON.stringify({ campaignId: r.campaignId }),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.message || "Failed to delete"); return; }
            toast.success(`"${r.campaignTitle}" deleted and supporters refunded`);
            setReports(prev => prev.filter(x => x._id !== r._id));
        } catch { toast.error("Network error"); }
        setConfirmAction(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Reports</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>User-submitted reports on campaigns.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No reports submitted yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {reports.map((r) => (
                            <div key={r._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-sm font-semibold text-gray-900 ${inter.className}`}>{r.campaignTitle}</span>
                                            <span className="px-2 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded-full">Reported</span>
                                        </div>
                                        <p className={`text-xs text-gray-500 ${inter.className}`}>
                                            Reported by {r.reporterName || r.reporterEmail} &middot; {new Date(r.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => setConfirmAction({ type: "suspend", report: r })} className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all">
                                            Suspend
                                        </button>
                                        <button onClick={() => setConfirmAction({ type: "delete", report: r })} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
                                            Delete
                                        </button>
                                        <button onClick={() => handleRemove(r._id)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <button
                                        onClick={() => setExpandedId(expandedId === r._id ? null : r._id)}
                                        className={`text-xs font-medium text-[#4F46E5] hover:underline ${inter.className}`}
                                    >
                                        {expandedId === r._id ? "Hide reason" : "View reason"}
                                    </button>
                                    {expandedId === r._id && (
                                        <p className={`mt-2 text-sm text-gray-700 bg-gray-50 rounded-xl p-3 ${inter.className}`}>{r.reason}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmAction.type === "suspend" ? "bg-amber-100" : "bg-red-100"}`}>
                            <svg className={`w-6 h-6 ${confirmAction.type === "suspend" ? "text-amber-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {confirmAction.type === "suspend" ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                )}
                            </svg>
                        </div>
                        <h3 className={`text-lg font-bold text-gray-900 text-center mb-2 ${poppins.className}`}>
                            {confirmAction.type === "suspend" ? "Suspend Campaign?" : "Delete Campaign?"}
                        </h3>
                        <p className={`text-sm text-gray-500 text-center mb-6 ${inter.className}`}>
                            {confirmAction.type === "suspend"
                                ? `This will take "${confirmAction.report.campaignTitle}" offline. The creator will be notified.`
                                : `This will permanently delete "${confirmAction.report.campaignTitle}" and refund all approved supporters. This cannot be undone.`
                            }
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmAction(null)} className={`flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all ${inter.className}`}>
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmAction.type === "suspend" ? handleSuspend(confirmAction.report) : handleDeleteCampaign(confirmAction.report)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all ${inter.className} ${confirmAction.type === "suspend" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}
                            >
                                {confirmAction.type === "suspend" ? "Suspend Campaign" : "Delete Campaign"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
