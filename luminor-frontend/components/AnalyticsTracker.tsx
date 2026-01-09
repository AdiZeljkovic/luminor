"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double tracking in React Strict Mode dev
        if (initialized.current) {
            // Check if path changed, if so reset initialized for new path? 
            // Actually strict mode re-runs effects. 
            // In Next.js navigation, component might not unmount.
        }

        const trackView = async () => {
            try {
                // Check if we already tracked this session/page view to avoid strict mode double count
                // A simple session storage key for "lastTrackedPath" could work
                const lastTracked = sessionStorage.getItem("lastTrackedPath");
                if (lastTracked === pathname) return;

                await fetch(`${API_URL}/api/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page: pathname,
                        isUnique: !localStorage.getItem('visited') // Simple unique check
                    })
                });

                sessionStorage.setItem("lastTrackedPath", pathname);
                localStorage.setItem('visited', 'true');
            } catch (error) {
                console.error('Analytics error:', error);
            }
        };

        trackView();

    }, [pathname]);

    return null;
}
