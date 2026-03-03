"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { useTranslations, useLocale } from "next-intl";
import { API_URL } from "@/lib/api";

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    published_at: string; // or created_at if published_at is null
    created_at: string;
    author: {
        name: string;
        avatar?: string;
    };
    featured_image: string;
    category: string;
    read_time: number;
}

export default function BlogPage() {
    const t = useTranslations('blog');
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get page from URL query params, default to 1
    const page = parseInt(searchParams.get('page') || '1', 10);
    const categoryParam = searchParams.get('category');

    const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Newsletter state
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    const categories = [
        { id: "all", label: t('categories.all') },
        { id: "web-development", label: t('categories.webDesign') }, // Mapped to backend values
        { id: "seo", label: t('categories.seo') },
        { id: "graphic-design", label: "Graphic Design" }, // Backend value
        { id: "digital-marketing", label: t('categories.marketing') },
        { id: "ai-automation", label: t('categories.ai') },
    ];
    // Backend categories: ['web-development', 'graphic-design', 'digital-marketing', 'seo', 'ai-automation', 'news', 'tutorials']
    // Frontend IDs were: "Web Dizajn", "SEO". 
    // I need to map frontend filter IDs to backend values.
    // Updated IDs in the array above to match backend.

    useEffect(() => {
        fetchPosts();
    }, [activeCategory, page, locale]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/blog?page=${page}&limit=9&locale=${locale}`;
            if (activeCategory !== "all") {
                url += `&category=${activeCategory}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setPosts(data.data);
                if (data.pagination) {
                    setTotalPages(data.pagination.pages);
                }
            }
        } catch (error) {
            console.error("Failed to fetch blog posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();

            if (result.success) {
                setSubscribed(true);
                setEmail("");
            } else {
                setError(result.error || t('newsletter.error'));
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            // Fallback for demo/error purposes - still show success if it's just a connection error for now, 
            // OR show actual error. The user wants it to "work".
            // If the backend is down, we might want to fail gracefully or show an error.
            // For now, let's show the error to be honest.
            setError(t('newsletter.error'));
        } finally {
            setSubmitting(false);
        }
    };

    const featuredPost = posts.length > 0 ? posts[0] : null;
    // Only show separate featured post if on first page and "all" category? 
    // Or always show first post as featured?
    // Let's stick to simple grid for now to avoid duplication if we don't exclude it from grid.
    // The previous design had a dedicated featured section. 
    // I will use the first post as featured and slice(1) for grid ONLY if on page 1 and all categories.
    // For simplicity in this migration step, I'll just render the grid. 
    // OR: Keep the layout: render posts[0] as featured, rest as grid.

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

            {/* Featured Post (Only on first page, unfiltered) */}
            {featuredPost && page === 1 && activeCategory === 'all' && (
                <section className={styles.featuredSection}>
                    <div className={styles.container}>
                        <AnimatedSection animation="fade-up" className={styles.featuredCard}>
                            <div className={styles.featuredImage}>
                                <img src={featuredPost.featured_image} alt={featuredPost.title} />
                                <span className={styles.featuredBadge}>{t('featured')}</span>
                            </div>
                            <div className={styles.featuredContent}>
                                <span className={styles.featuredCategory}>{featuredPost.category}</span>
                                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                                <div className={styles.featuredMeta}>
                                    <span>{featuredPost.author?.name || 'Luminor'}</span>
                                    <span>•</span>
                                    <span>{featuredPost.read_time || 5} {t('minRead')}</span>
                                </div>
                                <Button href={`/blog/${featuredPost.slug}`} className={styles.featuredButton}>
                                    {t('readMore')}
                                </Button>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* Category Filter */}
            <section className={styles.filterSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.filterContainer}>
                        <div className={styles.filterList}>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        // Update URL with new category, reset to page 1
                                        const params = new URLSearchParams();
                                        if (category.id !== "all") {
                                            params.set('category', category.id);
                                        }
                                        params.set('page', '1');
                                        router.push(`?${params.toString()}`);
                                    }}
                                    className={`${styles.filterButton} ${activeCategory === category.id ? styles.active : ""}`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Blog Grid */}
            <section className={styles.blogSection}>
                <div className={styles.container}>
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                        <>
                            <div className={styles.grid}>
                                {/* If showing featured post (page 1 & all), slice(1). Else show all */}
                                {(page === 1 && activeCategory === 'all' ? posts.slice(1) : posts).map((post, index) => (
                                    <AnimatedSection key={post.id} animation="fade-up" delay={index * 100}>
                                        <BlogCard
                                            title={post.title}
                                            excerpt={post.excerpt}
                                            slug={post.slug}
                                            date={post.published_at || post.created_at}
                                            author={post.author}
                                            image={post.featured_image}
                                            category={post.category}
                                            readTime={post.read_time}
                                            priority={index < 3}
                                            locale={locale}
                                        />
                                    </AnimatedSection>
                                ))}
                            </div>

                            {posts.length === 0 && (
                                <div className={styles.noPosts}>
                                    <p>{t('noArticles')}</p>
                                    <Button href="/blog" variant="outline" className={styles.backButton}>
                                        {t('backToBlog')}
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            <div className={styles.pagination}>
                                <button
                                    className={styles.pageButton}
                                    disabled={page === 1}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('page', String(page - 1));
                                        router.push(`?${params.toString()}`);
                                    }}
                                >
                                    {t('pagination.prev')}
                                </button>
                                <span className="px-4 py-2 font-mono">{page} / {totalPages}</span>
                                <button
                                    className={styles.pageButton}
                                    disabled={page >= totalPages}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        params.set('page', String(page + 1));
                                        router.push(`?${params.toString()}`);
                                    }}
                                >
                                    {t('pagination.next')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className={styles.newsletterSection}>
                <div className={styles.container}>
                    <AnimatedSection animation="scale" className={styles.newsletterCard}>
                        <div className={styles.newsletterContent}>
                            {subscribed ? (
                                <div className="text-center py-6">
                                    <div className="text-4xl mb-4">✨</div>
                                    <h3 className="text-2xl font-display font-bold text-white mb-2">{t('newsletter.successTitle')}</h3>
                                    <p className="text-gray-300 font-primary">{t('newsletter.successMessage')}</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className={styles.newsletterTitle}>
                                        <span className={styles.newsletterTitleOutline}>{t('newsletter.titleLine1')}</span>
                                        <span className={styles.newsletterTitleSolid}>{t('newsletter.titleLine2')}</span>
                                    </h2>
                                    <p className={styles.newsletterText}>
                                        {t('newsletter.description')}
                                    </p>
                                    <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                                        <div className={styles.formRow}>
                                            <input
                                                type="email"
                                                placeholder={t('newsletter.placeholder')}
                                                className={styles.newsletterInput}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={submitting}
                                            />
                                            <Button type="submit" className={styles.newsletterButton} disabled={submitting}>
                                                {submitting ? '...' : t('newsletter.subscribe')}
                                            </Button>
                                        </div>
                                        {error && <p className="text-red-400 text-sm font-medium text-center w-full bg-red-900/20 py-2 rounded border border-red-500/30">{error}</p>}
                                    </form>
                                </>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </section >
        </div >
    );
}
