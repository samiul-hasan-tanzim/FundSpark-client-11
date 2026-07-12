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

export default function Withdrawals() {
    const { data: session } = useSession();
    const [withdrawals, setWithdrawals] = useState([]);
    const [totalRaised, setTotalRaised] = useState(0);
    const [totalWithdrawn, setTotalWithdrawn] = useState(0);
    const [available, setAvailable] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/withdrawals/my`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => {
            setWithdrawals(data.withdrawals || []);
            setTotalRaised(data.totalRaised || 0);
            setTotalWithdrawn(data.totalWithdrawn || 0);
            setAvailable(data.available || 0);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [session]);

    const handleSubmit = async () => {
        if (!amount || parseInt(amount) < 200 || parseInt(amount) > available || submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/withdrawals/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
                body: JSON.stringify({ amount: parseInt(amount) }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Withdrawal request submitted!");
                setWithdrawals(prev => [data, ...prev]);
                setAvailable(prev => prev - parseInt(amount));
                setAmount("");
            } else {
                toast.error(data.message || "Failed to submit withdrawal");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Withdrawals</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Withdraw your raised credits as cash.</p>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className={`text-xs text-gray-500 ${inter.className}`}>Total Raised</p>
                    <p className={`text-2xl font-bold text-gray-900 mt-1 ${poppins.className}`}>{totalRaised}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className={`text-xs text-gray-500 ${inter.className}`}>Withdrawn</p>
                    <p className={`text-2xl font-bold text-gray-900 mt-1 ${poppins.className}`}>{totalWithdrawn}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className={`text-xs text-gray-500 ${inter.className}`}>Available</p>
                    <p className={`text-2xl font-bold text-[#4F46E5] mt-1 ${poppins.className}`}>{available}</p>
                </div>
            </div>

            {/* Withdrawal form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className={`text-lg font-semibold text-gray-900 mb-2 ${poppins.className}`}>Request Withdrawal</h2>
                <p className={`text-xs text-gray-500 mb-4 ${inter.className}`}>Minimum 200 credits. Rate: 20 credits = $1.00</p>
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${inter.className}`}>Amount (credits)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Enter credits amount"
                            min="200"
                            max={available}
                            className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none transition-all ${inter.className}`}
                        />
                        {amount && (
                            <p className={`text-xs text-gray-400 mt-1 ${inter.className}`}>
                                You&apos;ll receive ${(parseInt(amount) / 20).toFixed(2)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!amount || parseInt(amount) < 200 || parseInt(amount) > available || submitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 transition-all"
                    >
                        {submitting ? "Submitting..." : "Request"}
                    </button>
                </div>
            </div>

            {/* Withdrawal history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className={`text-lg font-semibold text-gray-900 ${poppins.className}`}>Withdrawal History</h2>
                </div>
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : withdrawals.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No withdrawal requests yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">Amount</th>
                                    <th className="text-left px-6 py-3 font-medium">Value</th>
                                    <th className="text-right px-6 py-3 font-medium">Status</th>
                                    <th className="text-right px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.map(w => (
                                    <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 ${inter.className}`}>{w.amount} credits</td>
                                        <td className={`px-6 py-4 text-sm text-gray-600 ${inter.className}`}>${w.dollarValue}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[w.status] || "bg-gray-50 text-gray-600"} ${inter.className}`}>
                                                {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-gray-500 text-right ${inter.className}`}>
                                            {new Date(w.createdAt).toLocaleDateString()}
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
