"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";
import { authClient } from "@/lib/auth-client";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

function Skeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-96 bg-gray-200 rounded-2xl" />
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-64 bg-gray-200 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default function CampaignDetailsPage() {
    const params = useParams();
    const { data: session } = authClient.useSession();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const [contributionAmount, setContributionAmount] = useState("");
    const [contributing, setContributing] = useState(false);
    const [contributeError, setContributeError] = useState("");
    const [contributeSuccess, setContributeSuccess] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reporting, setReporting] = useState(false);
    const [reportError, setReportError] = useState("");
    const [reportSuccess, setReportSuccess] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/${params.id}`)
            .then(r => r.json())
            .then(data => { setCampaign(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [params.id]);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${session.user.email}` }
        })
            .then(r => r.json())
            .then(data => setProfile(data))
            .catch(() => {});
    }, [session]);

    const handleContribute = async (e) => {
        e.preventDefault();
        setContributeError("");
        setContributeSuccess(false);
        const amount = Number(contributionAmount);
        if (!amount || amount <= 0) {
            setContributeError("Enter a valid contribution amount");
            return;
        }
        if (campaign.minimumContribution && amount < campaign.minimumContribution) {
            setContributeError(`Minimum contribution is ${campaign.minimumContribution} credits`);
            return;
        }
        if (profile && amount > profile.credits) {
            setContributeError("You don't have enough credits");
            return;
        }
        setContributing(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/contribute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.email}`,
                },
                body: JSON.stringify({ campaignId: params.id, contributionAmount: amount }),
            });
            const data = await res.json();
            if (!res.ok) {
                setContributeError(data.message || "Contribution failed");
            } else {
                setContributeSuccess(true);
                setContributionAmount("");
                setProfile(prev => prev ? { ...prev, credits: prev.credits - amount } : prev);
                setCampaign(prev => prev ? { ...prev, raisedAmount: (prev.raisedAmount || 0) + amount } : prev);
            }
        } catch {
            setContributeError("Network error. Please try again.");
        }
        setContributing(false);
    };

    const handleReport = async (e) => {
        e.preventDefault();
        setReportError("");
        setReportSuccess(false);
        if (!reportReason.trim()) {
            setReportError("Please enter a reason");
            return;
        }
        setReporting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reports/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.email}`,
                },
                body: JSON.stringify({ campaignId: params.id, reason: reportReason }),
            });
            const data = await res.json();
            if (!res.ok) {
                setReportError(data.message || "Failed to submit report");
            } else {
                setReportSuccess(true);
                setReportReason("");
                setTimeout(() => setShowReportModal(false), 1500);
            }
        } catch {
            setReportError("Network error. Please try again.");
        }
        setReporting(false);
    };

    if (loading) return <Skeleton />;
    if (!campaign) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${poppins.className}`}>Campaign Not Found</h2>
                <p className={`text-gray-500 mb-6 ${inter.className}`}>This campaign does not exist or has been removed.</p>
                <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-2xl font-medium hover:bg-[#4338CA] transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Explore
                </Link>
            </div>
        );
    }

    const daysLeft = campaign.deadline
        ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
        : null;
    const progress = Math.min(100, ((campaign.raisedAmount || 0) / (campaign.fundingGoal || 1)) * 100);

    return (
        <div>
            {/* Breadcrumb header */}
            <div className="bg-gradient-to-br from-[#4F46E5] via-[#5B52E8] to-[#7C3AED] pt-28 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className={`text-sm font-medium ${inter.className}`}>Back to Explore</span>
                    </Link>
                    <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight ${poppins.className}`}>
                        {campaign.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/10">
                            {campaign.category || "General"}
                        </span>
                        {daysLeft !== null && (
                            <span className={`text-sm text-white/80 ${inter.className}`}>
                                {daysLeft === 0 ? "Ending today" : `${daysLeft} days left`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Campaign image */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            {campaign.image ? (
                                <img src={campaign.image} alt={campaign.title} className="w-full h-72 md:h-96 object-cover" />
                            ) : (
                                <div className="w-full h-72 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Story */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
                            <h2 className={`text-xl font-bold text-gray-900 mb-4 ${poppins.className}`}>Story</h2>
                            <div className={`text-gray-600 leading-relaxed whitespace-pre-line ${inter.className}`}>
                                {campaign.story || "No story provided."}
                            </div>
                        </div>

                        {/* Rewards */}
                        {campaign.rewardInfo && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
                                <h2 className={`text-xl font-bold text-gray-900 mb-4 ${poppins.className}`}>Rewards</h2>
                                <div className={`text-gray-600 leading-relaxed whitespace-pre-line ${inter.className}`}>
                                    {campaign.rewardInfo}
                                </div>
                            </div>
                        )}

                        {/* Creator info */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
                            <h2 className={`text-xl font-bold text-gray-900 mb-4 ${poppins.className}`}>About the Creator</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-xl font-bold shrink-0">
                                    {(campaign.creatorName?.[0] || "C").toUpperCase()}
                                </div>
                                <div>
                                    <p className={`text-lg font-semibold text-gray-900 ${poppins.className}`}>
                                        {campaign.creatorName || "Anonymous"}
                                    </p>
                                    <p className={`text-sm text-gray-500 ${inter.className}`}>
                                        {campaign.creatorEmail || ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Contribution panel */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-28">
                            {/* Funding progress */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-2xl font-bold text-gray-900 ${poppins.className}`}>
                                        {campaign.raisedAmount || 0} <span className="text-sm font-normal text-gray-500">credits</span>
                                    </span>
                                    <span className={`text-sm font-medium text-gray-500 ${inter.className}`}>
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs text-gray-400 ${inter.className}`}>
                                        Goal: {campaign.fundingGoal || 0} credits
                                    </span>
                                    {campaign.minimumContribution > 0 && (
                                        <span className={`text-xs text-gray-400 ${inter.className}`}>
                                            Min: {campaign.minimumContribution} credits
                                        </span>
                                    )}
                                </div>
                            </div>

                            {session ? (
                                contributeSuccess ? (
                                    <div className="text-center py-6">
                                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className={`text-emerald-600 font-semibold ${poppins.className}`}>Contribution Submitted!</p>
                                        <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Your contribution is pending approval.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContribute}>
                                        {/* Available credits */}
                                        <div className="flex items-center justify-between mb-4 p-3 bg-indigo-50 rounded-xl">
                                            <span className={`text-sm text-gray-600 ${inter.className}`}>Available Credits</span>
                                            <span className={`text-lg font-bold text-[#4F46E5] ${poppins.className}`}>
                                                {profile?.credits ?? "..."}
                                            </span>
                                        </div>

                                        {/* Contribution input */}
                                        <div className="mb-4">
                                            <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${inter.className}`}>
                                                Contribution Amount
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={contributionAmount}
                                                    onChange={(e) => setContributionAmount(e.target.value)}
                                                    placeholder="Enter credits"
                                                    min={campaign.minimumContribution || 1}
                                                    className={`w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all ${inter.className}`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">credits</span>
                                            </div>
                                        </div>

                                        {contributeError && (
                                            <p className={`text-sm text-red-500 mb-3 ${inter.className}`}>{contributeError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={contributing}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all"
                                        >
                                            {contributing ? "Processing..." : "Contribute Now"}
                                        </button>
                                    </form>
                                )
                            ) : (
                                <div className="text-center py-6">
                                    <p className={`text-sm text-gray-500 mb-4 ${inter.className}`}>Sign in to contribute to this campaign.</p>
                                    <Link
                                        href="/login"
                                        className="inline-block w-full py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-center"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Deadline */}
                            {daysLeft !== null && (
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className={inter.className}>
                                            {daysLeft === 0 ? "Campaign ends today" : `Campaign ends in ${daysLeft} days`}
                                        </span>
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-0.5 ml-6 ${inter.className}`}>
                                        {new Date(campaign.deadline).toLocaleDateString("en-US", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Report campaign */}
                        {session && (
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="w-full py-3 bg-white border border-red-200 text-red-500 rounded-2xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                                Report Campaign
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-bold text-gray-900 ${poppins.className}`}>Report Campaign</h3>
                            <button onClick={() => { setShowReportModal(false); setReportError(""); setReportSuccess(false); }} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {reportSuccess ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className={`text-emerald-600 font-semibold ${poppins.className}`}>Report Submitted</p>
                                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Our team will review this campaign.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleReport}>
                                <p className={`text-sm text-gray-600 mb-4 ${inter.className}`}>
                                    Why are you reporting this campaign?
                                </p>
                                <textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Describe the issue..."
                                    rows={4}
                                    className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all resize-none ${inter.className}`}
                                />
                                {reportError && (
                                    <p className={`text-sm text-red-500 mt-2 ${inter.className}`}>{reportError}</p>
                                )}
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowReportModal(false); setReportError(""); }}
                                        className={`flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all ${inter.className}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={reporting}
                                        className={`flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-all ${inter.className}`}
                                    >
                                        {reporting ? "Submitting..." : "Submit Report"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
