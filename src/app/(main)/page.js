"use client";
import { useState, useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import TopCampaigns from "@/components/TopCampaigns";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import PlatformStats from "@/components/PlatformStats";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

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
            <TopCampaigns campaigns={campaigns} />
            <HowItWorks />
            <Categories />
            <PlatformStats stats={stats} />
            <Testimonials />
            <Newsletter />
        </>
    );
}
