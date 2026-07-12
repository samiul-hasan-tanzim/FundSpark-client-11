"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`, { cache: 'no-store',
                headers: { Authorization: `Bearer ${session.user.email}` },
            }).then(r => r.json()).then(setProfile).catch(() => {});
        }
    }, [session]);

    const user = session?.user;
    const credits = profile?.credits ?? 0;
    const role = profile?.role || user?.role || "supporter";

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/login");
            return;
        }

        const segment = pathname.split("/")[2];
        if (segment && ["admin", "creator", "supporter"].includes(segment)) {
            if (segment !== role) {
                router.replace("/unauthorized");
            }
        }
    }, [isPending, session, pathname, role, router]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                    <p className={`text-sm text-gray-500 ${inter.className}`}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const segment = pathname.split("/")[2];
    if (segment && ["admin", "creator", "supporter"].includes(segment) && segment !== role) {
        return null;
    }

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
