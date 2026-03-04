import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

interface PricingPlan {
    id: number;
    name: string;
    price: number;
    currency: string;
    billing_cycle: string;
    description_en: string | null;
    description_bs: string | null;
    features: string[];
    is_recommended: boolean;
    category: string;
    cta_text: string;
    cta_url: string;
}

const CATEGORY_LABELS: Record<string, { en: string; bs: string }> = {
    'web-development': { en: 'Web Development', bs: 'Web Razvoj' },
    'seo': { en: 'SEO', bs: 'SEO' },
    'hosting': { en: 'Hosting', bs: 'Hosting' },
    'digital-marketing': { en: 'Digital Marketing', bs: 'Digitalni Marketing' },
    'ai-automation': { en: 'AI Automation', bs: 'AI Automatizacija' },
    'general': { en: 'General', bs: 'Opće' },
};

async function getPlans(): Promise<PricingPlan[]> {
    try {
        const res = await fetch(`${API_URL}/api/pricing`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.success ? data.data : [];
    } catch { return []; }
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const plans = await getPlans();

    // Group by category
    const grouped = plans.reduce((acc: Record<string, PricingPlan[]>, plan) => {
        if (!acc[plan.category]) acc[plan.category] = [];
        acc[plan.category].push(plan);
        return acc;
    }, {});

    const categories = Object.keys(grouped);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Luminor Solutions Pricing",
        "itemListElement": plans.map((plan, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": plan.name,
            "description": (locale === 'bs' ? plan.description_bs : plan.description_en) || '',
            "url": `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}pricing`
        }))
    };

    return (
        <div className={styles.page}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <AnimatedSection animation="fade-up" className={styles.heroContent}>
                        <span className={styles.heroLabel}>{locale === 'bs' ? 'Transparentne Cijene' : 'Transparent Pricing'}</span>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroTitleOutline}>{locale === 'bs' ? 'NAŠE' : 'OUR'}</span>
                            <span className={styles.heroTitleSolid}>{locale === 'bs' ? 'CIJENE' : 'PRICING'}</span>
                        </h1>
                        <p className={styles.heroText}>
                            {locale === 'bs'
                                ? 'Jasne i poštene cijene bez skrivenih troškova. Odaberite plan koji odgovara vašim potrebama.'
                                : 'Clear and honest pricing with no hidden fees. Choose the plan that fits your needs.'}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Pricing by Category */}
            {categories.length === 0 ? (
                <section className={styles.emptySection}>
                    <div className={styles.container}>
                        <p className={styles.emptyText}>
                            {locale === 'bs' ? 'Cijene uskoro...' : 'Pricing coming soon...'}
                        </p>
                        <Button href="/contact">{locale === 'bs' ? 'Kontaktirajte nas' : 'Contact Us'}</Button>
                    </div>
                </section>
            ) : (
                categories.map((category) => (
                    <section key={category} className={styles.categorySection}>
                        <div className={styles.container}>
                            <AnimatedSection className={styles.categoryHeader}>
                                <h2 className={styles.categoryTitle}>
                                    {CATEGORY_LABELS[category]?.[locale as 'en' | 'bs'] || CATEGORY_LABELS[category]?.en || category}
                                </h2>
                            </AnimatedSection>

                            <div className={styles.plansGrid}>
                                {grouped[category].map((plan, index) => (
                                    <AnimatedSection key={plan.id} animation="fade-up" delay={index * 100} className={`${styles.planCard} ${plan.is_recommended ? styles.recommended : ''}`}>
                                        {plan.is_recommended && (
                                            <div className={styles.recommendedBadge}>
                                                {locale === 'bs' ? '★ Preporučeno' : '★ Recommended'}
                                            </div>
                                        )}

                                        <h3 className={styles.planName}>{plan.name}</h3>

                                        {(locale === 'bs' ? plan.description_bs : plan.description_en) && (
                                            <p className={styles.planDescription}>
                                                {locale === 'bs' ? plan.description_bs : plan.description_en}
                                            </p>
                                        )}

                                        <div className={styles.planPrice}>
                                            <span className={styles.price}>{plan.currency} {Number(plan.price).toFixed(0)}</span>
                                            <span className={styles.billingCycle}>{plan.billing_cycle}</span>
                                        </div>

                                        {plan.features && plan.features.length > 0 && (
                                            <ul className={styles.featureList}>
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className={styles.featureItem}>
                                                        <span className={styles.featureCheck}>✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <Button
                                            href={plan.cta_url || '/contact'}
                                            variant={plan.is_recommended ? 'primary' : 'outline'}
                                            fullWidth
                                            className={styles.planCta}
                                        >
                                            {plan.cta_text || (locale === 'bs' ? 'Počnite' : 'Get Started')}
                                        </Button>
                                    </AnimatedSection>
                                ))}
                            </div>
                        </div>
                    </section>
                ))
            )}

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <AnimatedSection animation="scale" className={styles.ctaPanel}>
                        <h2 className={styles.ctaTitle}>
                            {locale === 'bs' ? 'Trebate custom rješenje?' : 'Need a custom solution?'}
                        </h2>
                        <p className={styles.ctaText}>
                            {locale === 'bs'
                                ? 'Kontaktirajte nas i dobijte besplatnu procjenu vašeg projekta.'
                                : 'Contact us and get a free estimate for your project.'}
                        </p>
                        <Button href="/contact" size="lg">
                            {locale === 'bs' ? 'Kontaktirajte nas' : 'Contact Us'}
                        </Button>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
