"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: "fade-up" | "fade-in" | "fade-left" | "slide-left" | "slide-right" | "scale";
    delay?: number;
    className?: string;
    threshold?: number;
}

export default function AnimatedSection({
    children,
    animation = "fade-up",
    delay = 0,
    className = "",
    threshold = 0.1,
}: AnimatedSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        // If element is already in viewport on load (above fold), show immediately without animation
        const rect = el.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (alreadyVisible) {
            setIsVisible(true);
            setMounted(true);
            return;
        }

        // Below fold: mount animation state then observe
        setMounted(true);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, [threshold]);

    const hiddenStyles: { [key: string]: React.CSSProperties } = {
        "fade-up":    { opacity: 0, transform: "translateY(30px)" },
        "fade-in":    { opacity: 0 },
        "fade-left":  { opacity: 0, transform: "translateX(-30px)" },
        "slide-left": { opacity: 0, transform: "translateX(-30px)" },
        "slide-right":{ opacity: 0, transform: "translateX(30px)" },
        scale:        { opacity: 0, transform: "scale(0.95)" },
    };

    // SSR + before mount: no inline styles → content fully visible to crawlers
    // After mount: apply animation only for below-fold elements
    const style: React.CSSProperties = mounted
        ? isVisible
            ? { transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`, willChange: "transform, opacity" }
            : { ...hiddenStyles[animation], transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`, willChange: "transform, opacity" }
        : {};

    return (
        <div ref={sectionRef} className={className} style={style}>
            {children}
        </div>
    );
}
