"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale === locale) return;

        // Set NEXT_LOCALE cookie so next-intl middleware respects explicit user choice
        // over Accept-Language header detection (prevents redirect loop back to /bs)
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

        // Strip any locale prefix from the current path
        const pathWithoutLocale = pathname.replace(/^\/(en|bs)(\/|$)/, '/').replace(/\/$/, '') || '/';

        // Build new path
        const newPath = newLocale === 'en'
            ? pathWithoutLocale
            : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

        window.location.href = newPath;
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
