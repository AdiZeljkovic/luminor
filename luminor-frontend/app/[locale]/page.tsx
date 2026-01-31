import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import PortfolioCard from "@/components/PortfolioCard";
import AnimatedSection from "@/components/AnimatedSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { getTranslations } from 'next-intl/server';
import { Metadata } from "next";
import { API_URL } from "@/lib/api";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(',').map(k => k.trim()),
    openGraph: {
      title: t('title'),
      description: t('description'),
    }
  };
}

export default async function Home() {
  const t = await getTranslations('home');
  const tServices = await getTranslations('home.services');
  const tWhyUs = await getTranslations('home.whyUs');
  const tPortfolio = await getTranslations('home.portfolio');
  const tCta = await getTranslations('home.cta');

  // Services with translations
  const services = [
    {
      title: tServices('webDev.title'),
      description: tServices('webDev.description'),
      icon: "💻",
      href: "/services/web-development",
    },
    {
      title: tServices('design.title'),
      description: tServices('design.description'),
      icon: "🎨",
      href: "/services/graphic-design",
    },
    {
      title: tServices('marketing.title'),
      description: tServices('marketing.description'),
      icon: "📈",
      href: "/services/digital-marketing",
    },
    {
      title: tServices('seo.title'),
      description: tServices('seo.description'),
      icon: "🔍",
      href: "/services/seo",
    },
    {
      title: tServices('ai.title'),
      description: tServices('ai.description'),
      icon: "🤖",
      href: "/services/ai-automation",
    },
    {
      title: tServices('hosting.title'),
      description: tServices('hosting.description'),
      icon: "⚡",
      href: "/hosting",
    },
  ];

  // Fetch featured projects from API
  let portfolioItems: Array<{
    id?: number;
    title: string;
    category: string;
    image: string;
    slug: string;
    description: string;
  }> = [];

  try {
    const res = await fetch(`${API_URL}/api/portfolio/featured`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (data.success && data.data) {
      portfolioItems = data.data;
    }
  } catch (error) {
    console.error("Error fetching featured projects:", error);
  }

  return (
    <>
      <HeroSection />

      {/* Services Overview */}
      <section className={styles.section}>
        <div className="container">
          <AnimatedSection className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{tServices('title')}</h2>
            <p className={styles.sectionSubtitle}>
              {tServices('subtitle')}
            </p>
          </AnimatedSection>

          <div className={styles.grid}>
            {services.map((service, index) => (
              <AnimatedSection key={service.title} animation="fade-up" delay={index * 100}>
                <ServiceCard {...service} index={index} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className="container">
          <AnimatedSection className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{tWhyUs('title')}</h2>
            <p className={styles.sectionSubtitle}>
              {tWhyUs('subtitle')}
            </p>
          </AnimatedSection>

          <div className={styles.featuresGrid}>
            <AnimatedSection animation="fade-up" delay={0} className={styles.featureCard}>
              <span className={styles.featureNumber}>01</span>
              <h3 className={styles.featureTitle}>{tWhyUs('expertise.title')}</h3>
              <p className={styles.featureText}>
                {tWhyUs('expertise.description')}
              </p>
              <div className={styles.featureDecoration}></div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100} className={styles.featureCard}>
              <span className={styles.featureNumber}>02</span>
              <h3 className={styles.featureTitle}>{tWhyUs('results.title')}</h3>
              <p className={styles.featureText}>
                {tWhyUs('results.description')}
              </p>
              <div className={styles.featureDecoration}></div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200} className={styles.featureCard}>
              <span className={styles.featureNumber}>03</span>
              <h3 className={styles.featureTitle}>{tWhyUs('partnership.title')}</h3>
              <p className={styles.featureText}>
                {tWhyUs('partnership.description')}
              </p>
              <div className={styles.featureDecoration}></div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300} className={styles.featureCard}>
              <span className={styles.featureNumber}>04</span>
              <h3 className={styles.featureTitle}>{tWhyUs('support.title')}</h3>
              <p className={styles.featureText}>
                {tWhyUs('support.description')}
              </p>
              <div className={styles.featureDecoration}></div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      {portfolioItems.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <AnimatedSection className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{tPortfolio('title')}</h2>
              <p className={styles.sectionSubtitle}>
                {tPortfolio('subtitle')}
              </p>
            </AnimatedSection>

            <div className={styles.portfolioGrid}>
              {portfolioItems.map((item, index) => (
                <AnimatedSection key={item.slug || item.id} animation="fade-up" delay={index * 150}>
                  <PortfolioCard {...item} />
                </AnimatedSection>
              ))}
            </div>

            <div className={styles.centerAction}>
              <Button href="/portfolio" variant="outline" size="lg" icon="→" iconPosition="right">
                {tPortfolio('viewAll')}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className="container">
          <AnimatedSection animation="fade-up" className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              <span className={styles.ctaOutline}>{tCta('titleLine1')}</span>
              <br />
              <span className={styles.ctaSolid}>{tCta('titleLine2')}</span>
            </h2>
            <p className={styles.ctaText}>
              {tCta('description')}
            </p>
            <div className={styles.ctaButtons}>
              <Button href="/contact" size="lg" className={styles.whiteButton}>
                {tCta('button')}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
