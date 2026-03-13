import { getTranslations, setRequestLocale } from "next-intl/server";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "../services/ServiceDetail.module.css";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo.process" });
    const canonicalPath = locale === 'en' ? 'process' : `${locale}/process`;
    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords").split(", "),
        openGraph: {
            title: t("title"),
            description: t("description"),
            type: 'website',
            url: `https://www.luminor.solutions/${canonicalPath}`,
            images: [{ url: 'https://www.luminor.solutions/rocket-hero.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t("title"),
            description: t("description"),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': 'https://www.luminor.solutions/process',
                'bs': 'https://www.luminor.solutions/bs/process',
                'x-default': 'https://www.luminor.solutions/process',
            },
        },
    };
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: "process" });

    const phases = ['discovery', 'strategy', 'build', 'launch'] as const;
    const faqKeys = ['1', '2', '3', '4'] as const;

    const phaseIcons: Record<string, string> = {
        discovery: "🔍",
        strategy: "📋",
        build: "⚙️",
        launch: "🚀",
    };

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <AnimatedSection>
                            <h1 className={styles.heroTitle}>
                                {t("hero.titleLine1")} <span className={styles.heroHighlight}>{t("hero.titleLine2")}</span>
                            </h1>
                            <p className={styles.heroText}>
                                {t("hero.description")}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button href="/contact" size="lg">{t("cta.button")}</Button>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Feature Highlights — 3 cards overlapping hero */}
            <div className={styles.container}>
                <div className={styles.featuresGrid}>
                    <AnimatedSection animation="fade-up" delay={0} className={styles.featureCard}>
                        <div className={styles.featureIcon} aria-hidden="true">🎯</div>
                        <h3 className={styles.featureTitle}>{t("principles.honest.title")}</h3>
                        <p className={styles.featureText}>{t("principles.honest.description")}</p>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay={100} className={styles.featureCard}>
                        <div className={styles.featureIcon} aria-hidden="true">📄</div>
                        <h3 className={styles.featureTitle}>{t("principles.scope.title")}</h3>
                        <p className={styles.featureText}>{t("principles.scope.description")}</p>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay={200} className={styles.featureCard}>
                        <div className={styles.featureIcon} aria-hidden="true">💬</div>
                        <h3 className={styles.featureTitle}>{t("principles.communication.title")}</h3>
                        <p className={styles.featureText}>{t("principles.communication.description")}</p>
                    </AnimatedSection>
                </div>
            </div>

            {/* Four Phases — dark section like service detail cards */}
            <section id="phases" className={styles.detailedServicesSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className={styles.sectionTitle}>{t("phases.title")}</h2>
                        <p className="max-w-2xl mx-auto text-gray-400 font-primary mt-4 relative z-10">{t("phases.subtitle")}</p>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {phases.map((phase, index) => (
                            <AnimatedSection key={phase} animation="fade-up" delay={index * 100} className={styles.serviceDetailCard}>
                                <h3 className={styles.serviceDetailTitle}>
                                    <span style={{ color: 'var(--color-accent)', marginRight: '0.4rem' }}>
                                        {t(`phases.${phase}.number`)}
                                    </span>
                                    {phaseIcons[phase]} {t(`phases.${phase}.title`)}
                                </h3>
                                <p className="text-gray-400 font-primary mb-4">{t(`phases.${phase}.description`)}</p>
                                <ul className={styles.serviceDetailList}>
                                    {(t.raw(`phases.${phase}.items`) as string[]).map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faqSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-12">
                        <h2 className={styles.sectionTitle}>{t("faq.title")}</h2>
                    </AnimatedSection>

                    <div className="space-y-4">
                        {faqKeys.map((key, index) => (
                            <AnimatedSection key={key} animation="fade-up" delay={index * 100} className={styles.accordionItem}>
                                <details className="group">
                                    <summary className={styles.accordionTrigger}>
                                        {t(`faq.q${key}`)}
                                        <span className="transform transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                                    </summary>
                                    <div className={styles.accordionContent}>
                                        <p>{t(`faq.a${key}`)}</p>
                                    </div>
                                </details>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Panel */}
            <div className={styles.container}>
                <AnimatedSection animation="scale" className={styles.ctaPanel}>
                    <div className={`${styles.floatingElement} ${styles.float1}`} aria-hidden="true">🚀</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`} aria-hidden="true">💡</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>{t("cta.label")}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{t("cta.titleLine1")}</span>
                                <span className={styles.ctaTitleSolid}>{t("cta.titleLine2")}</span>
                            </h2>
                            <p className={styles.ctaText}>{t("cta.description")}</p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon} aria-hidden="true">📅</div>
                                <h3 className={styles.ctaCardTitle}>{t("cta.cardTitle")}</h3>
                                <p className={styles.ctaCardText}>{t("cta.cardText")}</p>
                                <Button href="/contact" fullWidth className={styles.ctaButton}>
                                    {t("cta.button")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
