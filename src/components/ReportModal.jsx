import { X, CheckCircle } from "lucide-react";

export default function ReportModal({
    show,
    onClose,
    reportReason,
    setReportReason,
    reportError,
    reportSuccess,
    reporting,
    handleReport,
}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Report Campaign</h3>
                    <button onClick={() => { onClose(); }} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {reportSuccess ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <CheckCircle size={28} className="text-emerald-600" />
                        </div>
                        <p className="text-emerald-600 font-bold">Report Submitted</p>
                        <p className="text-sm text-slate-500 mt-1">Our team will review this campaign.</p>
                    </div>
                ) : (
                    <form onSubmit={handleReport}>
                        <p className="text-sm text-slate-600 mb-4">
                            Why are you reporting this campaign?
                        </p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Describe the issue..."
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                        />
                        {reportError && (
                            <p className="text-sm text-red-500 mt-2">{reportError}</p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => { setReportReason(""); onClose(); }}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reporting}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-all"
                            >
                                {reporting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
