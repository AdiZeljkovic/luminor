import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import styles from '../privacy/legal.module.css';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'legal' });
    return {
        title: t('terms.title'),
        description: t('terms.metaDescription'),
    };
}

export default async function TermsOfServicePage() {
    const t = await getTranslations('legal');

    return (
        <main className={styles.legalPage}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>📋 {t('terms.badge')}</span>
                    <h1 className={styles.title}>{t('terms.title')}</h1>
                    <p className={styles.subtitle}>{t('terms.lastUpdated')}: January 9, 2026</p>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. {t('terms.acceptance.title')}</h2>
                        <p>{t('terms.acceptance.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. {t('terms.services.title')}</h2>
                        <p>{t('terms.services.intro')}</p>
                        <ul>
                            <li>{t('terms.services.item1')}</li>
                            <li>{t('terms.services.item2')}</li>
                            <li>{t('terms.services.item3')}</li>
                            <li>{t('terms.services.item4')}</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. {t('terms.intellectual.title')}</h2>
                        <p>{t('terms.intellectual.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. {t('terms.payment.title')}</h2>
                        <p>{t('terms.payment.content')}</p>
                        <div className={styles.notice}>
                            <strong>⚠️ {t('terms.payment.notice')}</strong>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>5. {t('terms.liability.title')}</h2>
                        <p>{t('terms.liability.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. {t('terms.termination.title')}</h2>
                        <p>{t('terms.termination.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. {t('terms.modifications.title')}</h2>
                        <p>{t('terms.modifications.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. {t('terms.governing.title')}</h2>
                        <p>{t('terms.governing.content')}</p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. {t('terms.contact.title')}</h2>
                        <p>{t('terms.contact.content')}</p>
                        <div className={styles.contactBox}>
                            <p><strong>Luminor Solutions Agency</strong></p>
                            <p>Email: legal@luminor.solutions</p>
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
