"use client";
import { Monitor, HeartPulse, Users, Leaf, Palette } from "lucide-react";

const categories = [
    { name: "Technology", icon: Monitor, count: 124 },
    { name: "Health", icon: HeartPulse, count: 82 },
    { name: "Community", icon: Users, count: 56 },
    { name: "Sustainability", icon: Leaf, count: 43 },
    { name: "Creative Arts", icon: Palette, count: 91 },
];

const statusFilters = [
    { value: "fully_funded", label: "Fully Funded" },
    { value: "in_progress", label: "In Progress" },
    { value: "ending_soon", label: "Ending Soon" },
];

export default function ExploreFilters({
    category, onCategoryChange,
    statusFilter, onStatusFilterChange,
    goalMin, goalMax, onGoalMinChange, onGoalMaxChange,
    onReset,
}) {
    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Categories</h3>
                <div className="space-y-1">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const active = category === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => onCategoryChange(active ? "" : cat.name)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                    active
                                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                                        : "text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon size={20} />
                                    <span className="text-sm">{cat.name}</span>
                                </span>
                                <span className="text-xs">{cat.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Funding Status */}
            <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Funding Status</h3>
                <div className="space-y-3">
                    {statusFilters.map((s) => (
                        <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={statusFilter.includes(s.value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onStatusFilterChange([...statusFilter, s.value]);
                                    } else {
                                        onStatusFilterChange(statusFilter.filter(v => v !== s.value));
                                    }
                                }}
                                className="rounded text-indigo-700 focus:ring-indigo-200 border-slate-300 w-5 h-5"
                            />
                            <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">{s.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Goal Range */}
            <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Goal Range</h3>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-1 block">Min</label>
                            <input
                                type="number"
                                min="0"
                                max="100000000"
                                value={goalMin}
                                onChange={(e) => onGoalMinChange(Number(e.target.value))}
                                placeholder="$0"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-700 transition-all"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-1 block">Max</label>
                            <input
                                type="number"
                                min="0"
                                max="100000000"
                                value={goalMax}
                                onChange={(e) => onGoalMaxChange(Number(e.target.value))}
                                placeholder="$100M"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-700 transition-all"
                            />
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="100000"
                        value={goalMax}
                        onChange={(e) => onGoalMaxChange(Number(e.target.value))}
                        className="w-full accent-indigo-700 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between">
                        <span className="text-xs font-semibold text-slate-400">$0</span>
                        <span className="text-xs font-semibold text-slate-400">$100M</span>
                    </div>
                </div>
            </div>

            {/* Reset */}
            <div className="pt-4">
                <button
                    onClick={onReset}
                    className="w-full py-3 border border-slate-300 rounded-full text-sm font-semibold text-slate-500 hover:bg-white transition-all shadow-sm"
                >
                    Reset All Filters
                </button>
            </div>
        </aside>
    );
}
