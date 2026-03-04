import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import BlogSidebar from "@/components/BlogSidebar";
import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

// Fetch post data
async function getPost(slug: string, locale: string) {
    try {
        const res = await fetch(`${API_URL}/api/blog/${slug}?locale=${locale}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

// Fetch related posts
async function getRelatedPosts(category: string, currentSlug: string, locale: string, limit: number = 3) {
    try {
        const res = await fetch(`${API_URL}/api/blog?category=${encodeURIComponent(category)}&locale=${locale}&limit=${limit + 5}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) return [];

        const data = await res.json();
        if (!data.success || !data.data) return [];

        // Filter out current post and limit results
        return data.data.filter((post: any) => post.slug !== currentSlug).slice(0, limit);
    } catch (error) {
        console.error("Error fetching related posts:", error);
        return [];
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getPost(slug, locale);

    if (!post) return { title: 'Post Not Found' };

    const title = post[`title_${locale}`] || post.title_en;
    const excerpt = post[`excerpt_${locale}`] || post.excerpt_en || "";

    const canonicalPath = locale === 'en' ? `blog/${slug}` : `${locale}/blog/${slug}`;

    return {
        title: title,
        description: excerpt,
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': `https://www.luminor.solutions/blog/${slug}`,
                'bs': `https://www.luminor.solutions/bs/blog/${slug}`,
                'x-default': `https://www.luminor.solutions/blog/${slug}`,
            },
        },
        openGraph: {
            title: title,
            description: excerpt,
            type: 'article',
            publishedTime: post.published_at,
            authors: [post.author?.name],
            images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [],
            url: `https://www.luminor.solutions/${canonicalPath}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;
    const post = await getPost(slug, locale);

    if (!post) {
        notFound();
    }

    const title = post[`title_${locale}`] || post.title_en;
    const content = post[`content_${locale}`] || post.content_en;
    const category = post.category || "Uncategorized";
    const authorName = post.author?.name || "Luminor Team";
    const authorAvatar = post.author?.avatar || "/images/avatar-default.png";

    // Fetch related posts
    const relatedPosts = await getRelatedPosts(category, slug, locale, 3);

    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": post.featuredImage ? [post.featuredImage] : [],
        "datePublished": post.published_at,
        "dateModified": post.updatedAt,
        "author": [{
            "@type": "Person",
            "name": authorName,
            "url": `https://www.luminor.solutions/author/${post.author?.id}`
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Luminor Solutions",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.luminor.solutions/logo.png"
            }
        },
        "description": post[`excerpt_${locale}`] || post.excerpt_en
    };

    return (
        <div className={styles.page}>
            {/* Inject Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        {/* Breadcrumbs */}
                        <Breadcrumbs
                            items={[
                                { label: 'Home', href: '/' },
                                { label: 'Blog', href: '/blog' },
                                { label: category, href: `/blog?category=${encodeURIComponent(category)}` },
                                { label: title }
                            ]}
                        />

                        <AnimatedSection>
                            <article className={styles.article}>

                                {/* Header */}
                                <header className={styles.header}>
                                    <div className={styles.meta}>
                                        <span className={styles.category}>
                                            {category}
                                        </span>
                                        <span>{new Date(post.published_at).toLocaleDateString(locale)}</span>
                                        <span>•</span>
                                        <span>{post.read_time || 5} min read</span>
                                    </div>

                                    <h1 className={styles.title}>
                                        {title}
                                    </h1>

                                    <div className={styles.author}>
                                        <Image
                                            src={authorAvatar}
                                            alt={authorName}
                                            width={48}
                                            height={48}
                                            className={styles.authorImage}
                                        />
                                        <div>
                                            <div className={styles.authorName}>{authorName}</div>
                                            <div className={styles.authorRole}>Author</div>
                                        </div>
                                    </div>
                                </header>

                                {/* Featured Image */}
                                {post.featuredImage && (
                                    <div className={styles.featuredImage}>
                                        <Image
                                            src={post.featuredImage}
                                            alt={`${title} - Featured image for article about ${post.category || 'digital solutions'}`}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div
                                    className={`${styles.content} prose prose-lg max-w-none text-gray-600 prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-yellow-600 hover:prose-a:text-yellow-700`}
                                    dangerouslySetInnerHTML={{ __html: content }}
                                >
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className={styles.tagsSection}>
                                        <h3 className={styles.tagsTitle}>Tags:</h3>
                                        <div className={styles.tagsList}>
                                            {post.tags.map((tag: string) => (
                                                <Link
                                                    key={tag}
                                                    href={`/blog/tag/${tag}`}
                                                    className={styles.tag}
                                                >
                                                    #{tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share Buttons */}
                                {(() => {
                                    const canonicalPath = locale === 'en' ? `blog/${slug}` : `${locale}/blog/${slug}`;
                                    const shareUrl = encodeURIComponent(`https://www.luminor.solutions/${canonicalPath}`);
                                    const shareTitle = encodeURIComponent(title);
                                    return (
                                        <div className={styles.tagsSection}>
                                            <h3 className={styles.tagsTitle}>Share:</h3>
                                            <div className={styles.tagsList}>
                                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className={styles.tag}>LinkedIn</a>
                                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className={styles.tag}>Facebook</a>
                                                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className={styles.tag}>X / Twitter</a>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </article>
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebarWrapper}>
                        <BlogSidebar />
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className={styles.relatedSection}>
                        <div className={styles.container}>
                            <AnimatedSection>
                                <h2 className={styles.relatedTitle}>Related Articles</h2>
                                <p className={styles.relatedSubtitle}>
                                    More articles from {category}
                                </p>
                            </AnimatedSection>

                            <div className={styles.relatedGrid}>
                                {relatedPosts.map((relatedPost: any, index: number) => (
                                    <AnimatedSection key={relatedPost.id || index} animation="fade-up" delay={index * 100}>
                                        <BlogCard
                                            title={relatedPost[`title_${locale}`] || relatedPost.title_en}
                                            excerpt={relatedPost[`excerpt_${locale}`] || relatedPost.excerpt_en || ''}
                                            slug={relatedPost.slug}
                                            date={relatedPost.published_at}
                                            author={{
                                                name: relatedPost.author?.name || 'Luminor Team',
                                                avatar: relatedPost.author?.avatar
                                            }}
                                            image={relatedPost.featured_image}
                                            category={relatedPost.category}
                                            readTime={relatedPost.read_time || 5}
                                        />
                                    </AnimatedSection>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
