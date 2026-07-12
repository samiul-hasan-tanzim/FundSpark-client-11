"use client";

export default function Newsletter() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-5">
                <div className="relative bg-indigo-600 rounded-[40px] p-16 overflow-hidden flex flex-col items-center text-center space-y-8">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
                    <h2 className="text-4xl font-bold text-white max-w-2xl relative z-10">Ready to Turn Your Dream Into Reality?</h2>
                    <p className="text-lg text-indigo-100 max-w-xl relative z-10">We provide the tools, the community, and the platform. You provide the vision. Together, we spark change.</p>
                    <div className="flex gap-6 relative z-10">
                        <button type="button" className="bg-white text-indigo-700 px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition-all">Start Campaign</button>
                        <button type="button" className="bg-indigo-500/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-500/40 transition-all">Learn More</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
