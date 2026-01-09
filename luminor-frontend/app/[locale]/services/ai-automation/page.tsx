import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "../ServiceDetail.module.css";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "services.aiAutomationPage.hero" });
    return {
        title: `${t("titleLine1")} ${t("titleLine2")} | Luminor.Solutions`,
        description: t("description"),
    };
}

export default function AIAutomationPage() {
    const t = useTranslations("services.aiAutomationPage");

    const detailedServicesKeys = ['chatbots', 'process', 'data', 'custom'];
    const featuresKeys = ['availability', 'error', 'scale'];
    const processKeys = ['analysis', 'prototype', 'integration', 'scaling'];
    const faqKeys = ['1', '2', '3', '4'];

    const featureIcons: Record<string, string> = {
        availability: "⚡",
        error: "🎯",
        scale: "📈"
    };

    const aiTools = [
        { name: "OpenAI", icon: "🧠" },
        { name: "Python", icon: "🐍" },
        { name: "Zapier", icon: "⚡" },
        { name: "Make", icon: "🟣" },
        { name: "LlamaIndex", icon: "🦙" },
        { name: "LangChain", icon: "🔗" },
    ];

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <AnimatedSection>
                            <h1 className={styles.heroTitle}>
                                {t("hero.titleLine1")} <br />
                                <span className={styles.heroHighlight}>{t("hero.titleLine2")}</span>
                            </h1>
                            <p className={styles.heroText}>
                                {t("hero.description")}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button href="/contact" size="lg">{t("hero.ctaPrimary")}</Button>
                                <Button href="#detailed-services" variant="outline" size="lg">{t("hero.ctaSecondary")}</Button>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <div className={styles.container}>
                <div className={styles.featuresGrid}>
                    {featuresKeys.map((key, index) => (
                        <AnimatedSection key={key} animation="fade-up" delay={index * 100} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{featureIcons[key]}</div>
                            <h3 className={styles.featureTitle}>{t(`features.${key}.title`)}</h3>
                            <p className={styles.featureText}>
                                {t(`features.${key}.description`)}
                            </p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>

            {/* Detailed Services Grid */}
            <section id="detailed-services" className={styles.detailedServicesSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className={styles.sectionTitle}>{t("detailedServices.title")}</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {detailedServicesKeys.map((key, index) => (
                            <AnimatedSection key={key} animation="fade-up" delay={index * 100} className={styles.serviceDetailCard}>
                                <h3 className={styles.serviceDetailTitle}>{t(`detailedServices.${key}.title`)}</h3>
                                <p className="text-gray-600 font-primary">{t(`detailedServices.${key}.description`)}</p>
                                <ul className={styles.serviceDetailList}>
                                    {(t.raw(`detailedServices.${key}.features`) as string[]).map((feature: string, i: number) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Tech Stack */}
            <section className={styles.techStackSection}>
                <div className={styles.container}>
                    <AnimatedSection>
                        <h2 className={styles.sectionTitle}>{t("techStack.title")}</h2>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8 font-primary">
                            {t("techStack.description")}
                        </p>
                    </AnimatedSection>
                    <div className={styles.techGrid}>
                        {aiTools.map((tool, index) => (
                            <AnimatedSection key={tool.name} animation="scale" delay={index * 50} className={styles.techItem}>
                                <span className={styles.techIcon}>{tool.icon}</span>
                                {tool.name}
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className={styles.processSection}>
                <div className={styles.container}>
                    <AnimatedSection>
                        <h2 className={styles.sectionTitle}>{t("process.title")}</h2>
                    </AnimatedSection>

                    <div className={styles.processList}>
                        {processKeys.map((key, index) => (
                            <AnimatedSection key={key} animation="fade-left" delay={index * 100} className={styles.processItem}>
                                <div className={styles.processNumber}>0{index + 1}</div>
                                <div className={styles.processContent}>
                                    <h3>{t(`process.steps.${key}.title`)}</h3>
                                    <p>{t(`process.steps.${key}.description`)}</p>
                                </div>
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

            {/* Premium CTA */}
            <div className={styles.container}>
                <AnimatedSection animation="scale" className={styles.ctaPanel}>
                    {/* Decorative Background Elements */}
                    <div className={`${styles.floatingElement} ${styles.float1}`}>🤖</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>⚡</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>{t("cta.label")}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{t("cta.titleLine1")}</span>
                                <span className={styles.ctaTitleSolid}>{t("cta.titleLine2")}</span>
                            </h2>
                            <p className={styles.ctaText}>
                                {t("cta.description")}
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>🔮</div>
                                <h3 className={styles.ctaCardTitle}>{t("cta.cardTitle")}</h3>
                                <p className={styles.ctaCardText}>
                                    {t("cta.cardText")}
                                </p>
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
