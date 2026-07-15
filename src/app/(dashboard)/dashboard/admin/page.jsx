"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700" ,"800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`, {
                cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/campaigns/all`, {
                cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()),
        ]).then(([statsData, campaignsData]) => {
            setStats(statsData);
            setCampaigns(campaignsData || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [session]);

    const cards = [
        { label: "Total Supporters", value: stats?.totalSupporters ?? 0, color: "from-emerald-500 to-emerald-600", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { label: "Total Creators", value: stats?.totalCreators ?? 0, color: "from-sky-500 to-sky-600", icon: "M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
        { label: "Total Credits", value: stats?.totalCredits ?? 0, color: "from-[#4F46E5] to-[#7C3AED]", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { label: "Payments Processed", value: stats?.totalPayments ?? 0, color: "from-amber-500 to-amber-600", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    ];

    const userData = [
        { name: "Supporters", value: stats?.totalSupporters ?? 0 },
        { name: "Creators", value: stats?.totalCreators ?? 0 },
    ];

    const campaignStatusData = (() => {
        const counts = { approved: 0, pending: 0, rejected: 0, suspended: 0 };
        campaigns.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });
        return Object.entries(counts).map(([status, count]) => ({ name: status.charAt(0).toUpperCase() + status.slice(1), count }));
    })();

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Admin Dashboard</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Platform overview and management.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                                </svg>
                            </div>
                        </div>
                        <p className={`text-2xl font-bold text-gray-900 ${poppins.className}`}>
                            {loading ? <span className="animate-pulse bg-gray-200 rounded inline-block w-16 h-7" /> : card.value}
                        </p>
                        <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>{card.label}</p>
                    </div>
                ))}
            </div>

            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Distribution Bar Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className={`text-base font-semibold text-gray-900 mb-1 ${poppins.className}`}>User Distribution</h3>
                        <p className={`text-xs text-gray-500 mb-4 ${inter.className}`}>Supporters vs Creators on the platform</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={userData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                                    {userData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Role Distribution Pie Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className={`text-base font-semibold text-gray-900 mb-1 ${poppins.className}`}>Role Distribution</h3>
                        <p className={`text-xs text-gray-500 mb-4 ${inter.className}`}>Proportion of user roles across the platform</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={userData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {userData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Campaign Status Bar Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
                        <h3 className={`text-base font-semibold text-gray-900 mb-1 ${poppins.className}`}>Campaign Status Overview</h3>
                        <p className={`text-xs text-gray-500 mb-4 ${inter.className}`}>Breakdown of all campaigns by current status</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={campaignStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={80}>
                                    {campaignStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
