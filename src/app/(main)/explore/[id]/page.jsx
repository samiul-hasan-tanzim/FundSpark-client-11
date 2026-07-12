"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import CampaignHero from "@/components/CampaignHero";
import CampaignStory from "@/components/CampaignStory";
import RewardsSection from "@/components/RewardsSection";
import CreatorCard from "@/components/CreatorCard";
import ContributionPanel from "@/components/ContributionPanel";
import ShareActions from "@/components/ShareActions";
import ReportModal from "@/components/ReportModal";
import ContributionSuccessModal from "@/components/ContributionSuccessModal";

function Skeleton() {
    return (
        <div className="max-w-7xl mx-auto px-5 pt-28 pb-16 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-96 bg-slate-200 rounded-[24px]" />
                    <div className="space-y-3">
                        <div className="h-8 bg-slate-200 rounded w-2/3" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-80 bg-slate-200 rounded-[24px]" />
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
    const [creatorUser, setCreatorUser] = useState(null);
    const [hasPendingContribution, setHasPendingContribution] = useState(false);
    const [showContributeSuccess, setShowContributeSuccess] = useState(false);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const campaignDeadline = campaign?.deadline ? new Date(campaign.deadline) : null;
    const expired = campaignDeadline && campaignDeadline < now;

    const timeAgo = (date) => {
        const diff = now - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

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
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/${params.id}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                setCampaign(data);
                setLoading(false);
                if (data.creatorEmail) {
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/public/${encodeURIComponent(data.creatorEmail)}`, { cache: 'no-store' })
                        .then(r => r.json())
                        .then(u => { if (!u.error) setCreatorUser(u); })
                        .catch(() => {});
                }
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    useEffect(() => {
        if (!session?.user?.email || !params.id) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/contributions/my?page=1&limit=50`, {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${session.user.email}` },
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const pending = data.find(c => c.campaignId === params.id && c.status === 'pending');
                    if (pending) setHasPendingContribution(true);
                }
            })
            .catch(() => {});
    }, [session, params.id]);

    useEffect(() => {
        if (!session?.user?.email) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`, {
            cache: 'no-store', headers: { Authorization: `Bearer ${session.user.email}` }
        })
            .then(r => r.json())
            .then(data => setProfile(data))
            .catch(() => { });
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
                setHasPendingContribution(true);
                setShowContributeSuccess(true);
                toast.success("Contribution submitted successfully!");
                setContributionAmount("");
                setProfile(prev => prev ? { ...prev, credits: prev.credits - amount } : prev);
                fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/${params.id}`, { cache: 'no-store' })
                    .then(r => r.json())
                    .then(data => { if (data) setCampaign(data); })
                    .catch(() => { });
            }
        } catch {
            toast.error("Network error. Please try again.");
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
                toast.success("Report submitted. Our team will review it.");
                setReportReason("");
                setTimeout(() => setShowReportModal(false), 1500);
            }
        } catch {
            toast.error("Network error. Please try again.");
        }
        setReporting(false);
    };

    if (loading) return <Skeleton />;
    if (!campaign) {
        return (
            <div className="max-w-7xl mx-auto px-5 pt-28 pb-16 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Not Found</h2>
                <p className="text-slate-500 mb-6">This campaign does not exist or has been removed.</p>
                <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-700/20">
                    <ArrowLeft size={16} />
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
        <div className="bg-[#F8FAFC] min-h-screen">
            <main className="pt-24 pb-16 px-5 max-w-7xl mx-auto">
                <Link href="/explore" className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 transition-colors mb-6 text-sm font-semibold">
                    <ArrowLeft size={16} />
                    Back to Explore
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <CampaignHero campaign={campaign} />
                        <CampaignStory campaign={campaign} />
                        <RewardsSection campaign={campaign} />
                        <CreatorCard campaign={campaign} creatorImage={creatorUser?.image} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 flex flex-col gap-4">
                            <ContributionPanel
                                campaign={campaign}
                                profile={profile}
                                session={session}
                                now={now}
                                campaignDeadline={campaignDeadline}
                                expired={expired}
                                daysLeft={daysLeft}
                                progress={progress}
                                contributionAmount={contributionAmount}
                                setContributionAmount={setContributionAmount}
                                contributeError={contributeError}
                                contributeSuccess={contributeSuccess}
                                contributing={contributing}
                                handleContribute={handleContribute}
                                timeAgo={timeAgo}
                                hasPendingContribution={hasPendingContribution}
                            />
                            <ShareActions session={session} onReport={() => setShowReportModal(true)} />
                        </div>
                    </div>
                </div>
            </main>

            <ContributionSuccessModal
                show={showContributeSuccess}
                onClose={() => setShowContributeSuccess(false)}
            />
            <ReportModal
                show={showReportModal}
                onClose={() => { setShowReportModal(false); setReportError(""); setReportReason(""); setReportSuccess(false); }}
                reportReason={reportReason}
                setReportReason={setReportReason}
                reportError={reportError}
                reportSuccess={reportSuccess}
                reporting={reporting}
                handleReport={handleReport}
            />
        </div>
    );
}
