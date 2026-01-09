import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import styles from './legal.module.css';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'legal' });
    return {
        title: t('privacy.title'),
        description: t('privacy.metaDescription'),
    };
}

export default async function PrivacyPolicyPage() {
    const t = await getTranslations('legal');

    return (
        <main className={styles.legalPage}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>📜 {t('privacy.badge')}</span>
                    <h1 className={styles.title}>{t('privacy.title')}</h1>
                    <p className={styles.subtitle}>{t('privacy.lastUpdated')}: January 9, 2026</p>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. {t('privacy.introduction.title')}</h2>
                        <p>{t('privacy.introduction.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. {t('privacy.dataCollection.title')}</h2>
                        <p>{t('privacy.dataCollection.intro')}</p>
                        <ul>
                            <li><strong>{t('privacy.dataCollection.personal')}:</strong> {t('privacy.dataCollection.personalDesc')}</li>
                            <li><strong>{t('privacy.dataCollection.technical')}:</strong> {t('privacy.dataCollection.technicalDesc')}</li>
                            <li><strong>{t('privacy.dataCollection.cookies')}:</strong> {t('privacy.dataCollection.cookiesDesc')}</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. {t('privacy.usage.title')}</h2>
                        <p>{t('privacy.usage.intro')}</p>
                        <ul>
                            <li>{t('privacy.usage.item1')}</li>
                            <li>{t('privacy.usage.item2')}</li>
                            <li>{t('privacy.usage.item3')}</li>
                            <li>{t('privacy.usage.item4')}</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. {t('privacy.gdpr.title')}</h2>
                        <p>{t('privacy.gdpr.intro')}</p>
                        <div className={styles.rights}>
                            <div className={styles.rightItem}>
                                <span className={styles.rightIcon}>✅</span>
                                <div>
                                    <strong>{t('privacy.gdpr.access')}</strong>
                                    <p>{t('privacy.gdpr.accessDesc')}</p>
                                </div>
                            </div>
                            <div className={styles.rightItem}>
                                <span className={styles.rightIcon}>✏️</span>
                                <div>
                                    <strong>{t('privacy.gdpr.rectification')}</strong>
                                    <p>{t('privacy.gdpr.rectificationDesc')}</p>
                                </div>
                            </div>
                            <div className={styles.rightItem}>
                                <span className={styles.rightIcon}>🗑️</span>
                                <div>
                                    <strong>{t('privacy.gdpr.erasure')}</strong>
                                    <p>{t('privacy.gdpr.erasureDesc')}</p>
                                </div>
                            </div>
                            <div className={styles.rightItem}>
                                <span className={styles.rightIcon}>📦</span>
                                <div>
                                    <strong>{t('privacy.gdpr.portability')}</strong>
                                    <p>{t('privacy.gdpr.portabilityDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>5. {t('privacy.cookies.title')}</h2>
                        <p>{t('privacy.cookies.content')}</p>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t('privacy.cookies.type')}</th>
                                    <th>{t('privacy.cookies.purpose')}</th>
                                    <th>{t('privacy.cookies.duration')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t('privacy.cookies.necessary')}</td>
                                    <td>{t('privacy.cookies.necessaryPurpose')}</td>
                                    <td>{t('privacy.cookies.session')}</td>
                                </tr>
                                <tr>
                                    <td>{t('privacy.cookies.analytics')}</td>
                                    <td>{t('privacy.cookies.analyticsPurpose')}</td>
                                    <td>2 {t('privacy.cookies.years')}</td>
                                </tr>
                                <tr>
                                    <td>{t('privacy.cookies.marketing')}</td>
                                    <td>{t('privacy.cookies.marketingPurpose')}</td>
                                    <td>1 {t('privacy.cookies.year')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className={styles.section}>
                        <h2>6. {t('privacy.security.title')}</h2>
                        <p>{t('privacy.security.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. {t('privacy.contact.title')}</h2>
                        <p>{t('privacy.contact.content')}</p>
                        <div className={styles.contactBox}>
                            <p><strong>Luminor Solution Agency</strong></p>
                            <p>Email: privacy@luminor.solutions</p>
                            <p>Porodice Ribar 39, 71000 Sarajevo, Bosnia and Herzegovina</p>
                        </div>
                    </section>
                </div>

                {/* Back Link */}
                <div className={styles.footer}>
                    <Link href="/" className={styles.backLink}>← {t('backToHome')}</Link>
                </div>
            </div>
        </main>
    );
}
