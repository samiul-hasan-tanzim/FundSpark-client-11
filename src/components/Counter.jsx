"use client";
import { useState, useEffect, useRef } from "react";

export default function Counter({ target, suffix }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let start = 0;
                const duration = 2000;
                const step = Math.ceil(target / (duration / 16));
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { start = target; clearInterval(timer); }
                    setCount(start);
                }, 16);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}{suffix}</span>;
}
