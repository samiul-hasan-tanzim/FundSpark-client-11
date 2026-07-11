"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function MyContributions() {
    const { data: session } = useSession();
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contributions/my?page=${page}&limit=10`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then((data) => {
            setContributions(data.contributions || []);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [session, page]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>My Contributions</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>All your contributions across campaigns.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : contributions.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No contributions found.</p>
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
                                    <th className="text-right px-6 py-3 font-medium">Date</th>
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
                                        <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${page <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"} ${inter.className}`}>Previous</button>
                        <span className={`text-sm text-gray-500 ${inter.className}`}>Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${page >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"} ${inter.className}`}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}
