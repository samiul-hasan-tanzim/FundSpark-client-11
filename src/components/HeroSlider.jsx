"use client";

import Image from "next/image";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

const HeroSlider = () => {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background Blur */}
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-400/10 blur-[120px]" />

            <div className="max-w-7xl mx-auto px-5">
                <div className="grid items-center gap-14 lg:grid-cols-2">

                    {/* Left Content */}
                    <div className="space-y-8">

                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                            ✨ Visionary Tech
                        </div>

                        <h1 className="max-w-2xl text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                            Empower{" "}
                            <span className="bg-gradient-to-r from-indigo-700 to-violet-500 bg-clip-text text-transparent">
                                Innovative Ideas
                            </span>{" "}
                            That Change The World
                        </h1>

                        <p className="max-w-xl text-lg leading-8 text-slate-600">
                            Join a global network of creators and supporters
                            turning breakthrough ideas into reality through
                            transparent funding and community support.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row">

                            <button className="group flex items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:shadow-2xl">
                                Launch Your Idea
                                <ArrowRight
                                    size={18}
                                    className="transition group-hover:translate-x-1"
                                />
                            </button>

                            <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-800 shadow-sm backdrop-blur-xl transition hover:bg-slate-50">
                                <Play size={18} />
                                Watch Trailer
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid max-w-lg grid-cols-3 gap-6 pt-6">

                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    5.2K+
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Projects Funded
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    $850M
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Total Raised
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    120K+
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Backers
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="relative">

                        {/* Glow Border */}
                        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-indigo-600 to-violet-500 opacity-20 blur-2xl" />

                        {/* Main Card */}
                        <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 p-2 shadow-2xl backdrop-blur-xl">

                            <Image
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                                alt="Hero"
                                width={1200}
                                height={800}
                                className="h-[500px] w-full rounded-[28px] object-cover"
                            />

                            {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-xl">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                        <TrendingUp
                                            className="text-emerald-600"
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Live Funding
                                        </p>

                                        <h4 className="text-lg font-bold text-slate-900">
                                            $1.2M Raised
                                        </h4>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -right-5 top-10 rounded-full bg-white px-5 py-3 shadow-xl">
                            <span className="text-sm font-semibold text-slate-800">
                                🚀 5000+ Startups
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;