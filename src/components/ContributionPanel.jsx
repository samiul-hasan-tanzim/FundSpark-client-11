import { Clock, CheckCircle, Hourglass } from "lucide-react";

export default function ContributionPanel({
    campaign,
    profile,
    session,
    now,
    campaignDeadline,
    expired,
    daysLeft,
    progress,
    contributionAmount,
    setContributionAmount,
    contributeError,
    contributeSuccess,
    contributing,
    handleContribute,
    timeAgo,
    hasPendingContribution,
}) {
    const deadlineDate = campaign.deadline ? new Date(campaign.deadline) : null;

    return (
        <div className="bg-white p-8 rounded-[24px] shadow-xl border border-slate-200/20 flex flex-col gap-4">
                {/* Available Credits */}
                {session && profile && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">Available Credits</span>
                        <span className="text-2xl font-bold text-slate-900">{profile.credits?.toLocaleString() || "..."}</span>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                        <span className="text-4xl font-bold text-indigo-700">{progress.toFixed(0)}%</span>
                        <span className="text-sm font-semibold text-slate-500">Funded</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-sm text-slate-900 font-semibold">${(campaign.raisedAmount || 0).toLocaleString()} raised</span>
                        <span className="text-sm text-slate-500">of ${(campaign.fundingGoal || 0).toLocaleString()} goal</span>
                    </div>
                </div>

                {/* Time Left */}
                {daysLeft !== null && (
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <Clock size={24} className="text-indigo-700 shrink-0" />
                        <div>
                            <p className="font-semibold text-slate-900">
                                {daysLeft === 0 ? "Last day" : `${daysLeft} days left`}
                            </p>
                            <p className="text-sm text-slate-500">
                                {deadlineDate ? `Campaign ends ${deadlineDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""}
                            </p>
                        </div>
                    </div>
                )}

                {/* Contribute Form */}
                {expired ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Clock size={28} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-bold">Campaign Ended {campaignDeadline && timeAgo(campaignDeadline)}</p>
                        <p className="text-sm text-slate-400 mt-1">This campaign is no longer accepting contributions.</p>
                    </div>
                ) : session ? (
                    hasPendingContribution ? (
                        <div className="text-center py-6">
                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Hourglass size={28} className="text-amber-600" />
                            </div>
                            <p className="text-amber-700 font-bold">Contribution Pending</p>
                            <p className="text-sm text-slate-500 mt-1">You have a pending contribution for this campaign. Wait for the creator to approve or reject it before contributing again.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleContribute} className="flex flex-col gap-3">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">$</span>
                                <input
                                    type="number"
                                    value={contributionAmount}
                                    onChange={(e) => setContributionAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    min={campaign.minimumContribution || 1}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-700 focus:ring-4 focus:ring-indigo-100 text-xl font-bold text-slate-900 transition-all"
                                />
                            </div>

                            {contributeError && (
                                <p className="text-sm text-red-500">{contributeError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={contributing}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-600 text-white font-bold text-base shadow-lg hover:shadow-indigo-700/20 transition-all scale-[0.98] active:scale-95 disabled:opacity-50"
                            >
                                {contributing ? "Processing..." : "Contribute"}
                            </button>

                            {/* Countdown */}
                            {!expired && campaignDeadline && (() => {
                                const diff = campaignDeadline - now;
                                if (diff <= 0) return null;
                                const d = Math.floor(diff / 86400000);
                                const h = Math.floor((diff % 86400000) / 3600000);
                                const m = Math.floor((diff % 3600000) / 60000);
                                const s = Math.floor((diff % 60000) / 1000);
                                return (
                                    <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                                        {[{ v: d, l: 'Days' }, { v: h, l: 'Hrs' }, { v: m, l: 'Mins' }, { v: s, l: 'Secs' }].map(({ v, l }) => (
                                            <div key={l} className="text-center">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-900">{String(v).padStart(2, '0')}</div>
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">{l}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </form>
                    )
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-slate-500 mb-4">Sign in to contribute to this campaign.</p>
                        <a
                            href="/login"
                            className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-600 text-white font-bold text-base shadow-lg hover:shadow-indigo-700/20 transition-all text-center"
                        >
                            Sign In
                        </a>
                    </div>
                )}

                {/* Backers count */}
                <p className="text-sm text-slate-500 text-center">
                    Join {((campaign.backersCount || 0) + 1).toLocaleString()} other backers and help bring this project to life.
                </p>
            </div>
    );
}
