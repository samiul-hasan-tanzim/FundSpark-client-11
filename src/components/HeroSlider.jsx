"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Poppins, Inter } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { slides } from "@/lib/homeData";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <section className="relative h-screen min-h-[650px]">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    renderBullet: (_, className) =>
                        `<span class="${className} !w-12 !h-1 !rounded-full !transition-all !duration-700"></span>`,
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full h-full"
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <SlideContent
                            slide={slide}
                            index={i}
                            isActive={mounted && activeIndex === i}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent animate-scroll-line" />
                <span className="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase">Scroll</span>
            </div>

            <style jsx>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    33% { transform: translate(15px, -15px) rotate(2deg); }
                    66% { transform: translate(-10px, -5px) rotate(-1deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
                    33% { transform: translate(-12px, -18px) rotate(-2deg); }
                    66% { transform: translate(8px, -8px) rotate(1deg); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    50% { transform: translate(10px, -20px) scale(1.05); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUpSub {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
                    to { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes lineGrow {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                @keyframes scrollLine {
                    0% { transform: scaleY(0); transform-origin: top; }
                    50% { transform: scaleY(1); transform-origin: top; }
                    51% { transform: scaleY(1); transform-origin: bottom; }
                    100% { transform: scaleY(0); transform-origin: bottom; }
                }
                @keyframes noise {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-float1 { animation: float1 8s ease-in-out infinite; }
                .animate-float2 { animation: float2 10s ease-in-out infinite; }
                .animate-float3 { animation: float3 12s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 30s linear infinite; }
                .animate-scroll-line { animation: scrollLine 2s ease-in-out infinite; }
                .animate-slide-up { animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slide-up-sub { animation: slideUpSub 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
                .animate-slide-up-btns { animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
                .animate-scale-in { animation: scaleIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards; opacity: 0; }
                .animate-line-grow { animation: lineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; transform-origin: left; transform: scaleX(0); }
                .animate-noise { animation: noise 0.5s steps(5) infinite; }
            `}</style>
        </section>
    );
}

const FloatingOrb = ({ className, size, blur, children }) => (
    <div className={`absolute rounded-full ${className}`} style={{ width: size, height: size, filter: `blur(${blur})` }}>
        {children}
    </div>
);

const SlideContent = ({ slide, index, isActive }) => (
    <div className={`relative w-full h-full bg-gradient-to-br ${slide.color} flex items-center overflow-hidden`}>
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-60">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_40%_80%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-noise">
            <div className="w-[200%] h-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgLz48L3N2Zz4=')] bg-repeat" />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FloatingOrb className="top-[10%] -left-[5%] animate-float1" size="500px" blur="120px">
                <div className="w-full h-full rounded-full bg-white/[0.06]" />
            </FloatingOrb>
            <FloatingOrb className="top-[50%] -right-[10%] animate-float2" size="400px" blur="100px">
                <div className="w-full h-full rounded-full bg-white/[0.05]" />
            </FloatingOrb>
            <FloatingOrb className="bottom-[5%] left-[20%] animate-float3" size="300px" blur="80px">
                <div className="w-full h-full rounded-full bg-white/[0.04]" />
            </FloatingOrb>

            {/* Floating geometric shapes */}
            <div className="absolute top-[18%] right-[12%] animate-float1" style={{ animationDelay: "-2s" }}>
                <div className="w-16 h-16 border border-white/10 rounded-[20px] rotate-12 backdrop-blur-sm bg-white/[0.02]" />
            </div>
            <div className="absolute bottom-[25%] left-[6%] animate-float2" style={{ animationDelay: "-4s" }}>
                <div className="w-10 h-10 border border-white/[0.08] rounded-full backdrop-blur-sm" />
            </div>
            <div className="absolute top-[35%] right-[5%] animate-float3" style={{ animationDelay: "-1s" }}>
                <div className="w-6 h-6 bg-white/[0.06] rounded-md rotate-45" />
            </div>
            <div className="absolute top-[60%] right-[25%] animate-float1" style={{ animationDelay: "-3s" }}>
                <div className="w-14 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            </div>

            {/* Animated ring */}
            <div className="absolute top-[15%] right-[20%] animate-spin-slow">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="0.5" strokeDasharray="8 12" opacity="0.08" />
                    <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="0.3" strokeDasharray="4 16" opacity="0.05" />
                </svg>
            </div>

            {/* Grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id={`grid-${index}`} width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill={`url(#grid-${index})`} />
            </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left column */}
                <div className="max-w-xl">
                    {/* Icon + badge */}
                    <div className={`flex items-center gap-4 mb-8 ${isActive ? "animate-scale-in" : "opacity-0"}`}>
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-[18px] flex items-center justify-center border border-white/10 shadow-lg shadow-black/5">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={slide.graphic} />
                            </svg>
                        </div>
                        <div className="h-7 px-4 flex items-center bg-white/10 backdrop-blur-2xl rounded-full border border-white/10">
                            <span className={`text-[11px] font-semibold text-white/80 tracking-wider uppercase ${inter.className}`}>FundSpark Platform</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className={`text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-2 ${poppins.className} ${isActive ? "animate-slide-up" : "opacity-0"}`}>
                        {slide.title.split(" ").map((word, wi, arr) =>
                            wi === arr.length - 1 ? (
                                <span key={wi} className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">{word}</span>
                            ) : (
                                <span key={wi}>{word} </span>
                            )
                        )}
                    </h1>

                    {/* Accent line */}
                    <div className={`w-24 h-[3px] bg-gradient-to-r from-white/60 via-white/30 to-transparent rounded-full mb-6 ${isActive ? "animate-line-grow" : "opacity-0"}`} />

                    {/* Subtitle */}
                    <p className={`text-base md:text-lg text-white/60 leading-relaxed max-w-lg mb-10 ${inter.className} ${isActive ? "animate-slide-up-sub" : "opacity-0"}`}>
                        {slide.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className={`flex flex-wrap gap-4 ${isActive ? "animate-slide-up-btns" : "opacity-0"}`}>
                        <Link
                            href={index === 1 ? "/explore" : "/register"}
                            className="group relative px-9 py-4 rounded-full bg-white text-gray-900 font-semibold text-sm shadow-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {slide.cta}
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                        </Link>
                        <Link
                            href={index === 1 ? "/explore" : "/#how-it-works"}
                            className="group px-9 py-4 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 backdrop-blur-sm"
                        >
                            <span className="flex items-center gap-2">
                                Learn More
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className={`flex items-center gap-6 mt-12 ${isActive ? "animate-slide-up-btns" : "opacity-0"}`}>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((a) => (
                                <div key={a} className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <span className={`text-[10px] font-bold text-white/70 ${inter.className}`}>
                                        {String.fromCharCode(64 + a)}
                                    </span>
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                <span className={`text-[10px] font-bold text-white/80 ${inter.className}`}>+</span>
                            </div>
                        </div>
                        <div>
                            <p className={`text-xs font-semibold text-white/80 ${inter.className}`}>Trusted by 5,000+ creators</p>
                            <p className={`text-[10px] text-white/40 ${inter.className}`}>Join the community today</p>
                        </div>
                    </div>
                </div>

                {/* Right column - decorative */}
                <div className={`hidden lg:flex flex-col items-end gap-8 ${isActive ? "animate-slide-up-btns" : "opacity-0"}`}>
                    {/* Stats cards */}
                    <div className="flex flex-col gap-4 w-64">
                        {[
                            { value: "10,000+", label: "Active Campaigns", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                            { value: "50,000+", label: "Community Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
                            { value: "$2.5M+", label: "Total Funding Raised", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                        ].map((stat, si) => (
                            <div key={si} className="group relative">
                                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500" />
                                <div className="relative flex items-center gap-4 bg-white/[0.06] backdrop-blur-2xl rounded-2xl px-5 py-4 border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`text-lg font-bold text-white ${poppins.className}`}>{stat.value}</p>
                                        <p className={`text-[11px] text-white/40 tracking-wide ${inter.className}`}>{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom decoration */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
                        <span className={`text-[10px] text-white/30 tracking-[0.2em] uppercase ${inter.className}`}>#1 Crowdfunding Platform</span>
                        <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
);
