import Image from "next/image";
import Link from "next/link";
import styles from "./PortfolioCard.module.css";

interface PortfolioCardProps {
    title: string;
    category: string;
    image: string;
    slug: string;
    description?: string;
    className?: string;
    priority?: boolean;
}

export default function PortfolioCard({
    title,
    category,
    image,
    slug,
    description,
    className = "",
    priority = false,
}: PortfolioCardProps) {
    // Format category for display (e.g., 'web-development' -> 'Web Development')
    const formattedCategory = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <div className={`${styles.card} ${className} group`}>
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={`${title} - ${formattedCategory} project showcase`}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    loading={priority ? undefined : "lazy"}
                />
                <div className={styles.overlay}>
                    <Link href={`/portfolio/${slug}`} className={styles.viewButton}>
                        Pogledaj Projekat
                    </Link>
                </div>
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{formattedCategory}</span>
                <h3 className={styles.title}>
                    <Link href={`/portfolio/${slug}`}>{title}</Link>
                </h3>
                {description && <p className={styles.description}>{description}</p>}
            </div>
        </div>
    );
}
