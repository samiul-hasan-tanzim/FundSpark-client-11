"use client";
import { Poppins, Inter } from "next/font/google";
import Counter from "@/components/Counter";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function PlatformStats({ stats }) {
    const items = [
        { label: "Total Campaigns", value: stats.totalCampaigns, suffix: "+" },
        { label: "Total Creators", value: stats.totalCreators, suffix: "+" },
        { label: "Total Supporters", value: stats.totalSupporters, suffix: "+" },
        { label: "Credits Raised", value: stats.totalCredits, suffix: "" },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-white ${poppins.className}`}>Platform Statistics</h2>
                    <p className={`mt-3 text-white/70 max-w-lg mx-auto ${inter.className}`}>FundSpark by the numbers</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((stat) => (
                        <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-[24px] p-6 text-center hover:bg-white/15 transition-colors">
                            <div className={`text-3xl md:text-4xl font-bold text-white ${poppins.className}`}>
                                <Counter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className={`text-sm text-white/70 mt-2 ${inter.className}`}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
