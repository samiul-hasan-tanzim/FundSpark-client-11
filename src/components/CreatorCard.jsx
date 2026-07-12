import Image from "next/image";
import { Mail } from "lucide-react";

export default function CreatorCard({ campaign, creatorImage }) {
    return (
        <section className="bg-slate-50 p-6 rounded-[24px] border border-slate-200/50 flex flex-col md:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-indigo-700 to-violet-600 flex items-center justify-center text-white text-2xl font-bold relative">
                {creatorImage ? (
                    <Image src={creatorImage} alt={campaign.creatorName} fill className="object-cover" unoptimized />
                ) : (
                    (campaign.creatorName?.[0] || "C").toUpperCase()
                )}
            </div>
            <div className="flex flex-col gap-1 flex-grow text-center md:text-left">
                <h4 className="font-semibold text-slate-900">{campaign.creatorName || "Anonymous"}</h4>
                <p className="text-sm text-slate-500">{campaign.creatorEmail || "Creator"}</p>
            </div>
            <button
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-200/70 border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-300/70 transition-colors flex items-center gap-2"
            >
                <Mail size={16} />
                Contact Creator
            </button>
        </section>
    );
}
