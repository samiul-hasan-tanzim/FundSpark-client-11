"use client";
import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import PlatformStats from "@/components/PlatformStats";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import Testimonials from "@/components/Testimonials";
import TopCampaigns from "@/components/TopCampaigns";
import Newsletter from "@/components/Newsletter";
import FadeIn from "@/components/FadeIn";

export default function Home() {
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({ totalCampaigns: 0, totalCreators: 0, totalSupporters: 0, totalCredits: 0 });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/campaigns/top`, { cache: 'no-store' })
            .then(r => r.json()).then(setCampaigns).catch(() => { });
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats`, { cache: 'no-store' })
            .then(r => r.json()).then(setStats).catch(() => { });
    }, []);

    return (
        <>
            <HeroSlider />
            <FadeIn><PlatformStats stats={stats} /></FadeIn>
            <FadeIn delay={0.1}><Categories /></FadeIn>
            <FadeIn delay={0.15}><HowItWorks /></FadeIn>
            <FadeIn delay={0.2}><TopCampaigns campaigns={campaigns} /></FadeIn>
            <FadeIn delay={0.25}><Testimonials /></FadeIn>
            <FadeIn delay={0.3}><Newsletter /></FadeIn>
        </>
    );
}
