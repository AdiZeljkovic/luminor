import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import BlogSidebar from "@/components/BlogSidebar";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";
// Note: You might need to define API_URL in a shared const or env. 
// If not available, I will use process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Fetch post data
async function getPost(slug: string, locale: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/${slug}?locale=${locale}`, {
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

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getPost(slug, locale);

    if (!post) return { title: 'Post Not Found' };

    const title = post[`title_${locale}`] || post.title_en;
    const excerpt = post[`excerpt_${locale}`] || post.excerpt_en || "";

    return {
        title: title,
        description: excerpt,
        openGraph: {
            title: title,
            description: excerpt,
            type: 'article',
            publishedTime: post.published_at,
            authors: [post.author?.name],
            images: post.featuredImage ? [post.featuredImage] : [],
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
            "url": `https://luminor.solutions/author/${post.author?.id}`
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Luminor Solutions",
            "logo": {
                "@type": "ImageObject",
                "url": "https://luminor.solutions/logo.png"
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
                                            alt={title}
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
                            </article>
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebarWrapper}>
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
