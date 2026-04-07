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

    const packages = ['basic', 'professional', 'enterprise'] as const;
    const processSteps = ['1', '2', '3', '4'] as const;

    const today = new Date().toLocaleDateString(locale === 'bs' ? 'bs-BA' : 'en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Optional sections — only present in some offers
    let notIncluded: { title: string; items: string[] } | null = null;
    let clientResp: { title: string; intro: string; items: string[] } | null = null;
    let techStack: { title: string; items: string[] } | null = null;
    let maintenance: {
        title: string;
        support30Title: string;
        support30Items: string[];
        retainerTitle: string;
        retainerItems: string[];
    } | null = null;
    let acceptance: {
        title: string;
        description: string;
        labelName: string;
        labelCompany: string;
        labelDate: string;
        labelSignature: string;
    } | null = null;

    try {
        const items = t.raw('notIncluded.items');
        if (Array.isArray(items)) notIncluded = { title: t('notIncluded.title'), items };
    } catch {}
    try {
        const items = t.raw('clientResponsibilities.items');
        if (Array.isArray(items)) clientResp = { title: t('clientResponsibilities.title'), intro: t('clientResponsibilities.intro'), items };
    } catch {}
    try {
        const items = t.raw('techStack.items');
        if (Array.isArray(items)) techStack = { title: t('techStack.title'), items };
    } catch {}
    try {
        const support30Items = t.raw('maintenance.support30Items');
        if (Array.isArray(support30Items)) {
            maintenance = {
                title: t('maintenance.title'),
                support30Title: t('maintenance.support30Title'),
                support30Items,
                retainerTitle: t('maintenance.retainerTitle'),
                retainerItems: Array.isArray(t.raw('maintenance.retainerItems')) ? t.raw('maintenance.retainerItems') as string[] : [],
            };
        }
    } catch {}
    try {
        const title = t('acceptance.title');
        if (title && !title.startsWith('offers.')) {
            acceptance = {
                title,
                description: t('acceptance.description'),
                labelName: t('acceptance.labelName'),
                labelCompany: t('acceptance.labelCompany'),
                labelDate: t('acceptance.labelDate'),
                labelSignature: t('acceptance.labelSignature'),
            };
        }
    } catch {}

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
                {/* Document header */}
                <div className={styles.docHeader}>
                    <div className={styles.brandName}>
                        Luminor<span className={styles.brandAccent}>.Solutions</span>
                    </div>
                    <div className={styles.docMeta}>
                        <span className={styles.docBadge}>
                            {locale === 'bs' ? 'Zvanična ponuda' : 'Official offer'}
                        </span>
                        <span className={styles.docDate}>{today}</span>
                        <span className={styles.docValidity}>{t('validity')}</span>
                    </div>
                </div>

                {/* Service intro */}
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

                {/* What's included */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>{t('includes.title')}</span>
                    <ul className={styles.includesList}>
                        {(t.raw('includes.items') as string[]).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* What's NOT included */}
                {notIncluded && notIncluded.items.length > 0 && (
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>{notIncluded.title}</span>
                        <ul className={styles.notIncludedList}>
                            {notIncluded.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Technology stack */}
                {techStack && techStack.items.length > 0 && (
                    <div className={styles.sectionDark}>
                        <span className={styles.sectionTitle}>{techStack.title}</span>
                        <ul className={styles.techStackList}>
                            {techStack.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

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

                {/* Client responsibilities */}
                {clientResp && clientResp.items.length > 0 && (
                    <div className={styles.sectionDark}>
                        <span className={styles.sectionTitle}>{clientResp.title}</span>
                        <p className={styles.sectionIntro}>{clientResp.intro}</p>
                        <ul className={styles.responsibilitiesList}>
                            {clientResp.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* After launch / maintenance */}
                {maintenance && (
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>{maintenance.title}</span>
                        <div className={styles.maintenanceGrid}>
                            <div className={styles.maintenanceCard}>
                                <h4>{maintenance.support30Title}</h4>
                                <ul>
                                    {maintenance.support30Items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.maintenanceCard}>
                                <h4>{maintenance.retainerTitle}</h4>
                                <ul>
                                    {maintenance.retainerItems.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>{t('terms.title')}</span>
                    <ul className={styles.termsList}>
                        {(t.raw('terms.items') as string[]).map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Acceptance */}
                {acceptance && (
                    <div className={styles.acceptanceSection}>
                        <span className={styles.sectionTitle}>{acceptance.title}</span>
                        <p className={styles.sectionIntro}>{acceptance.description}</p>
                        <div className={styles.acceptanceGrid}>
                            <div className={styles.acceptanceField}>
                                <span className={styles.acceptanceLabel}>{acceptance.labelName}</span>
                                <div className={styles.acceptanceLine} />
                            </div>
                            <div className={styles.acceptanceField}>
                                <span className={styles.acceptanceLabel}>{acceptance.labelCompany}</span>
                                <div className={styles.acceptanceLine} />
                            </div>
                            <div className={styles.acceptanceField}>
                                <span className={styles.acceptanceLabel}>{acceptance.labelDate}</span>
                                <div className={styles.acceptanceLine} />
                            </div>
                            <div className={styles.acceptanceField}>
                                <span className={styles.acceptanceLabel}>{acceptance.labelSignature}</span>
                                <div className={styles.acceptanceLine} />
                            </div>
                        </div>
                    </div>
                )}

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
