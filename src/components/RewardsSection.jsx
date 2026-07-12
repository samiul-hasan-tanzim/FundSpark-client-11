import { CheckCircle } from "lucide-react";

function parseRewardLines(text) {
    return text.split("\n").filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, "").trim());
}

export default function RewardsSection({ campaign }) {
    if (!campaign.rewardInfo) return null;

    const lines = parseRewardLines(campaign.rewardInfo);

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-slate-900">Select a Reward</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lines.length > 1 ? (
                    lines.map((line, i) => (
                        <div
                            key={i}
                            className={`bg-white p-6 rounded-[24px] border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${i === 1 ? "border-2 border-indigo-700 shadow-lg relative overflow-hidden" : "border-slate-200/50"}`}
                        >
                            {i === 1 && (
                                <div className="absolute top-0 right-0 bg-indigo-700 text-white px-4 py-1 rounded-bl-xl text-xs font-bold tracking-wider">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xl font-semibold text-slate-900">Tier {i + 1}</h4>
                                    <span className="text-xl font-semibold text-indigo-700">${(i + 1) * 100}</span>
                                </div>
                                <p className="text-sm text-slate-500">{line}</p>
                            </div>
                            <button
                                type="button"
                                className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all ${i === 1 ? "bg-gradient-to-r from-indigo-700 to-violet-600 text-white shadow-md hover:opacity-90" : "border border-indigo-700 text-indigo-700 hover:bg-indigo-50"}`}
                            >
                                Select Reward
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200/50 shadow-sm">
                        <p className="text-sm text-slate-600">{campaign.rewardInfo}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
