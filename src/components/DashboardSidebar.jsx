"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const creatorLinks = [
    { href: "/dashboard/creator", label: "Dashboard Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/dashboard/creator/add-campaign", label: "Add New Campaign", icon: "M12 4v16m8-8H4" },
    { href: "/dashboard/creator/my-campaigns", label: "My Campaigns", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { href: "/dashboard/creator/withdrawals", label: "Withdrawals", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    { href: "/dashboard/creator/payment-history", label: "Payment History", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
];

const supporterLinks = [
    { href: "/dashboard/supporter", label: "Dashboard Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/explore", label: "Explore Campaigns", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { href: "/dashboard/supporter/my-contributions", label: "My Contributions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { href: "/dashboard/supporter/purchase-credits", label: "Purchase Credits", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/dashboard/supporter/payment-history", label: "Payment History", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Dashboard Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: "/dashboard/admin/campaign-approvals", label: "Campaign Approvals", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/dashboard/admin/manage-campaigns", label: "Manage Campaigns", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { href: "/dashboard/admin/withdrawal-requests", label: "Withdrawal Requests", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    { href: "/dashboard/admin/reports", label: "Reports", icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" },
];

const roleLinks = { creator: creatorLinks, supporter: supporterLinks, admin: adminLinks };

export default function DashboardSidebar({ user, credits, role }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const links = roleLinks[role] || [];

    return (
        <>
            {/* Desktop sidebar */}
            <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? "w-20" : "w-64"} shrink-0`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                    <Link href="/" className={`flex items-center gap-2.5 ${collapsed ? "justify-center w-full" : ""}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shrink-0">
                            <svg className="w-[14px] h-[14px] text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.9 21c-2 0-3.7-1.2-4.5-2.8-1.2-2.4-.7-5.2.5-7 .4-.6.8-1.2.8-2s-.5-2.4-.8-3.2c1.6.4 3.2 1.6 4.3 3.6 1.1 2 .7 4-.4 5.5-.8 1-1.2 2-.4 2.8.4.4.8.4 1.2.4s.8-.4.8-.8c0-.4-.4-.8-.8-1.6.8 0 1.6.4 2 1.2.4 1.2 0 2.8-1.2 3.6-.4.3-1.2.8-1.5.8z" />
                            </svg>
                        </div>
                        {!collapsed && (
                            <span className={`text-lg font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent ${poppins.className}`}>
                                FundSpark
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setCollapsed(!collapsed)} className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all ${collapsed ? "hidden" : ""}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* User info */}
                <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className={`text-sm font-semibold text-gray-900 truncate ${inter.className}`}>{user?.name || "User"}</p>
                                <p className={`text-xs text-gray-500 capitalize ${inter.className}`}>{role || "user"}</p>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl">
                            <svg className="w-4 h-4 text-[#4F46E5] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                            </svg>
                            <span className={`text-xs font-bold text-[#4F46E5] ${inter.className}`}>{credits} credits</span>
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${inter.className} ${active ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"} ${collapsed ? "justify-center" : ""}`}
                            >
                                <svg className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                                </svg>
                                {!collapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <button
                        onClick={async () => { await authClient.signOut(); window.location.href = "/"; }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 ${inter.className} ${collapsed ? "justify-center" : ""}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {collapsed && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setCollapsed(false)} />
            )}

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                        <svg className="w-[14px] h-[14px] text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.9 21c-2 0-3.7-1.2-4.5-2.8-1.2-2.4-.7-5.2.5-7 .4-.6.8-1.2.8-2s-.5-2.4-.8-3.2c1.6.4 3.2 1.6 4.3 3.6 1.1 2 .7 4-.4 5.5-.8 1-1.2 2-.4 2.8.4.4.8.4 1.2.4s.8-.4.8-.8c0-.4-.4-.8-.8-1.6.8 0 1.6.4 2 1.2.4 1.2 0 2.8-1.2 3.6-.4.3-1.2.8-1.5.8z" />
                        </svg>
                    </div>
                    <span className={`text-base font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent ${poppins.className}`}>FundSpark</span>
                </Link>
                <button onClick={() => setCollapsed(true)} className="p-2 text-gray-600 hover:text-[#4F46E5] rounded-lg hover:bg-gray-100 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </>
    );
}
