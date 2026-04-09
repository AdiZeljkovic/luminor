"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale === locale) return;

        // Strip any locale prefix from the current path
        const pathWithoutLocale = pathname.replace(/^\/(en|bs)(\/|$)/, '/').replace(/\/$/, '') || '/';

        // Build new path
        const newPath = newLocale === 'en'
            ? pathWithoutLocale
            : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

        // Hard navigation ensures locale context reloads correctly
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
