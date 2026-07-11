"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Poppins, Inter } from "next/font/google";
import { categories } from "@/lib/homeData";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function AddCampaign() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const uploadToImgBB = async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
            method: "POST",
            body: fd,
        });
        const data = await res.json();
        return data?.data?.url;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const title = form.get("title")?.trim();
        const story = form.get("story")?.trim();
        const category = form.get("category");
        const fundingGoal = parseInt(form.get("fundingGoal"));
        const minimumContribution = parseInt(form.get("minimumContribution"));
        const deadline = form.get("deadline");
        const rewardInfo = form.get("rewardInfo")?.trim();

        if (!title || !story || !category || !fundingGoal || !minimumContribution || !deadline) {
            setApiError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        let image = "";
        if (imageFile) {
            image = await uploadToImgBB(imageFile);
            if (!image) {
                setApiError("Failed to upload image. Please try again.");
                setLoading(false);
                return;
            }
        }

        const payload = {
            title,
            story,
            category,
            fundingGoal,
            minimumContribution,
            deadline: new Date(deadline).toISOString(),
            rewardInfo,
            image,
            creatorEmail: session?.user?.email,
            creatorName: session?.user?.name,
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.email}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                setApiError(data.message || "Failed to create campaign.");
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/creator/my-campaigns"), 1500);
            }
        } catch {
            setApiError("Network error. Please try again.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className={`text-xl font-bold text-gray-900 mb-1 ${poppins.className}`}>Campaign Created!</h2>
                    <p className={`text-sm text-gray-500 ${inter.className}`}>Your campaign is pending admin approval. Redirecting...</p>
                </div>
            </div>
        );
    }

    const inputClass = `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 ${inter.className}`;
    const labelClass = `block text-sm font-medium text-gray-700 mb-1.5 ${inter.className}`;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Launch New Campaign</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Fill in the details below to create your campaign. It will be reviewed by admins before going live.</p>
            </div>

            {apiError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm text-red-700 ${inter.className}`}>{apiError}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-6">
                {/* Campaign Title */}
                <div>
                    <label htmlFor="title" className={labelClass}>Campaign Title <span className="text-red-400">*</span></label>
                    <input id="title" name="title" type="text" placeholder="Give your campaign a compelling title" className={inputClass} disabled={loading} />
                </div>

                {/* Campaign Story */}
                <div>
                    <label htmlFor="story" className={labelClass}>Campaign Story <span className="text-red-400">*</span></label>
                    <textarea id="story" name="story" rows={6} placeholder="Tell your story — why does this campaign matter?" className={`${inputClass} resize-y min-h-[140px]`} disabled={loading} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className={labelClass}>Category <span className="text-red-400">*</span></label>
                        <select id="category" name="category" className={inputClass} disabled={loading} defaultValue="">
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Funding Goal */}
                    <div>
                        <label htmlFor="fundingGoal" className={labelClass}>Funding Goal (credits) <span className="text-red-400">*</span></label>
                        <input id="fundingGoal" name="fundingGoal" type="number" min="1" placeholder="e.g. 1000" className={inputClass} disabled={loading} />
                    </div>

                    {/* Minimum Contribution */}
                    <div>
                        <label htmlFor="minimumContribution" className={labelClass}>Minimum Contribution (credits) <span className="text-red-400">*</span></label>
                        <input id="minimumContribution" name="minimumContribution" type="number" min="1" placeholder="e.g. 10" className={inputClass} disabled={loading} />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label htmlFor="deadline" className={labelClass}>Deadline <span className="text-red-400">*</span></label>
                        <input id="deadline" name="deadline" type="date" className={inputClass} disabled={loading} />
                    </div>
                </div>

                {/* Reward Information */}
                <div>
                    <label htmlFor="rewardInfo" className={labelClass}>Reward Information</label>
                    <textarea id="rewardInfo" name="rewardInfo" rows={4} placeholder="Describe the rewards supporters will receive for their contributions" className={`${inputClass} resize-y min-h-[100px]`} disabled={loading} />
                </div>

                {/* Cover Image */}
                <div>
                    <label className={labelClass}>Cover Image</label>
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={`text-sm font-medium ${inter.className}`}>
                                {imageFile ? "Change Image" : "Upload Image"}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
                        </label>
                        {imagePreview && (
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-red-600 transition-colors">✕</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${inter.className}`}>
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating Campaign...
                        </>
                    ) : "Launch Campaign"}
                </button>
            </form>
        </div>
    );
}
