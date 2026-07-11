"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).then(setProfile).catch(() => {});
        }
    }, [session]);

    const user = session?.user;
    const credits = profile?.credits ?? 0;
    const role = profile?.role || user?.role || "supporter";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <DashboardSidebar user={user} credits={credits} role={role} />
            <div className="flex-1 flex flex-col lg:pt-0 pt-14">
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
