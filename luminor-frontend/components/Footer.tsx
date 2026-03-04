import Link from "next/link";
import React from "react";
import styles from "./Footer.module.css";
import { getTranslations } from "next-intl/server";

import { getSiteSettings } from "@/lib/getSettings";

export default async function Footer() {
    const t = await getTranslations('common');
    const settings = await getSiteSettings();
    const currentYear = new Date().getFullYear();

    const services = [
        { name: t('services.webDevelopment'), href: "/services/web-development" },
        { name: t('services.graphicDesign'), href: "/services/graphic-design" },
        { name: t('services.digitalMarketing'), href: "/services/digital-marketing" },
        { name: t('services.seo'), href: "/services/seo" },
        { name: t('services.aiAutomation'), href: "/services/ai-automation" },
        { name: t('nav.hosting'), href: "/hosting" },
    ];

    const quickLinks = [
        { name: t('nav.home'), href: "/" },
        { name: t('nav.portfolio'), href: "/portfolio" },
        { name: t('nav.about'), href: "/about" },
        { name: t('nav.blog'), href: "/blog" },
        { name: t('nav.contact'), href: "/contact" },
        { name: t('nav.hosting'), href: "/hosting" },
        { name: "FAQ", href: "/faq" },
        { name: "Status", href: "/status" },
    ];

    const socialLinks = [
        { name: "Facebook", href: settings?.social_facebook || "https://facebook.com", icon: "facebook" },
        { name: "Instagram", href: settings?.social_instagram || "https://instagram.com", icon: "instagram" },
        { name: "LinkedIn", href: settings?.social_linkedin || "https://linkedin.com", icon: "linkedin" },
        { name: "Twitter", href: settings?.social_twitter || "https://twitter.com", icon: "twitter" },
    ].filter(link => link.href); // Filter out empty links if needed, or keep defaults

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>Luminor</span>
                            <span className={styles.logoAccent}>.Solutions</span>
                        </Link>
                        <p className={styles.description}>
                            {t('footer.description')}
                        </p>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label={social.name}
                                >
                                    <SocialIcon name={social.icon} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('footer.services')}</h4>
                        <ul className={styles.linkList}>
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link href={service.href} className={styles.link}>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('footer.quickLinks')}</h4>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{t('footer.contact')}</h4>
                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>📍</span>
                                <span>{settings?.contact_address || t('footer.address')}</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>📧</span>
                                <a href={`mailto:${t('footer.email')}`}>
                                    {t('footer.email')}
                                </a>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}>📞</span>
                                <a href={`tel:${t('footer.phone')}`}>
                                    {t('footer.phone')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        <span className={styles.brandHighlight}>Luminor Solutions</span> · Sarajevo © {currentYear}
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">{t('footer.privacy')}</Link>
                        <Link href="/terms">{t('footer.terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Social Icons Component
function SocialIcon({ name }: { name: string }) {
    const icons: { [key: string]: React.ReactNode } = {
        facebook: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        instagram: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        linkedin: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        twitter: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    };

    return icons[name] || null;
}
