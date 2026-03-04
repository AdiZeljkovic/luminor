"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "../ServiceDetail.module.css";
import { useTranslations } from "next-intl";

export default function WebDevelopmentPage() {
    const t = useTranslations('services.webDevPage');

    const detailedServices = [
        {
            title: t('detailedServices.ecommerce.title'),
            description: t('detailedServices.ecommerce.description'),
            features: t.raw('detailedServices.ecommerce.features') as string[]
        },
        {
            title: t('detailedServices.corporate.title'),
            description: t('detailedServices.corporate.description'),
            features: t.raw('detailedServices.corporate.features') as string[]
        },
        {
            title: t('detailedServices.saas.title'),
            description: t('detailedServices.saas.description'),
            features: t.raw('detailedServices.saas.features') as string[]
        },
        {
            title: t('detailedServices.api.title'),
            description: t('detailedServices.api.description'),
            features: t.raw('detailedServices.api.features') as string[]
        }
    ];

    const techStack = [
        { name: "Next.js", icon: "▲" },
        { name: "React", icon: "⚛️" },
        { name: "Node.js", icon: "🟢" },
        { name: "TypeScript", icon: "📘" },
        { name: "Tailwind", icon: "🌊" },
        { name: "MongoDB", icon: "🍃" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "AWS", icon: "☁️" },
    ];

    const faqs = [
        {
            question: t('faq.q1'),
            answer: t('faq.a1')
        },
        {
            question: t('faq.q2'),
            answer: t('faq.a2')
        },
        {
            question: t('faq.q3'),
            answer: t('faq.a3')
        },
        {
            question: t('faq.q4'),
            answer: t('faq.a4')
        }
    ];

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Web Development Services",
        "description": "Professional custom web development services. React, Next.js, Node.js specialists. Build fast, scalable, and modern web applications.",
        "provider": {
            "@type": "Organization",
            "name": "Luminor Solutions",
            "url": "https://www.luminor.solutions",
            "logo": "https://www.luminor.solutions/rocket-hero.png"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Bosnia and Herzegovina"
        },
        "serviceType": "Web Development",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className={styles.page}>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <AnimatedSection>
                            <h1 className={styles.heroTitle}>
                                {t('hero.titleLine1')} <span className={styles.heroHighlight}>{t('hero.titleLine2')}</span><br />
                                {t('hero.titleLine3')}
                            </h1>
                            <p className={styles.heroText}>
                                {t('hero.description')}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button href="/contact" size="lg">{t('hero.ctaPrimary')}</Button>
                                <Button href="#detailed-services" variant="outline" size="lg">{t('hero.ctaSecondary')}</Button>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <div className={styles.container}>
                <div className={styles.featuresGrid}>
                    <AnimatedSection animation="fade-up" delay={0} className={styles.featureCard}>
                        <div className={styles.featureIcon}>🚀</div>
                        <h3 className={styles.featureTitle}>{t('features.performance.title')}</h3>
                        <p className={styles.featureText}>{t('features.performance.description')}</p>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay={100} className={styles.featureCard}>
                        <div className={styles.featureIcon}>📱</div>
                        <h3 className={styles.featureTitle}>{t('features.mobile.title')}</h3>
                        <p className={styles.featureText}>{t('features.mobile.description')}</p>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay={200} className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3 className={styles.featureTitle}>{t('features.security.title')}</h3>
                        <p className={styles.featureText}>{t('features.security.description')}</p>
                    </AnimatedSection>
                </div>
            </div>

            {/* Detailed Services Grid */}
            <section id="detailed-services" className={styles.detailedServicesSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-16">
                        <h2 className={styles.sectionTitle}>{t('detailedServices.title')}</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {detailedServices.map((service, index) => (
                            <AnimatedSection key={service.title} animation="fade-up" delay={index * 100} className={styles.serviceDetailCard}>
                                <h3 className={styles.serviceDetailTitle}>{service.title}</h3>
                                <p className="text-gray-600 font-primary">{service.description}</p>
                                <ul className={styles.serviceDetailList}>
                                    {service.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className={styles.techStackSection}>
                <div className={styles.container}>
                    <AnimatedSection>
                        <h2 className={styles.sectionTitle}>{t('techStack.title')}</h2>
                        <p className="max-w-2xl mx-auto text-gray-600 mb-8 font-primary">
                            {t('techStack.description')}
                        </p>
                    </AnimatedSection>
                    <div className={styles.techGrid}>
                        {techStack.map((tech, index) => (
                            <AnimatedSection key={tech.name} animation="scale" delay={index * 50} className={styles.techItem}>
                                <span className={styles.techIcon}>{tech.icon}</span>
                                {tech.name}
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className={styles.processSection}>
                <div className={styles.container}>
                    <AnimatedSection>
                        <h2 className={styles.sectionTitle}>{t('process.title')}</h2>
                    </AnimatedSection>

                    <div className={styles.processList}>
                        <AnimatedSection animation="fade-left" delay={0} className={styles.processItem}>
                            <div className={styles.processNumber}>01</div>
                            <div className={styles.processContent}>
                                <h3>{t('process.steps.discovery.title')}</h3>
                                <p>{t('process.steps.discovery.description')}</p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-left" delay={100} className={styles.processItem}>
                            <div className={styles.processNumber}>02</div>
                            <div className={styles.processContent}>
                                <h3>{t('process.steps.design.title')}</h3>
                                <p>{t('process.steps.design.description')}</p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-left" delay={200} className={styles.processItem}>
                            <div className={styles.processNumber}>03</div>
                            <div className={styles.processContent}>
                                <h3>{t('process.steps.development.title')}</h3>
                                <p>{t('process.steps.development.description')}</p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-left" delay={300} className={styles.processItem}>
                            <div className={styles.processNumber}>04</div>
                            <div className={styles.processContent}>
                                <h3>{t('process.steps.deployment.title')}</h3>
                                <p>{t('process.steps.deployment.description')}</p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faqSection}>
                <div className={styles.container}>
                    <AnimatedSection className="text-center mb-12">
                        <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
                    </AnimatedSection>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.accordionItem}>
                                <details className="group">
                                    <summary className={styles.accordionTrigger}>
                                        {faq.question}
                                        <span className="transform transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className={styles.accordionContent}>
                                        <p>{faq.answer}</p>
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
                    <div className={`${styles.floatingElement} ${styles.float1}`}>?</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>💡</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>{t('cta.label')}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{t('cta.titleLine1')}</span>
                                <span className={styles.ctaTitleSolid}>{t('cta.titleLine2')}</span>
                            </h2>
                            <p className={styles.ctaText}>
                                {t('cta.description')}
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>🚀</div>
                                <h3 className={styles.ctaCardTitle}>{t('cta.cardTitle')}</h3>
                                <p className={styles.ctaCardText}>
                                    {t('cta.cardText')}
                                </p>
                                <Button href="/contact" fullWidth className={styles.ctaButton}>
                                    {t('cta.button')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
