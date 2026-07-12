import Image from "next/image";
import { Verified } from "lucide-react";

export default function CampaignHero({ campaign }) {
    return (
        <section className="flex flex-col gap-4">
            <div className="w-full aspect-video rounded-[24px] overflow-hidden shadow-lg bg-slate-100 relative">
                {campaign.image ? (
                    <Image src={campaign.image} alt={campaign.title} fill className="object-cover" unoptimized />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1">
                {(campaign.category) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100/60 text-emerald-800 rounded-full text-xs font-bold tracking-wider w-fit">
                        <Verified size={14} />
                        {(campaign.category).toUpperCase()}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{campaign.title}</h1>
                <p className="text-lg text-slate-500 max-w-2xl">{campaign.story ? campaign.story.split("\n")[0] : "No description available."}</p>
            </div>
        </section>
    );
}
