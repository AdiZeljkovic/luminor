"use client";

import { useState, useEffect } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { useTranslations, useLocale } from "next-intl";
import { API_URL } from "@/lib/api";

interface Project {
    id: number;
    title: string;
    category: string;
    image: string;
    slug: string;
    description: string;
    client?: string;
    technologies?: string;
    is_featured?: boolean;
}

export default function PortfolioPage() {
    const t = useTranslations('portfolio');
    const locale = useLocale();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [visibleItems, setVisibleItems] = useState(6);

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/portfolio?limit=50&locale=${locale}`);
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data.map((p: any) => ({
                        ...p,
                        image: p.featured_image || p.image || '',
                        description: (p.short_description || p.description || '')
                            .replace(/<[^>]*>?/gm, '')
                            .substring(0, 120) + '...',
                    })));
                }
            } catch (error) {
                console.error("Error fetching portfolio projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [locale]);

    const categories = [
        { id: "all", label: t('filters.all') },
        { id: "web-development", label: t('filters.webDev') },
        { id: "graphic-design", label: t('filters.design') },
        { id: "digital-marketing", label: t('filters.marketing') },
        { id: "seo", label: t('filters.seo') },
        { id: "ai-automation", label: "AI & Automation" },
    ];

    const filteredProjects = activeCategory === "all"
        ? projects
        : projects.filter(project => project.category === activeCategory);

    const displayedProjects = filteredProjects.slice(0, visibleItems);

    const handleLoadMore = () => {
        setVisibleItems(prev => prev + 6);
    };

    return (
        <div className={styles.container}>
            <AnimatedSection className={styles.header}>
                <h1 className={styles.title}>
                    <span className={styles.outline}>{t('hero.titleLine1')}</span><br />
                    <span className={styles.solid}>{t('hero.titleLine2')}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('hero.description')}
                </p>
            </AnimatedSection>
            {/* Note: I adjusted title structure above slightly to match hero style or just use titleLine1/2 inline?
                Original code:
                <h1 className={styles.title}>
                    NAŠ PORTFOLIO
                </h1>
                JSON has titleLine1="OUR WORK", titleLine2="SPEAKS".
                I should respect that split.
            */}

            {/* Filter */}
            <AnimatedSection className={styles.filterContainer}>
                <div className={styles.filterList}>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setActiveCategory(category.id);
                                setVisibleItems(6);
                            }}
                            className={`${styles.filterButton} ${activeCategory === category.id ? styles.active : ""}`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </AnimatedSection>

            {/* Grid */}
            {loading ? (
                <div className={styles.grid}>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonTextSmall}></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.grid}>
                    {displayedProjects.map((project, index) => (
                        <AnimatedSection key={project.slug || project.id} animation="fade-up" delay={index * 100}>
                            <PortfolioCard {...project} priority={index < 3} />
                        </AnimatedSection>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📂</span>
                    <p className={styles.emptyText}>{t('emptyState')}</p>
                    <p className={styles.emptySubtext}>{t('emptyStateHint')}</p>
                </div>
            )}

            {/* Load More */}
            {!loading && visibleItems < filteredProjects.length && (
                <div className={styles.loadMoreContainer}>
                    <Button onClick={handleLoadMore} variant="outline" size="lg">
                        {t('loadMore')}
                    </Button>
                </div>
            )}

            {/* Premium CTA */}
            <AnimatedSection animation="scale" className={styles.ctaPanel}>
                {/* Decorative Background Elements */}
                <div className={`${styles.floatingElement} ${styles.float1}`}>🎨</div>
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
                            <h3 className={styles.ctaCardTitle}>Start a Project</h3>
                            <p className={styles.ctaCardText}>
                                Tell us about your idea and we'll give you a free estimate.
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
