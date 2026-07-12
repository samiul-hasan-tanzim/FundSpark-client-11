import { CheckCircle, Heart, ArrowRight, X } from "lucide-react";

export default function ContributionSuccessModal({ show, onClose }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-[24px] p-8 w-full max-w-md shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={44} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Contribution Submitted!</h3>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    Thank you for your support! Your contribution is now pending the creator's review. 
                    Once approved, the progress bar will update automatically. 
                    If the creator rejects your contribution, your credits will be refunded in full.
                </p>
                <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left space-y-2">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Heart size={14} className="text-indigo-700" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-indigo-900">What happens next?</p>
                            <p className="text-xs text-indigo-600">The creator will review your contribution within a few days.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle size={14} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-900">Approved</p>
                            <p className="text-xs text-emerald-600">Your contribution is confirmed and the campaign progress updates.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                            <ArrowRight size={14} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-amber-900">Rejected</p>
                            <p className="text-xs text-amber-600">Your credits will be returned to your wallet automatically.</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-600 text-white font-bold text-base shadow-lg hover:shadow-indigo-700/20 transition-all"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
}
