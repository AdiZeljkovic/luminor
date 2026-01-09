"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    href: string;
    index?: number;
}

export default function ServiceCard({
    title,
    description,
    icon,
    href,
    index = 0,
}: ServiceCardProps) {
    const t = useTranslations('common');

    return (
        <Link
            href={href}
            className={styles.card}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={styles.iconWrapper}>
                <span className={styles.icon}>{icon}</span>
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <span className={styles.link}>
                {t('learnMore')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </Link>
    );
}
