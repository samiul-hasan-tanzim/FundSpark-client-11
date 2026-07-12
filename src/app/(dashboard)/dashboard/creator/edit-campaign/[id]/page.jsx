"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import { categories } from "@/lib/homeData";
import toast from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function EditCampaign() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!params.id) return;
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/${params.id}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                setCampaign(data);
                setExistingImages(data.images || (data.image ? [data.image] : []));
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [params.id]);

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

        const newImages = [];
        for (const file of imageFiles) {
            const url = await uploadToImgBB(file);
            if (!url) {
                setApiError("Failed to upload image. Please try again.");
                setLoading(false);
                return;
            }
            newImages.push(url);
        }

        const images = [...existingImages, ...newImages];
        if (images.length === 0) {
            setApiError("Please upload at least one image.");
            setLoading(false);
            return;
        }

        const payload = { title, story, category, fundingGoal, minimumContribution, deadline: new Date(deadline).toISOString(), rewardInfo, image: images[0], images };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/update/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.user?.email}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to update campaign");
                setApiError(data.message || "Failed to update campaign.");
            } else {
                toast.success("Campaign updated successfully!");
                setSuccess(true);
                setTimeout(() => router.push("/dashboard/creator/my-campaigns"), 1500);
            }
        } catch {
            setApiError("Network error. Please try again.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="h-96 bg-gray-200 rounded-2xl" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-16">
                <p className={`text-gray-500 ${inter.className}`}>Campaign not found.</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className={`text-xl font-bold text-gray-900 mb-1 ${poppins.className}`}>Campaign Updated!</h2>
                    <p className={`text-sm text-gray-500 ${inter.className}`}>Redirecting to your campaigns...</p>
                </div>
            </div>
        );
    }

    const deadlineStr = campaign.deadline ? new Date(campaign.deadline).toISOString().split("T")[0] : "";
    const inputClass = `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 ${inter.className}`;
    const labelClass = `block text-sm font-medium text-gray-700 mb-1.5 ${inter.className}`;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 ${poppins.className}`}>Edit Campaign</h1>
                <p className={`text-sm text-gray-500 mt-1 ${inter.className}`}>Update your campaign details.</p>
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
                <div>
                    <label htmlFor="title" className={labelClass}>Campaign Title <span className="text-red-400">*</span></label>
                    <input id="title" name="title" type="text" defaultValue={campaign.title} placeholder="Give your campaign a compelling title" className={inputClass} disabled={loading} />
                </div>

                <div>
                    <label htmlFor="story" className={labelClass}>Campaign Story <span className="text-red-400">*</span></label>
                    <textarea id="story" name="story" rows={6} defaultValue={campaign.story} placeholder="Tell your story" className={`${inputClass} resize-y min-h-[140px]`} disabled={loading} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className={labelClass}>Category <span className="text-red-400">*</span></label>
                        <select id="category" name="category" className={inputClass} disabled={loading} defaultValue={campaign.category}>
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="fundingGoal" className={labelClass}>Funding Goal (credits) <span className="text-red-400">*</span></label>
                        <input id="fundingGoal" name="fundingGoal" type="number" min="1" defaultValue={campaign.fundingGoal} className={inputClass} disabled={loading} />
                    </div>

                    <div>
                        <label htmlFor="minimumContribution" className={labelClass}>Minimum Contribution (credits) <span className="text-red-400">*</span></label>
                        <input id="minimumContribution" name="minimumContribution" type="number" min="1" defaultValue={campaign.minimumContribution} className={inputClass} disabled={loading} />
                    </div>

                    <div>
                        <label htmlFor="deadline" className={labelClass}>Deadline <span className="text-red-400">*</span></label>
                        <input id="deadline" name="deadline" type="date" defaultValue={deadlineStr} className={inputClass} disabled={loading} />
                    </div>
                </div>

                <div>
                    <label htmlFor="rewardInfo" className={labelClass}>Reward Information</label>
                    <textarea id="rewardInfo" name="rewardInfo" rows={4} defaultValue={campaign.rewardInfo} className={`${inputClass} resize-y min-h-[100px]`} disabled={loading} />
                </div>

                <div>
                    <label className={labelClass}>Campaign Images</label>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-sm font-medium ${inter.className}`}>Add Images</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} disabled={loading} />
                    <div className="flex flex-wrap gap-3 mt-4">
                        {existingImages.map((url, i) => (
                            <div key={`existing-${i}`} className="relative w-24 h-24 rounded-2xl overflow-visible border-2 border-gray-200 shadow-sm group">
                                <Image src={url} alt={`Campaign image ${i + 1}`} fill className="object-cover" unoptimized />
                                <button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors">✕</button>
                            </div>
                        ))}
                        {imagePreviews.map((preview, i) => (
                            <div key={`new-${i}`} className="relative w-24 h-24 rounded-2xl overflow-visible border-2 border-indigo-200 shadow-sm group">
                                <Image src={preview} alt={`New image ${i + 1}`} fill className="object-cover" unoptimized />
                                <button type="button" onClick={() => removeNewImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors">✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
