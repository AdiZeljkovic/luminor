"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./Header.module.css";
import LanguageSwitcher from "./LanguageSwitcher";

const services = [
    { key: "webDevelopment", href: "/services/web-development", icon: "💻" },
    { key: "graphicDesign", href: "/services/graphic-design", icon: "🎨" },
    { key: "digitalMarketing", href: "/services/digital-marketing", icon: "📈" },
    { key: "seo", href: "/services/seo", icon: "🔍" },
    { key: "aiAutomation", href: "/services/ai-automation", icon: "🤖" },
    { key: "mobileApps", href: "/services/mobile-development", icon: "📱" },
    { key: "hosting", href: "/hosting", icon: "🖥️" },
];

const navLinks = [
    { key: "services", href: "/services", hasDropdown: true },
    { key: "portfolio", href: "/portfolio" },
    { key: "process", href: "/process" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const t = useTranslations('common.nav');
    const tServices = useTranslations('common.services');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, [pathname]);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
        <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>Luminor</span>
                    <span className={styles.logoAccent}>.Solutions</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <div
                            key={link.key}
                            className={styles.navItem}
                            onMouseEnter={() => link.hasDropdown && setIsDropdownOpen(true)}
                            onMouseLeave={() => link.hasDropdown && setIsDropdownOpen(false)}
                        >
                            <Link
                                href={link.href}
                                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ""}`}
                            >
                                {t(link.key)}
                                {link.hasDropdown && (
                                    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>

                            {/* Dropdown for Services */}
                            {link.hasDropdown && (
                                <div className={`${styles.dropdown} ${isDropdownOpen ? styles.dropdownOpen : ""}`}>
                                    <div className={styles.dropdownContent}>
                                        {services.map((service) => (
                                            <Link key={service.key} href={service.href} className={styles.dropdownLink}>
                                                <span className={styles.dropdownIcon}>{service.icon}</span>
                                                <span>{tServices(service.key)}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>



                {/* Right Side Actions */}
                <div className={styles.actions}>
                    {/* CTA Button */}
                    <Link href="/portal" className={styles.ctaButton}>
                        {t('clientArea')}
                    </Link>

                    {/* Language Switcher */}
                    <div className={styles.desktopSwitcher}>
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`}>
                <nav className={styles.mobileNavContent}>
                    {navLinks.map((link) => (
                        <div key={link.key} className={styles.mobileNavItem}>
                            {link.hasDropdown ? (
                                <>
                                    <button
                                        className={styles.mobileNavLink}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {t(link.key)}
                                        <svg className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`${styles.mobileDropdown} ${isDropdownOpen ? styles.mobileDropdownOpen : ""}`}>
                                        {services.map((service) => (
                                            <Link key={service.key} href={service.href} className={styles.mobileDropdownLink}>
                                                <span className={styles.dropdownIcon}>{service.icon}</span>
                                                {tServices(service.key)}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ""}`}
                                >
                                    {t(link.key)}
                                </Link>
                            )}
                        </div>
                    ))}
                    <div className={styles.mobileSwitcherContainer}>
                        <LanguageSwitcher />
                    </div>
                    <Link href="/portal" className={styles.mobileCta}>
                        {t('clientArea')}
                    </Link>
                </nav>
            </div>
        </header >
        </>
    );
}
