"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function PaymentHistory() {
    const { data: session } = useSession();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/history`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then((data) => {
            setPayments(data.payments || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [session]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Payment History</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>All your credit purchase transactions.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No payment history yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Credits Purchased</th>
                                    <th className="text-right px-6 py-3 font-medium">Amount Paid</th>
                                    <th className="text-left px-6 py-3 font-medium">Payment Method</th>
                                    <th className="text-right px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 ${inter.className}`}>{p.credits} credits</td>
                                        <td className={`px-6 py-4 text-sm text-gray-900 text-right ${inter.className}`}>${p.amount}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-700 ${inter.className}`}>{p.paymentMethod}</td>
                                        <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>{new Date(p.createdAt).toLocaleDateString()}</td>
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
