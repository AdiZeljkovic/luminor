import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import styles from '../offer.module.css';
import OfferPrintButton from '@/components/OfferPrintButton';

const namespaceMap: Record<string, string> = {
    'web-development': 'offers.webDevelopment',
    'graphic-design': 'offers.graphicDesign',
    'digital-marketing': 'offers.digitalMarketing',
    'seo': 'offers.seo',
    'ai-automation': 'offers.aiAutomation',
    'mobile-development': 'offers.mobileDevelopment',
    'hosting': 'offers.hosting',
};

type Props = {
    params: Promise<{ locale: string; service: string }>;
};

export async function generateStaticParams() {
    const services = Object.keys(namespaceMap);
    const locales = ['en', 'bs'];
    return locales.flatMap(locale =>
        services.map(service => ({ locale, service }))
    );
}

export default async function OfferPage({ params }: Props) {
    const { locale, service } = await params;
    setRequestLocale(locale);

    const namespace = namespaceMap[service];
    if (!namespace) notFound();

    const t = await getTranslations({ locale, namespace });
    const tCommon = await getTranslations({ locale, namespace: 'common' });

    const packages = ['basic', 'professional', 'enterprise'] as const;
    const processSteps = ['1', '2', '3', '4'] as const;

    const today = new Date().toLocaleDateString(locale === 'bs' ? 'bs-BA' : 'en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className={styles.wrapper}>
            {/* Action bar */}
            <div className={styles.actionBar}>
                <Link href="/services" className={styles.backLink}>
                    ← {locale === 'bs' ? 'Nazad na usluge' : 'Back to Services'}
                </Link>
                <OfferPrintButton label={locale === 'bs' ? 'Preuzmi PDF' : 'Download PDF'} />
            </div>

            <div className={styles.document}>
                {/* Document Header */}
                <div className={styles.docHeader}>
                    <div className={styles.brandName}>
                        Luminor<span className={styles.brandAccent}>.Solutions</span>
                    </div>
                    <div className={styles.docMeta}>
                        <span className={styles.docBadge}>
                            {locale === 'bs' ? 'Zvanična Ponuda' : 'Official Offer'}
                        </span>
                        <span className={styles.docDate}>{today}</span>
                        <span className={styles.docValidity}>{t('validity')}</span>
                    </div>
                </div>

                {/* Service Intro */}
                <div className={styles.intro}>
                    <h1 className={styles.serviceTitle}>
                        {t('titleLine1')} <span className={styles.serviceHighlight}>{t('titleLine2')}</span>
                    </h1>
                    <p className={styles.serviceSubtitle}>{t('subtitle')}</p>
                </div>

                {/* Packages */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>{t('packages.title')}</span>
                    <div className={styles.packagesGrid}>
                        {packages.map((pkg, i) => (
                            <div
                                key={pkg}
                                className={`${styles.packageCard} ${i === 1 ? styles.packageCardFeatured : ''}`}
                            >
                                {i === 1 && (
                                    <span className={styles.featuredBadge}>
                                        {locale === 'bs' ? 'Najpopularniji' : 'Most Popular'}
                                    </span>
                                )}
                                <div className={styles.packageName}>{t(`packages.${pkg}.name`)}</div>
                                <div className={styles.packagePrice}>
                                    {t(`packages.${pkg}.price`)}
                                    {t(`packages.${pkg}.priceSub`) && (
                                        <span className={styles.packagePriceSub}> {t(`packages.${pkg}.priceSub`)}</span>
                                    )}
                                </div>
                                <p className={styles.packageDesc}>{t(`packages.${pkg}.description`)}</p>
                                <ul className={styles.packageFeatures}>
                                    {(t.raw(`packages.${pkg}.features`) as string[]).map((f: string, j: number) => (
                                        <li key={j}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What's Included */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>{t('includes.title')}</span>
                    <ul className={styles.includesList}>
                        {(t.raw('includes.items') as string[]).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Process */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>{t('process.title')}</span>
                    <div className={styles.processList}>
                        {processSteps.map((step, i) => (
                            <div key={step} className={styles.processItem}>
                                <div className={styles.processNumber}>0{i + 1}</div>
                                <div className={styles.processContent}>
                                    <h4>{t(`process.steps.${step}.title`)}</h4>
                                    <p>{t(`process.steps.${step}.description`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terms */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>{t('terms.title')}</span>
                    <ul className={styles.termsList}>
                        {(t.raw('terms.items') as string[]).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className={styles.docFooter}>
                    <div className={styles.footerContact}>
                        <span><strong>Luminor Solutions</strong></span>
                        <span>info@luminor.solutions</span>
                        <span>+387 62 574 783</span>
                        <span>luminor.solutions</span>
                    </div>
                    <div className={styles.footerCta}>
                        <h3>{t('cta.title')}</h3>
                        <Link href="/contact" className={styles.footerCtaButton}>
                            {t('cta.button')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
