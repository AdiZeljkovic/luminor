"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale === locale) return;

        // Get current path without locale prefix
        // usePathname() in next-intl returns path WITHOUT locale prefix
        const pathWithoutLocale = pathname.replace(/^\/(en|bs)/, '') || '/';

        // Build new path with new locale
        let newPath;
        if (newLocale === 'en') {
            // English is default locale - no prefix needed
            newPath = pathWithoutLocale;
        } else {
            // Other locales need prefix (e.g., /bs)
            newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
        }

        router.push(newPath);
        router.refresh(); // Force refresh to update the page
    };

    return (
        <div className={styles.switcher}>
            <button
                className={`${styles.langButton} ${locale === 'en' ? styles.active : ''}`}
                onClick={() => switchLocale('en')}
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className={styles.divider}>/</span>
            <button
                className={`${styles.langButton} ${locale === 'bs' ? styles.active : ''}`}
                onClick={() => switchLocale('bs')}
                aria-label="Switch to Bosnian"
            >
                BS
            </button>
        </div>
    );
}
