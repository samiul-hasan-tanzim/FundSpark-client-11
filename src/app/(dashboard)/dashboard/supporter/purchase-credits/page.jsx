"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const packages = [
    { credits: 100, price: 10, popular: false },
    { credits: 300, price: 25, popular: true },
    { credits: 800, price: 60, popular: false },
    { credits: 1500, price: 110, popular: false },
];

export default function PurchaseCredits() {
    const { data: session } = useSession();
    const [selected, setSelected] = useState(packages[1]);
    const [processing, setProcessing] = useState(false);

    const handlePurchase = async () => {
        if (!session?.user?.email || processing) return;
        setProcessing(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/create-checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.email}` },
                body: JSON.stringify({ credits: selected.credits, amount: selected.price }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Purchase Credits</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Buy credits to support your favorite campaigns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {packages.map((pkg) => (
                    <button key={pkg.credits} onClick={() => setSelected(pkg)} className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${selected.credits === pkg.credits ? "border-[#4F46E5] bg-indigo-50/30 shadow-md" : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"}`}>
                        {pkg.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-semibold rounded-full">Popular</span>
                        )}
                        <div className="text-center">
                            <p className={`text-3xl font-bold text-gray-900 ${poppins.className}`}>{pkg.credits}</p>
                            <p className={`text-xs text-gray-500 mt-0.5 ${inter.className}`}>credits</p>
                            <div className="mt-4 h-px bg-gray-100" />
                            <p className={`mt-4 text-lg font-semibold text-[#4F46E5] ${poppins.className}`}>${pkg.price}</p>
                            <p className={`text-xs text-gray-400 mt-0.5 ${inter.className}`}>${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className={`text-lg font-semibold text-gray-900 mb-4 ${poppins.className}`}>Order Summary</h2>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className={`text-sm text-gray-600 ${inter.className}`}>Package</span>
                    <span className={`text-sm font-semibold text-gray-900 ${inter.className}`}>{selected.credits} credits</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className={`text-sm text-gray-600 ${inter.className}`}>Price</span>
                    <span className={`text-sm font-semibold text-gray-900 ${inter.className}`}>${selected.price}</span>
                </div>
                <button
                    onClick={handlePurchase}
                    disabled={processing}
                    className={`mt-6 w-full py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 transition-all ${inter.className}`}
                >
                    {processing ? "Processing..." : "Purchase with Stripe"}
                </button>
            </div>
        </div>
    );
}
