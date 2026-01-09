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

        let newPath = pathname;

        // If currently in Bosnian ('/bs' prefix), remove it
        if (locale === 'bs' && pathname.startsWith('/bs')) {
            newPath = pathname.replace(/^\/bs/, '') || '/';
        }

        // If switching TO Bosnian, add '/bs' prefix
        if (newLocale === 'bs') {
            // Ensure we don't double slash if path is just '/'
            newPath = `/bs${newPath === '/' ? '' : newPath}`;
        }

        router.push(newPath);
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
