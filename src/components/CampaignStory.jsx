export default function CampaignStory({ campaign }) {
    if (!campaign.story) return null;

    const paragraphs = campaign.story.split("\n").filter(p => p.trim());

    return (
        <section className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-8 rounded-[24px] shadow-sm flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
            <div className="flex flex-col gap-3 text-slate-600 leading-relaxed">
                {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                ))}
            </div>
        </section>
    );
}
