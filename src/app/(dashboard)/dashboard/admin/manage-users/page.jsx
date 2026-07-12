"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function ManageUsers() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${session.user.email}` },
        }).then(r => r.json()).then(data => { setUsers(data || []); setLoading(false); }).catch(() => setLoading(false));
    }, [session]);

    const handleRoleChange = async (email, newRole) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ email, role: newRole }),
        });
        setUsers(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
    };

    const handleRemove = async (email) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/remove`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
            body: JSON.stringify({ email }),
        });
        setUsers(prev => prev.filter(u => u.email !== email));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Manage Users</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>View, update roles, and remove users.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>No users found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-xs text-gray-500 uppercase tracking-wider ${inter.className}`}>
                                    <th className="text-left px-6 py-3 font-medium">User</th>
                                    <th className="text-left px-6 py-3 font-medium">Email</th>
                                    <th className="text-left px-6 py-3 font-medium">Role</th>
                                    <th className="text-right px-6 py-3 font-medium">Credits</th>
                                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u.email} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {u.name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <span className={`text-sm font-medium text-gray-900 ${inter.className}`}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-gray-500 ${inter.className}`}>{u.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={u.role}
                                                disabled={u.email === 'admin@admin.com'}
                                                onChange={(e) => handleRoleChange(u.email, e.target.value)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-200 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 disabled:opacity-50 disabled:cursor-not-allowed ${inter.className}`}
                                            >
                                                <option value="supporter">Supporter</option>
                                                <option value="creator">Creator</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-semibold text-gray-900 text-right ${inter.className}`}>{u.credits}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                disabled={u.email === 'admin@admin.com'}
                                                onClick={() => handleRemove(u.email)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                                                    u.email === 'admin@admin.com'
                                                        ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                                        : 'text-red-600 bg-red-50 hover:bg-red-100'
                                                }`}
                                            >
                                                Remove
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
