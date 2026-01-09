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
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [threshold]);

    const animationStyles: { [key: string]: React.CSSProperties } = {
        "fade-up": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
        },
        "fade-in": {
            opacity: isVisible ? 1 : 0,
        },
        "fade-left": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        },
        "slide-left": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        },
        "slide-right": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(30px)",
        },
        scale: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.95)",
        },
    };

    return (
        <div
            ref={sectionRef}
            className={className}
            style={{
                ...animationStyles[animation],
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                willChange: "transform, opacity",
            }}
        >
            {children}
        </div>
    );
}
