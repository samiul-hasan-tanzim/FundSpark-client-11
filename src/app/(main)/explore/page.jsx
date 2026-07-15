"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ExploreFilters from "@/components/ExploreFilters";
import ExploreCard, { ExploreCardSkeleton } from "@/components/ExploreCard";
import FadeIn from "@/components/FadeIn";

const PER_PAGE = 9;

export default function ExplorePage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("most_funded");
    const [statusFilter, setStatusFilter] = useState([]);
    const [goalMin, setGoalMin] = useState(0);
    const [goalMax, setGoalMax] = useState(100000000);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => { setCampaigns(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let result = [...campaigns];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.title?.toLowerCase().includes(q) ||
                c.creatorName?.toLowerCase().includes(q) ||
                c.story?.toLowerCase().includes(q)
            );
        }

        if (category) {
            result = result.filter(c => c.category === category);
        }

        if (statusFilter.length > 0) {
            result = result.filter(c => {
                const raised = c.raisedAmount || 0;
                const goal = c.fundingGoal || 1;
                const pct = (raised / goal) * 100;
                const deadline = c.deadline ? new Date(c.deadline) : null;
                const daysLeft = deadline ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)) : 999;
                const expired = deadline && deadline < new Date();

                const matches = [];
                if (statusFilter.includes("fully_funded") && pct >= 100) matches.push(true);
                if (statusFilter.includes("in_progress") && pct < 100 && !expired) matches.push(true);
                if (statusFilter.includes("ending_soon") && daysLeft <= 7 && daysLeft > 0 && !expired) matches.push(true);

                return matches.length > 0;
            });
        }

        result = result.filter(c => {
            const g = c.fundingGoal || 0;
            return g >= goalMin && g <= goalMax;
        });

        switch (sort) {
            case "most_funded": result.sort((a, b) => (b.raisedAmount || 0) - (a.raisedAmount || 0)); break;
            case "newest": result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
            case "ending_soon": result.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0)); break;
            case "smallest_goals": result.sort((a, b) => (a.fundingGoal || 0) - (b.fundingGoal || 0)); break;
        }

        return result;
    }, [campaigns, search, category, sort, statusFilter, goalMin, goalMax]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const resetFilters = useCallback(() => {
        setCategory("");
        setSearch("");
        setStatusFilter([]);
        setGoalMin(0);
        setGoalMax(100000000);
        setPage(1);
    }, []);

    const goToPage = useCallback((p) => {
        if (p >= 1 && p <= totalPages) setPage(p);
    }, [totalPages]);

    useEffect(() => { setPage(1); }, [search, category, sort, statusFilter, goalMin, goalMax]);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);
            if (page <= 3) { start = 2; end = Math.min(maxVisible, totalPages - 1); }
            if (page >= totalPages - 2) { start = Math.max(2, totalPages - maxVisible + 1); end = totalPages - 1; }
            if (start > 2) pages.push("...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div>
            {/* Hero Search Section */}
            <FadeIn>
                <section className="mb-16 pt-24">
                    <div className="max-w-7xl mx-auto px-5">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex-1 max-w-2xl">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Discover Innovation</h1>
                                <p className="text-lg text-slate-500 mb-6">Support the creators building the future of technology, community, and health.</p>
                                <div className="relative group">
                                    <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-700 transition-colors" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search projects, creators, or categories..."
                                        className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-200 transition-all text-base placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="bg-white border-none rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-indigo-200 cursor-pointer text-sm font-semibold text-slate-700"
                                >
                                    <option value="most_funded">Most Funded</option>
                                    <option value="newest">Recently Added</option>
                                    <option value="ending_soon">Ending Soon</option>
                                    <option value="smallest_goals">Smallest Goals</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>

            {/* Main Content */}
            <FadeIn delay={0.1}>
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <ExploreFilters
                        category={category}
                        onCategoryChange={setCategory}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        goalMin={goalMin}
                        goalMax={goalMax}
                        onGoalMinChange={setGoalMin}
                        onGoalMaxChange={setGoalMax}
                        onReset={resetFilters}
                    />

                    {/* Campaign Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <ExploreCardSkeleton key={i} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <Search size={64} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">No campaigns found</h3>
                                <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paged.map((c) => <ExploreCard key={c._id} campaign={c} />)}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-2">
                                        <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-300 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <ChevronLeft size={20} className="text-slate-500" />
                                        </button>
                                        {getPageNumbers().map((p, i) =>
                                            p === "..." ? (
                                                <span key={`ellipsis-${i}`} className="text-slate-400 px-2 select-none">...</span>
                                            ) : (
                                                <button key={p} type="button" onClick={() => goToPage(p)} className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-colors ${p === page ? "bg-indigo-700 text-white" : "hover:bg-white text-slate-700"}`}>{p}</button>
                                            )
                                        )}
                                        <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-300 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                            <ChevronRight size={20} className="text-slate-500" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            </FadeIn>
        </div>
    );
}
