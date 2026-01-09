"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { useTranslations } from "next-intl";

export default function HostingPage() {
    const t = useTranslations('hosting');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const plans = [
        {
            name: t('pricing.starter.name'),
            price: t('pricing.starter.price'),
            billingCycle: t('pricing.starter.billingCycle'),
            description: t('pricing.starter.description'),
            features: t.raw('pricing.starter.features') as string[],
            recommended: false,
        },
        {
            name: t('pricing.business.name'),
            price: t('pricing.business.price'),
            billingCycle: t('pricing.business.billingCycle'),
            description: t('pricing.business.description'),
            features: t.raw('pricing.business.features') as string[],
            recommended: true,
        },
        {
            name: t('pricing.enterprise.name'),
            price: t('pricing.enterprise.price'),
            billingCycle: t('pricing.enterprise.billingCycle'),
            description: t('pricing.enterprise.description'),
            features: t.raw('pricing.enterprise.features') as string[],
            recommended: false,
        },
    ];

    const hostingFeatures = [
        {
            title: t('features.uptime.title'),
            description: t('features.uptime.description'),
            icon: "⚡",
        },
        {
            title: t('features.performance.title'),
            description: t('features.performance.description'),
            icon: "🚀",
        },
        {
            title: t('features.security.title'),
            description: t('features.security.description'),
            icon: "🛡️",
        },
        {
            title: t('features.management.title'),
            description: t('features.management.description'),
            icon: "🖱️",
        },
    ];

    const techSpecs = [
        { label: t('specs.cpu.label'), value: t('specs.cpu.value') },
        { label: t('specs.ram.label'), value: t('specs.ram.value') },
        { label: t('specs.storage.label'), value: t('specs.storage.value') },
        { label: t('specs.network.label'), value: t('specs.network.value') },
        { label: t('specs.location.label'), value: t('specs.location.value') },
        { label: t('specs.os.label'), value: t('specs.os.value') },
    ];

    const securityFeatures = [
        { title: t('securitySection.items.imunify.title'), description: t('securitySection.items.imunify.description') },
        { title: t('securitySection.items.ddos.title'), description: t('securitySection.items.ddos.description') },
        { title: t('securitySection.items.waf.title'), description: t('securitySection.items.waf.description') },
        { title: t('securitySection.items.backup.title'), description: t('securitySection.items.backup.description') },
        { title: t('securitySection.items.ssl.title'), description: t('securitySection.items.ssl.description') },
        { title: t('securitySection.items.2fa.title'), description: t('securitySection.items.2fa.description') },
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
        },
    ];

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <AnimatedSection animation="fade-up">
                        <div className={styles.heroContent}>
                            <span className={styles.heroLabel}>{t('hero.label')}</span>
                            <h1 className={styles.heroTitle}>
                                <span className={styles.heroOutline}>{t('hero.titleLine1')}</span>
                                <span className={styles.heroSolid}>{t('hero.titleLine2')}</span>
                            </h1>
                            <p className={styles.heroText}>
                                {t('hero.description')}
                            </p>
                            <Button href="#pricing" size="lg" className={styles.heroButton}>
                                {t('hero.cta')}
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Features Overview */}
            <section className={styles.featuresSection}>
                <div className={styles.container}>
                    <div className={styles.featuresGrid}>
                        {hostingFeatures.map((feature, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.featureCard}>
                                <div className={styles.featureIcon}>{feature.icon}</div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureText}>{feature.description}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className={styles.pricingSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('pricing.title')}</h2>
                        <p className={styles.sectionSubtitle}>{t('pricing.subtitle')}</p>
                    </AnimatedSection>
                    <div className={styles.pricingGrid}>
                        {plans.map((plan, index) => (
                            <AnimatedSection
                                key={plan.name}
                                animation="fade-up"
                                delay={index * 150}
                                className={`${styles.pricingCard} ${plan.recommended ? styles.recommended : ""}`}
                            >
                                {plan.recommended && <span className={styles.badge}>{t('pricing.business.badge')}</span>}
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.price}>
                                    <span className={styles.currency}>€</span>
                                    {plan.price}
                                    <span className={styles.cycle}>{plan.billingCycle}</span>
                                </div>
                                <p className={styles.planDescription}>{plan.description}</p>
                                <ul className={styles.featureList}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={styles.featureItem}>
                                            <span className={styles.check}>✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.action}>
                                    <Button
                                        href={`/contact?subject=Hosting ${plan.name}`}
                                        variant={plan.recommended ? "primary" : "outline"}
                                        fullWidth
                                    >
                                        {t('pricing.cta')} {plan.name}
                                    </Button>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Specs */}
            <section className={styles.specsSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('specs.title')}</h2>
                        <p className={styles.sectionSubtitle}>{t('specs.subtitle')}</p>
                    </AnimatedSection>
                    <div className={styles.specsGrid}>
                        {techSpecs.map((spec, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 50} className={styles.specItem}>
                                <span className={styles.specLabel}>{spec.label}</span>
                                <span className={styles.specValue}>{spec.value}</span>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className={styles.securitySection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('securitySection.title')}</h2>
                        <p className={styles.sectionSubtitle}>{t('securitySection.subtitle')}</p>
                    </AnimatedSection>
                    <div className={styles.securityGrid}>
                        {securityFeatures.map((feature, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 80} className={styles.securityCard}>
                                <h4 className={styles.securityTitle}>{feature.title}</h4>
                                <p className={styles.securityText}>{feature.description}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faqSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
                    </AnimatedSection>
                    <div className={styles.faqList}>
                        {faqs.map((faq, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.accordionItem}>
                                <button
                                    className={styles.accordionTrigger}
                                    onClick={() => toggleFaq(index)}
                                >
                                    {faq.question}
                                    <span className={`${styles.accordionIcon} ${openFaq === index ? styles.accordionIconOpen : ''}`}>▼</span>
                                </button>
                                {openFaq === index && (
                                    <div className={styles.accordionContent}>
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <div className={styles.container}>
                <AnimatedSection animation="scale" className={styles.ctaPanel}>
                    <div className={`${styles.floatingElement} ${styles.float1}`}>☁️</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>🖥️</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>{t('ctaSection.label')}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{t('ctaSection.titleLine1')}</span>
                                <span className={styles.ctaTitleSolid}>{t('ctaSection.titleLine2')}</span>
                            </h2>
                            <p className={styles.ctaText}>
                                {t('ctaSection.description')}
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>📞</div>
                                <h3 className={styles.ctaCardTitle}>{t('ctaSection.cardTitle')}</h3>
                                <p className={styles.ctaCardText}>
                                    {t('ctaSection.cardText')}
                                </p>
                                <Button href="/contact?subject=Hosting Konsultacija" fullWidth className={styles.ctaButton}>
                                    {t('ctaSection.button')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
