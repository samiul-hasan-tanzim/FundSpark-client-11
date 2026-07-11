"use client";
import { useState } from "react";
import { Inter, Poppins } from "next/font/google";
import { categories } from "@/lib/homeData";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_raised", label: "Most Raised" },
    { value: "least_raised", label: "Least Raised" },
    { value: "deadline", label: "Ending Soon" },
];

export default function ExploreFilters({ search, onSearchChange, category, onCategoryChange, sort, onSortChange }) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <div className="space-y-5">
            {/* Search + Sort bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search campaigns..."
                        className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all ${inter.className}`}
                    />
                    {search && (
                        <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value)}
                            className={`appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all cursor-pointer ${inter.className}`}
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Category filters - desktop */}
            <div className="hidden lg:flex flex-wrap gap-2">
                <button
                    onClick={() => onCategoryChange("")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${inter.className} ${!category ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20" : "bg-white border border-gray-200 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5]"}`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => onCategoryChange(cat.name)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${inter.className} ${category === cat.name ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20" : "bg-white border border-gray-200 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5]"}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Category filters - mobile */}
            {showMobileFilters && (
                <div className="lg:hidden flex flex-wrap gap-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-lg">
                    <button
                        onClick={() => { onCategoryChange(""); setShowMobileFilters(false); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${inter.className} ${!category ? "bg-[#4F46E5] text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => { onCategoryChange(cat.name); setShowMobileFilters(false); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${inter.className} ${category === cat.name ? "bg-[#4F46E5] text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
