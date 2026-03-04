import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "../services/ServiceDetail.module.css";
import processStyles from "./page.module.css";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "process.hero" });
    const canonicalPath = locale === 'en' ? 'process' : `${locale}/process`;
    return {
        title: `How We Work | Luminor Solutions`,
        description: t("description"),
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

export default function ProcessPage() {
    const t = useTranslations("process");

    const phases = ['discovery', 'strategy', 'build', 'launch'] as const;
    const principleKeys = ['honest', 'scope', 'communication', 'ownership'] as const;
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

            {/* Four Phases */}
            <section className={styles.detailedServicesSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className={styles.sectionTitle}>{t("phases.title")}</h2>
                        <p className="max-w-2xl mx-auto text-gray-600 font-primary mt-4">{t("phases.subtitle")}</p>
                    </AnimatedSection>

                    <div className={processStyles.phasesList}>
                        {phases.map((phase, index) => (
                            <AnimatedSection key={phase} animation="fade-up" delay={index * 100} className={processStyles.phaseItem}>
                                <div className={processStyles.phaseNumber}>{t(`phases.${phase}.number`)}</div>
                                <div className={processStyles.phaseIcon}>{phaseIcons[phase]}</div>
                                <div className={processStyles.phaseContent}>
                                    <h3 className={processStyles.phaseTitle}>{t(`phases.${phase}.title`)}</h3>
                                    <p className={processStyles.phaseDescription}>{t(`phases.${phase}.description`)}</p>
                                    <ul className={styles.serviceDetailList}>
                                        {(t.raw(`phases.${phase}.items`) as string[]).map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className={styles.techStackSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className={styles.sectionTitle}>{t("principles.title")}</h2>
                    </AnimatedSection>
                    <div className={styles.featuresGrid}>
                        {principleKeys.map((key, index) => (
                            <AnimatedSection key={key} animation="fade-up" delay={index * 100} className={styles.featureCard}>
                                <h3 className={styles.featureTitle}>{t(`principles.${key}.title`)}</h3>
                                <p className={styles.featureText}>{t(`principles.${key}.description`)}</p>
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
                                        <span className="transform transition-transform group-open:rotate-180">▼</span>
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
                    <div className={`${styles.floatingElement} ${styles.float1}`}>🚀</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>💡</div>

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
                                <div className={styles.ctaCardIcon}>📅</div>
                                <h3 className={styles.ctaCardTitle}>{t("cta.button")}</h3>
                                <p className={styles.ctaCardText}>{t("cta.description")}</p>
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
