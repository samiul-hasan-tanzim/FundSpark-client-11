"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Verified, ChevronLeft, ChevronRight } from "lucide-react";

export default function CampaignHero({ campaign }) {
    const images = campaign.images?.length > 0 ? campaign.images : (campaign.image ? [campaign.image] : []);
    const [index, setIndex] = useState(0);

    const prev = useCallback(() => setIndex(i => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
    const next = useCallback(() => setIndex(i => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(next, 4000);
        return () => clearInterval(t);
    }, [next, images.length]);

    return (
        <section className="flex flex-col gap-4">
            <div className="w-full aspect-video rounded-[24px] overflow-hidden shadow-lg bg-slate-100 relative group">
                {images.length > 0 ? (
                    <>
                        {images.map((src, i) => (
                            <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}>
                                <Image src={src} alt={`${campaign.title} ${i + 1}`} fill className="object-cover" unoptimized />
                            </div>
                        ))}
                        {images.length > 1 && (
                            <>
                                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                    <ChevronLeft size={20} className="text-slate-700" />
                                </button>
                                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                    <ChevronRight size={20} className="text-slate-700" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, i) => (
                                        <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white w-4" : "bg-white/50"}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setIndex(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === index ? "border-indigo-700 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                            <Image src={src} alt={`${campaign.title} ${i + 1}`} width={80} height={56} className="w-full h-full object-cover" unoptimized />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-1">
                {campaign.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100/60 text-emerald-800 rounded-full text-xs font-bold tracking-wider w-fit">
                        <Verified size={14} />
                        {campaign.category.toUpperCase()}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{campaign.title}</h1>
                <p className="text-lg text-slate-500 max-w-2xl">{campaign.story ? campaign.story.split("\n")[0] : "No description available."}</p>
            </div>
        </section>
    );
}
