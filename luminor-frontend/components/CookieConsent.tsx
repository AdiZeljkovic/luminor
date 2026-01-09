"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export default function CookieConsent() {
    const t = useTranslations('cookies');
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always required
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Delay showing to prevent layout shift
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const savePreferences = (acceptAll: boolean = false) => {
        const finalPreferences = acceptAll
            ? { necessary: true, analytics: true, marketing: true }
            : preferences;

        localStorage.setItem('cookie-consent', JSON.stringify(finalPreferences));
        localStorage.setItem('cookie-consent-date', new Date().toISOString());

        // Trigger analytics if accepted
        if (finalPreferences.analytics && typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }

        setIsVisible(false);
    };

    const handleRejectAll = () => {
        const minPreferences = { necessary: true, analytics: false, marketing: false };
        localStorage.setItem('cookie-consent', JSON.stringify(minPreferences));
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.banner}>
                {/* Cookie Icon */}
                <div className={styles.iconWrapper}>
                    <span className={styles.cookieIcon}>🍪</span>
                </div>

                {/* Main Content */}
                <div className={styles.content}>
                    <h3 className={styles.title}>{t('title')}</h3>
                    <p className={styles.description}>
                        {t('description')}{' '}
                        <Link href="/privacy" className={styles.link}>
                            {t('privacyLink')}
                        </Link>
                    </p>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className={styles.settings}>
                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>{t('necessary')}</span>
                                    <span className={styles.settingDesc}>{t('necessaryDesc')}</span>
                                </div>
                                <div className={`${styles.toggle} ${styles.disabled}`}>
                                    <input type="checkbox" checked disabled />
                                    <span className={styles.slider}></span>
                                </div>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>{t('analytics')}</span>
                                    <span className={styles.settingDesc}>{t('analyticsDesc')}</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <span className={styles.settingName}>{t('marketing')}</span>
                                    <span className={styles.settingDesc}>{t('marketingDesc')}</span>
                                </div>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={styles.settingsBtn}
                    >
                        {showSettings ? t('hideSettings') : t('showSettings')}
                    </button>
                    <button onClick={handleRejectAll} className={styles.rejectBtn}>
                        {t('rejectAll')}
                    </button>
                    {showSettings ? (
                        <button onClick={() => savePreferences(false)} className={styles.acceptBtn}>
                            {t('savePreferences')}
                        </button>
                    ) : (
                        <button onClick={() => savePreferences(true)} className={styles.acceptBtn}>
                            {t('acceptAll')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
