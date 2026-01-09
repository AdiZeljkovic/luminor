import AnimatedSection from "@/components/AnimatedSection";
import ServiceCard from "@/components/ServiceCard";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.services' });
    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map(k => k.trim())
    };
}

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'services' });

    const services = [
        {
            title: t('items.webDev.title'),
            description: t('items.webDev.description'),
            icon: "💻",
            href: "/services/web-development",
        },
        {
            title: t('items.design.title'),
            description: t('items.design.description'),
            icon: "🎨",
            href: "/services/graphic-design",
        },
        {
            title: t('items.marketing.title'),
            description: t('items.marketing.description'),
            icon: "📈",
            href: "/services/digital-marketing",
        },
        {
            title: t('items.seo.title'),
            description: t('items.seo.description'),
            icon: "🔍",
            href: "/services/seo",
        },
        {
            title: t('items.ai.title'),
            description: t('items.ai.description'),
            icon: "🤖",
            href: "/services/ai-automation",
        },
    ];

    return (
        <div className={styles.container}>
            <AnimatedSection className={styles.header}>
                <h1 className={styles.title}>
                    <span className={styles.outline}>{t('hero.titleLine1')}</span>
                    <span className={styles.highlight}> {t('hero.titleLine2')}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('hero.description')}
                </p>
            </AnimatedSection>

            <div className={styles.grid}>
                {services.map((service, index) => (
                    <AnimatedSection key={service.title} animation="fade-up" delay={index * 100}>
                        <ServiceCard {...service} index={index} />
                    </AnimatedSection>
                ))}
            </div>

            {/* Premium CTA Section */}
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
                            <div className={styles.ctaCardIcon}>📅</div>
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
    );
}
