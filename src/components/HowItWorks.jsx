"use client";
import { Lightbulb, Users, Rocket, ArrowRight } from "lucide-react";

export default function HowItWorks() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-slate-900">How FundSpark Works</h2>
                        <p className="text-lg text-slate-500 max-w-xl">Transparent, secure, and built for builders. We streamline the path from idea to impact.</p>
                    </div>
                    <a className="group flex items-center gap-1 font-semibold text-indigo-700" href="#">
                        View Detailed Process
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="relative group p-6 rounded-3xl transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Lightbulb size={28} className="text-indigo-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-slate-900">Submit Your Idea</h3>
                        <p className="text-slate-500 leading-relaxed">Present your vision with detailed roadmap, financial goals, and a compelling story for the community.</p>
                    </div>
                    <div className="relative group p-6 rounded-3xl transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users size={28} className="text-emerald-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-slate-900">Gather Momentum</h3>
                        <p className="text-slate-500 leading-relaxed">Engage with early adopters, host virtual sessions, and grow your funding through our social ecosystem.</p>
                    </div>
                    <div className="relative group p-6 rounded-3xl transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5">
                        <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Rocket size={28} className="text-violet-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-slate-900">Launch & Scale</h3>
                        <p className="text-slate-500 leading-relaxed">Withdraw your funds, execute your roadmap, and keep your backers updated on your journey to success.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
