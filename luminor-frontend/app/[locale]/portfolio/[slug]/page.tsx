import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import AnimatedSection from "@/components/AnimatedSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

// Fetch data from API
async function getProjectData(slug: string) {
    try {
        const res = await fetch(`${API_URL}/api/portfolio/${slug}`, {
            cache: 'no-store' // Ensure fresh data
        });

        if (!res.ok) return null;

        const json = await res.json();
        if (!json.success) return null;

        const data = json.data;

        // Transform backend data to frontend shape
        return {
            title: data.title,
            category: data.category,
            client: data.client_name,
            date: data.completed_at || "2024", // Fallback if missing
            website: data.project_url || data.client_website,
            description: data.description,
            challenge: data.challenge,
            solution: data.solution,
            results: Array.isArray(data.results) ? data.results : [],
            technologies: data.technologies || [],
            // Ensure images array has hero image first if needed, or just use featured_image separately
            featuredImage: data.featured_image,
            images: data.images || [],
            testimonial: data.testimonial // { quote, author, role }
        };
    } catch (error) {
        console.error("Error fetching project:", error);
        return null; // Return null to trigger "Not Found" UI
    }
}


export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
    const project = await getProjectData(params.slug);
    if (!project) return {};

    const { slug, locale = 'en' } = params;
    const plainDescription = project.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...";
    const canonicalPath = locale === 'en' ? `portfolio/${slug}` : `${locale}/portfolio/${slug}`;

    return {
        title: project.title,
        description: plainDescription,
        alternates: {
            canonical: `https://luminor.solutions/${canonicalPath}`,
            languages: {
                'en': `https://luminor.solutions/portfolio/${slug}`,
                'bs': `https://luminor.solutions/bs/portfolio/${slug}`,
                'x-default': `https://luminor.solutions/portfolio/${slug}`,
            },
        },
        openGraph: {
            title: project.title,
            description: plainDescription,
            images: [{ url: project.featuredImage, width: 1200, height: 630 }],
            type: "article",
            url: `https://luminor.solutions/${canonicalPath}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: plainDescription,
            images: [project.featuredImage],
        },
    };
}

export default async function ProjectDetail({ params }: { params: { slug: string; locale: string } }) {
    const project = await getProjectData(params.slug);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <p>The project you are looking for does not exist.</p>
                    <Link href="/portfolio" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    const { slug, locale = 'en' } = params;
    const canonicalUrl = `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}portfolio/${slug}`;

    const creativeWorkSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description.replace(/<[^>]*>?/gm, '').substring(0, 500),
        "url": canonicalUrl,
        "image": project.featuredImage,
        "dateCreated": project.date,
        "creator": {
            "@type": "Organization",
            "name": "Luminor Solutions",
            "url": "https://luminor.solutions"
        },
        "genre": project.category,
        ...(project.client ? { "contributor": { "@type": "Organization", "name": project.client } } : {}),
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
            />
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <Image
                        src={project.featuredImage}
                        alt={`${project.title} - ${project.category} project hero image showcasing ${project.client || 'client'} collaboration`}
                        fill
                        className={styles.heroImage}
                        priority
                    />
                    <div className={styles.heroOverlay}></div>
                </div>
                <div className={styles.container}>
                    {/* Breadcrumbs */}
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Portfolio', href: '/portfolio' },
                            { label: project.category, href: `/portfolio?category=${encodeURIComponent(project.category)}` },
                            { label: project.title }
                        ]}
                        className="pt-8"
                    />

                    <AnimatedSection animation="fade-up" className={styles.heroContent}>
                        <span className={styles.heroLabel}>{project.category}</span>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroTitleOutline}>{project.title.split(' ')[0]}</span>
                            <span className={styles.heroTitleSolid}>{project.title.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className={styles.heroText} dangerouslySetInnerHTML={{ __html: project.description }} />
                    </AnimatedSection>
                </div>
            </section>

            {/* Project Info Bar */}
            <section className={styles.infoBar}>
                <div className={styles.container}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{locale === 'bs' ? 'Klijent' : 'Client'}</span>
                            <span className={styles.infoValue}>{project.client}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{locale === 'bs' ? 'Datum' : 'Date'}</span>
                            <span className={styles.infoValue}>{project.date}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{locale === 'bs' ? 'Kategorija' : 'Category'}</span>
                            <span className={styles.infoValue}>{project.category}</span>
                        </div>
                        {project.website && (
                            <div className={styles.infoItem}>
                                <a href={project.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                                    {locale === 'bs' ? 'Poseti Website ↗' : 'Visit Website ↗'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Challenge & Solution */}
            <section className={styles.contentSection}>
                <div className={styles.container}>
                    <div className={styles.contentGrid}>
                        <AnimatedSection animation="fade-up" className={styles.contentBlock}>
                            <div className={styles.contentIcon}>🎯</div>
                            <h2 className={styles.contentTitle}>Izazov</h2>
                            <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: project.challenge || "Nije uneto." }} />
                        </AnimatedSection>
                        <AnimatedSection animation="fade-up" delay={150} className={styles.contentBlock}>
                            <div className={styles.contentIcon}>💡</div>
                            <h2 className={styles.contentTitle}>Rešenje</h2>
                            <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: project.solution || "Nije uneto." }} />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {project.results && project.results.length > 0 && (
                <section className={styles.resultsSection}>
                    <div className={styles.container}>
                        <AnimatedSection className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Rezultati</h2>
                        </AnimatedSection>
                        <div className={styles.resultsGrid}>
                            {project.results.map((result: any, index: number) => (
                                <AnimatedSection key={index} animation="fade-up" delay={index * 100} className={styles.resultCard}>
                                    <span className={styles.resultMetric}>{result.metric}</span>
                                    <span className={styles.resultLabel}>{result.label}</span>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
                <section className={styles.gallerySection}>
                    <div className={styles.container}>
                        <AnimatedSection className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Galerija</h2>
                        </AnimatedSection>
                        <div className={styles.galleryGrid}>
                            {project.images.map((img: string, idx: number) => (
                                <AnimatedSection key={idx} animation="fade-up" delay={idx * 100} className={styles.galleryItem}>
                                    <Image
                                        src={img}
                                        alt={`${project.title} - Project detail screenshot ${idx + 1} showcasing ${project.category} implementation`}
                                        fill
                                        className={styles.galleryImage}
                                        loading={idx === 0 ? "eager" : "lazy"}
                                    />
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Tech Stack */}
            <section className={styles.techSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Korišćene Tehnologije</h2>
                    </AnimatedSection>
                    <div className={styles.techGrid}>
                        {project.technologies.map((tech: string, index: number) => (
                            <AnimatedSection key={tech} animation="fade-up" delay={index * 50} className={styles.techItem}>
                                {tech}
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            {project.testimonial && (
                <section className={styles.testimonialSection}>
                    <div className={styles.container}>
                        <AnimatedSection animation="scale" className={styles.testimonialCard}>
                            <div className={styles.quoteIcon}>"</div>
                            <blockquote className={styles.quote}>{project.testimonial.quote}</blockquote>
                            <div className={styles.author}>
                                <span className={styles.authorName}>{project.testimonial.author}</span>
                                <span className={styles.authorRole}>{project.testimonial.role}</span>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* Premium CTA */}
            <div className={styles.container}>
                <AnimatedSection animation="scale" className={styles.ctaPanel}>
                    <div className={`${styles.floatingElement} ${styles.float1}`}>🚀</div>
                    <div className={`${styles.floatingElement} ${styles.float2}`}>✨</div>

                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaContent}>
                            <span className={styles.ctaLabel}>Svidja vam se ovaj projekat?</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>ŽELITE NEŠTO</span>
                                <span className={styles.ctaTitleSolid}>SLIČNO?</span>
                            </h2>
                            <p className={styles.ctaText}>
                                Kontaktirajte nas danas i hajde da napravimo nešto sjajno zajedno.
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>📞</div>
                                <h3 className={styles.ctaCardTitle}>Započnite Projekat</h3>
                                <p className={styles.ctaCardText}>
                                    Opišite nam vašu ideju i dobićete besplatnu procenu.
                                </p>
                                <Button href="/contact" fullWidth className={styles.ctaButton}>
                                    Kontaktirajte Nas
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>

            {/* Navigation */}
            <section className={styles.navSection}>
                <div className={styles.container}>
                    <Link href="/portfolio" className={styles.navLink}>
                        ← Nazad na Portfolio
                    </Link>
                </div>
            </section>
        </div>
    );
}
