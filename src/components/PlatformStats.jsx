"use client";

export default function PlatformStats({ stats }) {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div className="text-center space-y-2">
                        <p className="text-4xl md:text-5xl font-bold text-indigo-700">
                            {stats.totalCampaigns > 0
                                ? (stats.totalCampaigns >= 1000
                                    ? (stats.totalCampaigns / 1000).toFixed(0) + "K+"
                                    : stats.totalCampaigns.toLocaleString())
                                : "5,200+"}
                        </p>
                        <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px]">Projects Funded</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl md:text-5xl font-bold text-indigo-700">
                            {stats.totalCredits > 0
                                ? "$" + (stats.totalCredits >= 1000000
                                    ? (stats.totalCredits / 1000000).toFixed(1) + "M"
                                    : (stats.totalCredits / 1000).toFixed(1) + "K")
                                : "$850M+"}
                        </p>
                        <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px]">Total Contributions</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl md:text-5xl font-bold text-indigo-700">
                            {stats.totalSupporters > 0
                                ? (stats.totalSupporters >= 1000
                                    ? (stats.totalSupporters / 1000).toFixed(0) + "K+"
                                    : stats.totalSupporters.toLocaleString())
                                : "120K+"}
                        </p>
                        <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px]">Global Backers</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-4xl md:text-5xl font-bold text-indigo-700">94%</p>
                        <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px]">Success Rate</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
