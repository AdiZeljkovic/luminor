"use client";

import { useState, useEffect } from "react";
import styles from "./TestimonialsSection.module.css";
import AnimatedSection from "./AnimatedSection";

interface Testimonial {
    id: number;
    client_name: string;
    client_position?: string;
    company_name: string;
    content: string;
    rating: number;
    avatar_url?: string;
}

interface ClientLogo {
    id: number;
    client_name: string;
    logo_url: string;
    website_url?: string;
}

export default function TestimonialsSection() {
    const [reviews, setReviews] = useState<Testimonial[]>([]);
    const [clients, setClients] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch testimonials
                const testimonialsRes = await fetch("http://localhost:5000/api/testimonials/featured");
                const testimonialsData = await testimonialsRes.json();

                if (testimonialsData.success) {
                    setReviews(testimonialsData.data);
                }

                // Fetch client logos
                const logosRes = await fetch("http://localhost:5000/api/client-logos");
                const logosData = await logosRes.json();

                if (logosData.success) {
                    setClients(logosData.data);
                }
            } catch (error) {
                console.error("Error fetching testimonials data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to generate stars
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#FFD700" : "#e0e0e0" }}>★</span>
        ));
    };

    if (loading) return null; // Or a skeleton loader if preferred

    if (reviews.length === 0) return null; // Don't show section if no reviews

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <AnimatedSection className={styles.header}>
                    <h2 className={styles.title}>RIJEČ KLIJENATA</h2>
                    <p className={styles.subtitle}>
                        Ne vjerujte nama. Vjerujte onima koji su već napravili <span className={styles.highlight}>digitalni iskorak</span> sa nama.
                    </p>
                </AnimatedSection>

                <div className={styles.reviewsGrid}>
                    {reviews.map((review, i) => (
                        <AnimatedSection
                            key={review.id}
                            animation="fade-up"
                            delay={i * 100}
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.stars}>
                                    {renderStars(review.rating)}
                                </div>
                                {/* G Reviews badge removed as requested */}
                            </div>

                            <p className={styles.reviewText}>
                                "{review.content}"
                            </p>

                            <div className={styles.clientInfo}>
                                <div className={styles.avatar}>
                                    {review.avatar_url ? (
                                        <img src={review.avatar_url} alt={review.client_name} className={styles.avatarImg} />
                                    ) : (
                                        review.client_name.charAt(0)
                                    )}
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.clientName}>{review.client_name}</span>
                                    <span className={styles.clientCompany}>
                                        {review.client_position ? `${review.client_position}, ` : ''}{review.company_name}
                                    </span>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                {clients.length > 0 && (
                    <AnimatedSection animation="fade-up" delay={400} className={styles.clientsWrapper}>
                        <div className={styles.clientsLabel}>PONOSNO SARAĐUJEMO SA:</div>
                        <div className={styles.marqueeContainer}>
                            <div className={styles.marqueeTrack}>
                                {/* Duplicate arrays to create seamless loop */}
                                {[...clients, ...clients, ...clients].map((client, i) => (
                                    <div key={`${client.id}-${i}`} className={styles.clientLogoItem}>
                                        {client.logo_url ? (
                                            <img
                                                src={client.logo_url}
                                                alt={client.client_name}
                                                className={styles.clientLogoImg}
                                                title={client.client_name}
                                            />
                                        ) : (
                                            <span className={styles.clientLogoText}>{client.client_name}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                )}
            </div>
        </section>
    );
}
