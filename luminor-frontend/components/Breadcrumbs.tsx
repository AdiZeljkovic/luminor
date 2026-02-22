import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`${styles.breadcrumbs} ${className}`}>
            <ol itemScope itemType="https://schema.org/BreadcrumbList" className={styles.list}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li
                            key={index}
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                            className={styles.item}
                        >
                            {!isLast && item.href ? (
                                <>
                                    <Link href={item.href} itemProp="item" className={styles.link}>
                                        <span itemProp="name">{item.label}</span>
                                    </Link>
                                    <meta itemProp="position" content={String(index + 1)} />
                                    <span className={styles.separator} aria-hidden="true">/</span>
                                </>
                            ) : (
                                <>
                                    <span itemProp="name" className={styles.current} aria-current="page">
                                        {item.label}
                                    </span>
                                    <meta itemProp="position" content={String(index + 1)} />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
