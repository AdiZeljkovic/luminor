import Image from "next/image";
import Link from "next/link";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    author: {
        name: string;
        avatar?: string;
    };
    image?: string;
    category: string;
    readTime: number;
    className?: string;
}

export default function BlogCard({
    title,
    excerpt,
    slug,
    date,
    author,
    image,
    category,
    readTime,
    className = "",
}: BlogCardProps) {
    // Format date
    const formattedDate = new Date(date).toLocaleDateString("sr-RS", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <article className={`${styles.card} ${className}`}>
            {image && (
                <Link href={`/blog/${slug}`} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={image}
                            alt={`${title} - ${category} article cover image`}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                        />
                        <span className={styles.category}>{category}</span>
                    </div>
                </Link>
            )}

            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.date}>{formattedDate}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.readTime}>{readTime} min čitanja</span>
                </div>

                <h3 className={styles.title}>
                    <Link href={`/blog/${slug}`}>{title}</Link>
                </h3>

                <p className={styles.excerpt}>{excerpt}</p>

                <div className={styles.footer}>
                    <div className={styles.author}>
                        {author.avatar ? (
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                width={32}
                                height={32}
                                className={styles.authorAvatar}
                            />
                        ) : (
                            <div className={styles.authorPlaceholder}>
                                {author.name.charAt(0)}
                            </div>
                        )}
                        <span className={styles.authorName}>{author.name}</span>
                    </div>

                    <Link href={`/blog/${slug}`} className={styles.readMore}>
                        Pročitaj više
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}
