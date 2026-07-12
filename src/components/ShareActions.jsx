import { Share2, Heart, Flag } from "lucide-react";

export default function ShareActions({ session, onReport }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <button
                    type="button"
                    className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                    <Share2 size={18} />
                    Share
                </button>
                <button
                    type="button"
                    className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                    <Heart size={18} />
                    Save
                </button>
            </div>
            {session && (
                <button
                    onClick={onReport}
                    type="button"
                    className="w-full py-2 text-slate-400 font-semibold text-sm flex items-center justify-center gap-2 hover:text-red-500 transition-colors opacity-60 hover:opacity-100"
                >
                    <Flag size={16} />
                    Report Campaign
                </button>
            )}
        </div>
    );
}
