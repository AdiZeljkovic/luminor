import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import AnimatedSection from "@/components/AnimatedSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";
import GalleryLightbox from "@/components/GalleryLightbox";

// Fetch data from API
async function getProjectData(slug: string, locale: string = 'en') {
    try {
        const res = await fetch(`${API_URL}/api/portfolio/${slug}?locale=${locale}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        const json = await res.json();
        if (!json.success) return null;

        const data = json.data;

        const parseJson = (val: any, fallback: any) => {
            if (Array.isArray(val) || (val && typeof val === 'object')) return val;
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch { return fallback; }
            }
            return fallback;
        };

        // Transform backend data to frontend shape
        return {
            title: data.title,
            category: data.category,
            client: data.client_name,
            date: data.completed_at || "2024",
            website: data.project_url || data.client_website,
            description: data.description || '',
            challenge: data.challenge || '',
            solution: data.solution || '',
            results: parseJson(data.results, []),
            technologies: parseJson(data.technologies, []),
            featuredImage: data.featured_image,
            images: parseJson(data.images, []),
            testimonial: parseJson(data.testimonial, null),
            case_study_pdf_url: data.case_study_pdf_url || null
        };
    } catch (error) {
        console.error("Error fetching project:", error);
        return null; // Return null to trigger "Not Found" UI
    }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { slug, locale = 'en' } = await params;
    const project = await getProjectData(slug, locale);
    if (!project) return {};
    const plainDescription = project.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...";
    const canonicalPath = locale === 'en' ? `portfolio/${slug}` : `${locale}/portfolio/${slug}`;

    return {
        title: project.title,
        description: plainDescription,
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': `https://www.luminor.solutions/portfolio/${slug}`,
                'bs': `https://www.luminor.solutions/bs/portfolio/${slug}`,
                'x-default': `https://www.luminor.solutions/portfolio/${slug}`,
            },
        },
        openGraph: {
            title: project.title,
            description: plainDescription,
            images: [{ url: project.featuredImage, width: 1200, height: 630 }],
            type: "article",
            url: `https://www.luminor.solutions/${canonicalPath}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: plainDescription,
            images: [project.featuredImage],
        },
    };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale = 'en' } = await params;
    const isBs = locale === 'bs';
    const project = await getProjectData(slug, locale);

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
    const canonicalUrl = `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}portfolio/${slug}`;

    const formattedDate = project.date
        ? new Date(project.date).toLocaleDateString(isBs ? 'bs-BA' : 'en-GB', { year: 'numeric', month: 'long' })
        : (isBs ? 'Nije navedeno' : 'Not specified');

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
            "url": "https://www.luminor.solutions"
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
                            <span className={styles.infoLabel}>{isBs ? 'Klijent' : 'Client'}</span>
                            <span className={styles.infoValue}>{project.client}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{isBs ? 'Datum' : 'Date'}</span>
                            <span className={styles.infoValue}>{formattedDate}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{isBs ? 'Kategorija' : 'Category'}</span>
                            <span className={styles.infoValue}>{project.category}</span>
                        </div>
                        {project.website && (
                            <div className={styles.infoItem}>
                                <a href={project.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                                    {isBs ? 'Posjetite web stranicu ↗' : 'Visit Website ↗'}
                                </a>
                            </div>
                        )}
                        {project.case_study_pdf_url && (
                            <div className={styles.infoItem}>
                                <a href={project.case_study_pdf_url} download className={styles.websiteLink}>
                                    {locale === 'bs' ? '↓ Case Study PDF' : '↓ Case Study PDF'}
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
                            <h2 className={styles.contentTitle}>{isBs ? 'Izazov' : 'Challenge'}</h2>
                            <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: project.challenge || (isBs ? 'Nije uneseno.' : 'Not provided.') }} />
                        </AnimatedSection>
                        <AnimatedSection animation="fade-up" delay={150} className={styles.contentBlock}>
                            <div className={styles.contentIcon}>💡</div>
                            <h2 className={styles.contentTitle}>{isBs ? 'Rješenje' : 'Solution'}</h2>
                            <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: project.solution || (isBs ? 'Nije uneseno.' : 'Not provided.') }} />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {project.results && project.results.length > 0 && (
                <section className={styles.resultsSection}>
                    <div className={styles.container}>
                        <AnimatedSection className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>{isBs ? 'Rezultati' : 'Results'}</h2>
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
                            <h2 className={styles.sectionTitle}>{isBs ? 'Galerija' : 'Gallery'}</h2>
                        </AnimatedSection>
                        <GalleryLightbox images={project.images} title={project.title} />
                    </div>
                </section>
            )}

            {/* Tech Stack */}
            <section className={styles.techSection}>
                <div className={styles.container}>
                    <AnimatedSection className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{isBs ? 'Korištene tehnologije' : 'Technologies Used'}</h2>
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
                            <blockquote className={styles.quote}>
                                {isBs
                                    ? (project.testimonial.quote_bs || project.testimonial.quote_en || project.testimonial.quote)
                                    : (project.testimonial.quote_en || project.testimonial.quote)}
                            </blockquote>
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
                            <span className={styles.ctaLabel}>{isBs ? 'Sviđa vam se ovaj projekat?' : 'Like what you see?'}</span>
                            <h2 className={styles.ctaTitle}>
                                <span className={styles.ctaTitleOutline}>{isBs ? 'ŽELITE NEŠTO' : 'WANT SOMETHING'}</span>
                                <span className={styles.ctaTitleSolid}>{isBs ? 'SLIČNO?' : 'SIMILAR?'}</span>
                            </h2>
                            <p className={styles.ctaText}>
                                {isBs ? 'Kontaktirajte nas danas i hajde da napravimo nešto sjajno zajedno.' : 'Contact us today and let\'s build something great together.'}
                            </p>
                        </div>

                        <div className={styles.ctaCardWrapper}>
                            <div className={styles.ctaCard}>
                                <div className={styles.ctaCardIcon}>📞</div>
                                <h3 className={styles.ctaCardTitle}>{isBs ? 'Pokrenite projekat' : 'Start a Project'}</h3>
                                <p className={styles.ctaCardText}>
                                    {isBs ? 'Opišite nam vašu ideju i dobit ćete besplatnu procjenu.' : 'Describe your idea and get a free estimate.'}
                                </p>
                                <Button href="/contact" fullWidth className={styles.ctaButton}>
                                    {isBs ? 'Kontaktirajte nas' : 'Contact Us'}
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
                        ← {isBs ? 'Nazad na portfolio' : 'Back to Portfolio'}
                    </Link>
                </div>
            </section>
        </div>
    );
}
