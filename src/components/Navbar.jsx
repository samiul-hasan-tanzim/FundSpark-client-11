"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import NotificationDropdown from "@/components/NotificationDropdown";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const Navbar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profile, setProfile] = useState(null);
    const menuRef = useRef(null);

    const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`, { cache: 'no-store',
                headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).then(setProfile).catch(() => {});
        }
    }, [session]);

    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    const user = session?.user;
    const credits = profile?.credits ?? 0;
    const roleMap = { creator: "/dashboard/creator", admin: "/dashboard/admin" };
    const dashboardHref = roleMap[session?.user?.role] || "/dashboard/supporter";
    const linkBase = `text-sm font-medium tracking-wide transition-all duration-200 ${inter.className}`;

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-2xl shadow-[0_1px_30px_-10px_rgba(0,0,0,0.12)] border-b border-white/20" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] shadow-sm shadow-indigo-500/20 group-hover:shadow-md group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
                            <svg className="w-[17px] h-[17px] text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22c-2.5 0-4.5-1.5-5.5-3.5C5 15.5 5.5 12 7 10c.5-.7 1-1.5 1-2.5S7.5 4.5 7 3c2 .5 4 2 5.5 4.5C14 10 13.5 12.5 12 14c-1 1-1.5 2.5-.5 3.5.5.5 1 .5 1.5.5.5 0 1-.5 1-1 0-.5-.5-1-1-2 1 0 2 .5 2.5 1.5.5 1.5 0 3.5-1.5 4.5-.5.5-1.5 1-2 1z" opacity="0.35" />
                                <path d="M11.9 21c-2 0-3.7-1.2-4.5-2.8-1.2-2.4-.7-5.2.5-7 .4-.6.8-1.2.8-2s-.5-2.4-.8-3.2c1.6.4 3.2 1.6 4.3 3.6 1.1 2 .7 4-.4 5.5-.8 1-1.2 2-.4 2.8.4.4.8.4 1.2.4s.8-.4.8-.8c0-.4-.4-.8-.8-1.6.8 0 1.6.4 2 1.2.4 1.2 0 2.8-1.2 3.6-.4.3-1.2.8-1.5.8z" />
                            </svg>
                        </div>
                        <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${poppins.className} ${scrolled ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent" : "text-white"}`}>
                            FundSpark
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link href="/" className={`${linkBase} px-4 py-2 rounded-xl ${isActive("/") ? "text-[#4F46E5] bg-indigo-50/80" : scrolled ? "text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50/60" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                            Home
                        </Link>
                        <Link href="/explore" className={`${linkBase} px-4 py-2 rounded-xl ${isActive("/explore") ? "text-[#4F46E5] bg-indigo-50/80" : scrolled ? "text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50/60" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                            Explore Campaigns
                        </Link>

                        {user ? (
                            <>
                                <Link href={dashboardHref} className={`${linkBase} px-4 py-2 rounded-xl ${isActive(dashboardHref) ? "text-[#4F46E5] bg-indigo-50/80" : scrolled ? "text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50/60" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                                    Dashboard
                                </Link>

                                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/60 rounded-full shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-[#4F46E5]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                                    </svg>
                                    <span className={`text-xs font-bold text-[#4F46E5] ${inter.className}`}>{credits}</span>
                                </div>

                                <NotificationDropdown />

                                <div className="relative group">
                                    <button className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-200 ${scrolled ? "border-gray-200 hover:border-[#4F46E5] shadow-sm" : "border-white/40 hover:border-white"}`}>
                                        {user.image ? (
                                            <img src={user.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-sm font-semibold">
                                                {user.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </button>
                                    <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className={`text-sm font-semibold text-gray-900 ${inter.className}`}>{user.name}</p>
                                            <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>{user.email}</p>
                                        </div>
                                        <div className="px-2 py-1">
                                            <button
                                                onClick={async () => { await authClient.signOut(); window.location.href = "/"; }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors ${inter.className}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={`${linkBase} px-4 py-2 rounded-xl ${isActive("/login") ? "text-[#4F46E5] bg-indigo-50/80" : scrolled ? "text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50/60" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${inter.className} ${scrolled ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-indigo-500/25 hover:shadow-indigo-500/35" : "bg-white text-[#4F46E5] shadow-black/10 hover:shadow-black/20"}`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setOpen(!open)}
                        className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${scrolled ? "text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100" : "text-white hover:text-white hover:bg-white/10"}`}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                ref={menuRef}
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-lg mx-4 mb-3 rounded-2xl">
                    <div className="px-4 py-4 space-y-1">
                        <Link href="/" onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${inter.className} ${isActive("/") ? "text-[#4F46E5] bg-indigo-50" : "text-gray-700 hover:text-[#4F46E5] hover:bg-indigo-50/60"}`}>
                            Home
                        </Link>
                        <Link href="/explore" onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${inter.className} ${isActive("/explore") ? "text-[#4F46E5] bg-indigo-50" : "text-gray-700 hover:text-[#4F46E5] hover:bg-indigo-50/60"}`}>
                            Explore Campaigns
                        </Link>
                        {user ? (
                            <>
                                <Link href={dashboardHref} onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${inter.className} ${isActive(dashboardHref) ? "text-[#4F46E5] bg-indigo-50" : "text-gray-700 hover:text-[#4F46E5] hover:bg-indigo-50/60"}`}>
                                    Dashboard
                                </Link>
                                <div className={`flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 ${inter.className}`}>
                                    <span>Available Credits</span>
                                    <span className="font-bold text-[#4F46E5]">{credits}</span>
                                </div>
                                <hr className="my-1 border-gray-100" />
                                <button
                                    onClick={async () => { await authClient.signOut(); window.location.href = "/"; }}
                                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all ${inter.className}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${inter.className} ${isActive("/login") ? "text-[#4F46E5] bg-indigo-50" : "text-gray-700 hover:text-[#4F46E5] hover:bg-indigo-50/60"}`}>
                                    Login
                                </Link>
                                <Link href="/register" onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-center ${inter.className}`}>
                                    Register
                                </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
    };

export default Navbar;
