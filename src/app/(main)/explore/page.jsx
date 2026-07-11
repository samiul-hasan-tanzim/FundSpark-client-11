"use client";
import { useState, useEffect, useMemo } from "react";
import { Poppins, Inter } from "next/font/google";
import ExploreFilters from "@/components/ExploreFilters";
import ExploreCard, { ExploreCardSkeleton } from "@/components/ExploreCard";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function ExplorePage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns`)
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

        switch (sort) {
            case "newest": result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
            case "oldest": result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)); break;
            case "most_raised": result.sort((a, b) => (b.raisedAmount || 0) - (a.raisedAmount || 0)); break;
            case "least_raised": result.sort((a, b) => (a.raisedAmount || 0) - (b.raisedAmount || 0)); break;
            case "deadline": result.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0)); break;
        }

        return result;
    }, [campaigns, search, category, sort]);

    return (
        <div>
            {/* Hero header */}
            <div className="bg-gradient-to-br from-[#4F46E5] via-[#5B52E8] to-[#7C3AED] pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-[16px] flex items-center justify-center border border-white/10 mb-5">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 ${poppins.className}`}>
                            Explore Campaigns
                        </h1>
                        <p className={`text-base md:text-lg text-white/70 max-w-xl ${inter.className}`}>
                            Discover innovative projects and support creators who are making a difference.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5">
                    <ExploreFilters
                        search={search}
                        onSearchChange={setSearch}
                        category={category}
                        onCategoryChange={setCategory}
                        sort={sort}
                        onSortChange={setSort}
                    />
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                    <p className={`text-sm text-gray-500 ${inter.className}`}>
                        {loading ? "Loading..." : `${filtered.length} campaign${filtered.length !== 1 ? "s" : ""} found`}
                    </p>
                    {(search || category) && (
                        <button
                            onClick={() => { setSearch(""); setCategory(""); }}
                            className={`text-sm text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors ${inter.className}`}
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <ExploreCardSkeleton key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${poppins.className}`}>No campaigns found</h3>
                        <p className={`text-sm text-gray-500 ${inter.className}`}>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((c) => <ExploreCard key={c._id} campaign={c} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
