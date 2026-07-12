"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Reports() {
    const { data: session } = useSession();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

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
                                    <button
                                        onClick={() => handleRemove(r._id)}
                                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all shrink-0"
                                    >
                                        Dismiss
                                    </button>
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
        </div>
    );
}
