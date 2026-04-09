import Image from "next/image";
import Button from "./Button";
import styles from "./HeroSection.module.css";
import AnimatedSection from "./AnimatedSection";
import { getTranslations } from "next-intl/server";

export default async function HeroSection() {
    const t = await getTranslations('home.hero');

    return (
        <section className={styles.hero}>
            <div className={styles.gridOverlay}></div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <AnimatedSection animation="fade-up" delay={0}>
                        <div className={styles.labelWrapper}>
                            <span className={styles.newLabel}>✨ {t('label')}</span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={200}>
                        <h1 className={styles.title}>
                            <span className={styles.titleOutline}>{t('titleLine1')}</span><br />
                            <span className={styles.titleFilled}>{t('titleLine2')}</span><br />
                            <span className={styles.titleAccent}>{t('titleLine3')}</span>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={400}>
                        <p className={styles.description}>
                            {t('description')}
                        </p>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={600}>
                        <div className={styles.actions}>
                            <Button href="/contact" size="lg" className="btn-primary">
                                {t('ctaPrimary')}
                            </Button>
                            <Button href="/portfolio" size="lg" className="btn-outline">
                                {t('ctaSecondary')}
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Marquee Strip at Bottom */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    <span>STRATEGY • DESIGN • DEVELOPMENT • MARKETING • BRANDING • STRATEGY • DESIGN • DEVELOPMENT • MARKETING • BRANDING •</span>
                    <span>STRATEGY • DESIGN • DEVELOPMENT • MARKETING • BRANDING • STRATEGY • DESIGN • DEVELOPMENT • MARKETING • BRANDING •</span>
                </div>
            </div>
        </section>
    );
}
