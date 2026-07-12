"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}

export default function NotificationDropdown({ alignLeft = false }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.email) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`, {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${session.user.email}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch {}
    }, [session]);

    useEffect(() => {
        const t = setTimeout(() => fetchNotifications(), 0);
        const interval = setInterval(fetchNotifications, 30000);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, [session, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${session.user.email}` },
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleNotificationClick = async (n) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/${n._id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${session.user.email}` },
            });
        } catch {}
        setOpen(false);
        router.push(n.actionRoute);
    };

    if (!session?.user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-xl text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50/60 transition-all"
                aria-label="Notifications"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className={`absolute ${alignLeft ? "left-0" : "right-0"} top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden z-50`}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className={`text-sm font-semibold text-gray-900 ${inter.className}`}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className={`text-xs font-medium text-[#4F46E5] hover:text-[#7C3AED] transition-colors ${inter.className}`}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className={`px-4 py-10 text-center text-sm text-gray-400 ${inter.className}`}>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n._id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-indigo-50/40 transition-colors ${!n.read ? "bg-indigo-50/20" : ""}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[#4F46E5]" : "bg-transparent"}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm text-gray-700 leading-snug ${inter.className} ${!n.read ? "font-medium" : ""}`}>
                                                {n.message}
                                            </p>
                                            <p className={`mt-1 text-[11px] text-gray-400 ${inter.className}`}>{timeAgo(n.createdAt)}</p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
