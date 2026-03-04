"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

export default function ContactPage() {
    const t = useTranslations('contact');
    const tForm = useTranslations('contact.form');
    const tFaq = useTranslations('contact.faq');
    const tInfo = useTranslations('contact.info');
    const tSocial = useTranslations('contact.social');

    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/settings`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data?.calendly_url) {
                    setCalendlyUrl(data.data.calendly_url);
                }
            })
            .catch(() => {});
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        budget_range: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const contactInfo = [
        {
            icon: "📞",
            title: tInfo('phone'),
            lines: ["+387 62 574 783", tInfo('workHours')],
        },
        {
            icon: "✉️",
            title: tInfo('email'),
            lines: ["info@luminor.solutions", "support@luminor.solutions"],
        },
        {
            icon: "📍",
            title: tInfo('location'),
            lines: ["Porodice Ribar 39, 71000 Sarajevo, Bosnia and Herzegovina"],
        },
    ];

    const faqs = [
        {
            question: tFaq('q1'),
            answer: tFaq('a1')
        },
        {
            question: tFaq('q2'),
            answer: tFaq('a2')
        },
        {
            question: tFaq('q3'),
            answer: tFaq('a3')
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const subject = formData.service
                ? `Inquiry about ${formData.service} from ${formData.name}`
                : `General Inquiry from ${formData.name}`;

            const res = await fetch(`${API_URL}/api/contact/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, subject })
            });
            const result = await res.json();

            if (result.success) {
                setSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    service: "",
                    budget_range: "",
                    message: "",
                });
            } else {
                setError(result.error || t('form.errorMessage'));
            }
        } catch (error) {
            console.error('Contact error:', error);
            setError(t('form.errorMessage'));
        } finally {
            setSubmitting(false);
        }
    };

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

            {/* Contact Info Cards */}
            <section className={styles.infoSection}>
                <div className={styles.container}>
                    <div className={styles.infoGrid}>
                        {contactInfo.map((info, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.infoCard}>
                                <div className={styles.infoIcon}>{info.icon}</div>
                                <h3 className={styles.infoTitle}>{info.title}</h3>
                                {info.lines.map((line, i) => (
                                    <p key={i} className={styles.infoLine}>{line}</p>
                                ))}
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content: Form + Info */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.mainGrid}>
                        {/* Contact Form */}
                        <AnimatedSection animation="fade-up" className={styles.formCard}>
                            {success ? (
                                <div className={styles.successMessage}>
                                    <div className={styles.successIcon}>✨</div>
                                    <h2 className={styles.successTitle}>{t('form.successTitle')}</h2>
                                    <p className={styles.successText}>{t('form.successMessage')}</p>
                                    <Button onClick={() => setSuccess(false)} variant="outline">
                                        {t('form.sendAnother')}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className={styles.formTitle}>{tForm('title')}</h2>
                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>{tForm('name')} *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className={styles.formInput}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder={tForm('namePlaceholder')}
                                                    disabled={submitting}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>{tForm('email')} *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className={styles.formInput}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder={tForm('emailPlaceholder')}
                                                    disabled={submitting}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>{tForm('phone')}</label>
                                                <input
                                                    type="tel"
                                                    className={styles.formInput}
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder={tForm('phonePlaceholder')}
                                                    disabled={submitting}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>{tForm('service')}</label>
                                                <select
                                                    className={styles.formSelect}
                                                    value={formData.service}
                                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                                    disabled={submitting}
                                                >
                                                    <option value="">{tForm('servicePlaceholder')}</option>
                                                    <option value="web-development">{tForm('serviceOptions.webDev')}</option>
                                                    <option value="graphic-design">{tForm('serviceOptions.design')}</option>
                                                    <option value="digital-marketing">{tForm('serviceOptions.marketing')}</option>
                                                    <option value="seo">{tForm('serviceOptions.seo')}</option>
                                                    <option value="ai-automation">{tForm('serviceOptions.ai')}</option>
                                                    <option value="hosting">{tForm('serviceOptions.hosting')}</option>
                                                    <option value="other">{tForm('serviceOptions.other')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Expected Budget</label>
                                            <select
                                                className={styles.formSelect}
                                                value={formData.budget_range}
                                                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                                                disabled={submitting}
                                            >
                                                <option value="">Select budget range</option>
                                                <option value="under_1000">Under €1,000</option>
                                                <option value="1000_5000">€1,000 – €5,000</option>
                                                <option value="5000_15000">€5,000 – €15,000</option>
                                                <option value="15000_50000">€15,000 – €50,000</option>
                                                <option value="over_50000">Over €50,000</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>{tForm('message')} *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                className={styles.formTextarea}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder={tForm('messagePlaceholder')}
                                                disabled={submitting}
                                            />
                                        </div>

                                        {error && (
                                            <div className={styles.errorMessage}>
                                                {error}
                                            </div>
                                        )}

                                        <Button type="submit" size="lg" fullWidth className={styles.submitButton} disabled={submitting}>
                                            {submitting ? '...' : tForm('submit')}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </AnimatedSection>

                        {/* Sidebar: FAQ + Social */}
                        <div className={styles.sidebar}>
                            <AnimatedSection animation="fade-up" delay={200} className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>{tFaq('title')}</h3>
                                <div className={styles.faqList}>
                                    {faqs.map((faq, index) => (
                                        <div key={index} className={styles.faqItem}>
                                            <button
                                                className={styles.faqTrigger}
                                                onClick={() => toggleFaq(index)}
                                            >
                                                {faq.question}
                                                <span className={`${styles.faqIcon} ${openFaq === index ? styles.faqIconOpen : ''}`}>▼</span>
                                            </button>
                                            {openFaq === index && (
                                                <div className={styles.faqContent}>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AnimatedSection>

                            {/* Social Media Links - Grid Layout */}
                            <AnimatedSection animation="fade-up" delay={300} className={styles.socialCard}>
                                <h3 className={styles.sidebarTitle}>{tSocial('title')}</h3>
                                <div className={styles.socialLinks}>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.linkedin}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span>LinkedIn</span>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.instagram}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                        <span>Instagram</span>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.facebook}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Facebook</span>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.twitter}`}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon}>
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <span>X</span>
                                    </a>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calendly Booking Section */}
            {calendlyUrl && (
                <section className={styles.calendlySection}>
                    <div className={styles.container}>
                        <AnimatedSection className={styles.calendlyWrapper}>
                            <h2 className={styles.calendlyTitle}>
                                {t('hero.label') === 'Contact Us' ? 'Schedule a Free Consultation' : 'Zakažite Besplatnu Konsultaciju'}
                            </h2>
                            <p className={styles.calendlySubtitle}>
                                {t('hero.label') === 'Contact Us'
                                    ? 'Book a 30-minute call to discuss your project'
                                    : 'Rezervišite 30-minutni poziv i razgovarajte s našim timom'}
                            </p>
                            <div
                                className="calendly-inline-widget"
                                data-url={calendlyUrl}
                                style={{ minWidth: '320px', height: '700px' }}
                            />
                            <script
                                type="text/javascript"
                                src="https://assets.calendly.com/assets/external/widget.js"
                                async
                            />
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* Map Section */}
            <section className={styles.mapSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.mapWrapper}>
                        <div className={styles.mapPlaceholder}>
                            <span>🗺️</span>
                            <p>Google Maps Integration</p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
