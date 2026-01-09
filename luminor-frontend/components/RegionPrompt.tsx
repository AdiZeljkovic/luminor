"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import styles from "./RegionPrompt.module.css";

const BALKAN_LANGUAGES = ['sr', 'hr', 'bs', 'sl', 'mk', 'sq', 'me'];
const STORAGE_KEY = 'luminor_region_prompt_dismissed';

export default function RegionPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only show prompt if on English locale
        if (locale !== 'en') return;

        // Check if already dismissed
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        // Check browser language
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        const isBalkanUser = BALKAN_LANGUAGES.includes(browserLang);

        if (isBalkanUser) {
            // Small delay to not be intrusive
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, [locale]);

    const handleSwitchLanguage = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);

        // Get path without locale prefix and redirect to Bosnian
        const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/';
        router.push(`/bs${pathWithoutLocale}`);
    };

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={handleDismiss} aria-label="Close">
                    ×
                </button>
                <div className={styles.content}>
                    <span className={styles.flag}>🌍</span>
                    <h3 className={styles.title}>Dobrodošli!</h3>
                    <p className={styles.message}>
                        Primijetili smo da nas posjećujete sa prostora Balkana.
                        Da li želite da prebacite stranicu na bosanski jezik?
                    </p>
                    <div className={styles.buttons}>
                        <button className={styles.primaryButton} onClick={handleSwitchLanguage}>
                            Prebaci na bosanski
                        </button>
                        <button className={styles.secondaryButton} onClick={handleDismiss}>
                            Continue in English
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
