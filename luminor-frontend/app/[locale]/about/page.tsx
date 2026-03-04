import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import { Metadata } from "next";
import styles from "./page.module.css";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.about' });
    const title = t('title');
    const description = t('description');
    const canonicalPath = locale === 'en' ? 'about' : `${locale}/about`;
    return {
        title,
        description,
        keywords: t('keywords').split(',').map(k => k.trim()),
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': 'https://www.luminor.solutions/about',
                'bs': 'https://www.luminor.solutions/bs/about',
                'x-default': 'https://www.luminor.solutions/about',
            },
        },
        openGraph: {
            type: 'website',
            title,
            description,
            url: `https://www.luminor.solutions/${canonicalPath}`,
            images: [{ url: 'https://www.luminor.solutions/rocket-hero.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function AboutPage() {
    const t = await getTranslations('about');
    const tValues = await getTranslations('about.values');
    const tStats = await getTranslations('about.stats');
    const tMission = await getTranslations('about.mission');
    const tVision = await getTranslations('about.vision');
    const tStory = await getTranslations('about.story');
    const tCta = await getTranslations('about.cta');
    const tServices = await getTranslations('about.servicesSection');

    const values = [
        {
            title: tValues('innovation.title'),
            description: tValues('innovation.description'),
            icon: "💡",
        },
        {
            title: tValues('transparency.title'),
            description: tValues('transparency.description'),
            icon: "🤝",
        },
        {
            title: tValues('quality.title'),
            description: tValues('quality.description'),
            icon: "💎",
        },
        {
            title: tValues('partnership.title'),
            description: tValues('partnership.description'),
            icon: "📈",
        },
    ];

    const stats = [
        { number: "5+", label: tStats('years') },
        { number: "150+", label: tStats('projects') },
        { number: "50+", label: tStats('clients') },
        { number: "99%", label: tStats('satisfaction') },
    ];

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <AnimatedSection animation="fade-up" className={styles.heroContent}>
                        <span className={styles.heroLabel}>{t('hero.label')}</span>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroTitleOutline}>{t('hero.titleLine1')}</span>
                            <span className={styles.heroTitleSolid}>{t('hero.titleLine2')}</span>
                        </h1>
                        <p className={styles.heroText}>
                            {t('hero.description')}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <div className={styles.container}>
                    <div className={styles.storyGrid}>
                        <AnimatedSection className={styles.storyImageWrapper}>
                            <div className={styles.storyImageFrame}>
                                <Image
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Team collaboration at Luminor Agency - professionals working together on digital solutions"
                                    fill
                                    className={styles.storyImage}
                                    loading="lazy"
                                />
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-up" delay={200} className={styles.storyContent}>
                            <h2 className={styles.storyTitle}>{tStory('title')}</h2>
                            <div className={styles.storyText}>
                                <p>{tStory('p1')}</p>
                                <p>{tStory('p2')}</p>
                                <p>{tStory('p3')}</p>
                            </div>
                            <Button href="/portfolio" variant="outline" size="lg" className={styles.storyButton}>
                                {tStory('cta')}
                            </Button>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={styles.container}>
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.statCard}>
                                <span className={styles.statNumber}>{stat.number}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className={styles.missionSection}>
                <div className={styles.container}>
                    <div className={styles.missionGrid}>
                        <AnimatedSection animation="fade-up" className={styles.missionCard}>
                            <div className={styles.missionIcon}>🎯</div>
                            <h3 className={styles.missionTitle}>{tMission('title')}</h3>
                            <p className={styles.missionText}>
                                {tMission('description')}
                            </p>
                        </AnimatedSection>
                        <AnimatedSection animation="fade-up" delay={150} className={styles.missionCard}>
                            <div className={styles.missionIcon}>🚀</div>
                            <h3 className={styles.missionTitle}>{tVision('title')}</h3>
                            <p className={styles.missionText}>
                                {tVision('description')}
                            </p>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{tValues('title')}</h2>
                        <p className={styles.sectionSubtitle}>{tValues('subtitle')}</p>
                    </AnimatedSection>

                    <div className={styles.valuesGrid}>
                        {values.map((val, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.valueCard}>
                                <div className={styles.valueIcon}>{val.icon}</div>
                                <h3 className={styles.valueTitle}>{val.title}</h3>
                                <p className={styles.valueDesc}>{val.description}</p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className={styles.servicesSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{tServices('title')}</h2>
                        <p className={styles.sectionSubtitle}>{tServices('subtitle')}</p>
                    </AnimatedSection>

                    <AnimatedSection className={styles.centerAction}>
                        <Button href="/services" size="lg">{tStory('cta')}</Button>
                    </AnimatedSection>
                </div>
            </section>

            {/* Premium CTA */}
            <div className={styles.container}>
                <AnimatedSection animation="scale" className={styles.ctaPanel}>
                    <div className={`${styles.floatingElement} ${styles.float1}`}>💼</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>🤝</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>{tCta('label')}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{tCta('titleLine1')}</span>
                                <span className={styles.ctaTitleSolid}>{tCta('titleLine2')}</span>
                            </h2>
                            <p className={styles.ctaText}>
                                {tCta('description')}
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>📞</div>
                                <h3 className={styles.ctaCardTitle}>{tCta('label')}</h3>
                                <p className={styles.ctaCardText}>
                                    {tCta('description')}
                                </p>
                                <Button href="/contact" fullWidth className={styles.ctaButton}>
                                    {t('hero.label')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
