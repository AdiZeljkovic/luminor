"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import styles from "./LeadMagnetPopup.module.css";
import { API_URL } from "@/lib/api";

interface LeadMagnetConfig {
    lead_magnet_active: boolean;
    lead_magnet_title_en: string;
    lead_magnet_title_bs: string;
    lead_magnet_pdf_url: string | null;
}

const STORAGE_KEY = "lm_dismissed";
const DISMISS_DAYS = 7;

export default function LeadMagnetPopup() {
    const locale = useLocale();
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<LeadMagnetConfig | null>(null);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Check if dismissed recently
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) {
            const daysAgo = (Date.now() - parseInt(dismissed)) / 86400000;
            if (daysAgo < DISMISS_DAYS) return;
        }

        // Fetch settings
        fetch(`${API_URL}/api/settings`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data?.lead_magnet_active && data.data?.lead_magnet_pdf_url) {
                    setConfig({
                        lead_magnet_active: data.data.lead_magnet_active,
                        lead_magnet_title_en: data.data.lead_magnet_title_en || "Download Free Guide: 10 Web Design Mistakes",
                        lead_magnet_title_bs: data.data.lead_magnet_title_bs || "Preuzmite besplatni vodič: 10 grešaka pri izradi web sajta",
                        lead_magnet_pdf_url: data.data.lead_magnet_pdf_url,
                    });

                    // Show after 30 seconds
                    timerRef.current = setTimeout(() => setVisible(true), 30000);

                    // Exit intent (mouse leaves viewport top)
                    const handleMouseLeave = (e: MouseEvent) => {
                        if (e.clientY <= 0) {
                            setVisible(true);
                            document.removeEventListener("mouseleave", handleMouseLeave);
                        }
                    };
                    document.addEventListener("mouseleave", handleMouseLeave);

                    return () => {
                        document.removeEventListener("mouseleave", handleMouseLeave);
                    };
                }
            })
            .catch(() => {});

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !config?.lead_magnet_pdf_url) return;

        setStatus("submitting");

        try {
            // Subscribe to newsletter
            await fetch(`${API_URL}/api/newsletter/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        } catch {
            // Even if newsletter fails, proceed to download
        }

        setStatus("done");
        localStorage.setItem(STORAGE_KEY, Date.now().toString());

        // Trigger download
        if (config.lead_magnet_pdf_url) {
            window.open(`${API_URL}${config.lead_magnet_pdf_url}`, "_blank");
        }
    };

    if (!visible || !config) return null;

    const title = locale === "bs" ? config.lead_magnet_title_bs : config.lead_magnet_title_en;

    return (
        <div className={styles.overlay} onClick={dismiss}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={dismiss} aria-label="Close">
                    ×
                </button>

                <div className={styles.icon}>📘</div>

                <h2 className={styles.title}>{title}</h2>

                <p className={styles.description}>
                    {locale === "bs"
                        ? "Unesite email i preuzmite besplatno!"
                        : "Enter your email and download for free!"}
                </p>

                {status === "done" ? (
                    <div className={styles.success}>
                        <span>✅</span>
                        <p>
                            {locale === "bs"
                                ? "Hvala! Vaš vodič se preuzima..."
                                : "Thank you! Your guide is downloading..."}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={locale === "bs" ? "vas@email.com" : "your@email.com"}
                            className={styles.input}
                        />
                        <button type="submit" disabled={status === "submitting"} className={styles.button}>
                            {status === "submitting"
                                ? "..."
                                : locale === "bs"
                                ? "Preuzmite Besplatno"
                                : "Download for Free"}
                        </button>
                    </form>
                )}

                <p className={styles.disclaimer}>
                    {locale === "bs"
                        ? "Bez spama. Možete se odjaviti u bilo kom trenutku."
                        : "No spam. Unsubscribe at any time."}
                </p>
            </div>
        </div>
    );
}
