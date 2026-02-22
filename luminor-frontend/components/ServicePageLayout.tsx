"use client";

import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import Button from "./Button";
import PortfolioCard from "./PortfolioCard";

interface ProcessStep {
    title: string;
    description: string;
    icon: string;
}

interface ServicePageLayoutProps {
    title: string;
    description: string;
    icon: string;
    heroImage?: string;
    detailedDescription: string;
    process: ProcessStep[];
    faq: { question: string; answer: string }[];
    portfolioCategory: string;
}

// Dummy portfolio data - would ideally come from props or API
const dummyPortfolio = [
    {
        title: "Projekat 1",
        category: "web-development",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "projekat-1",
    },
    {
        title: "Projekat 2",
        category: "web-development",
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "projekat-2",
    },
    {
        title: "Projekat 3",
        category: "web-development",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        slug: "projekat-3",
    },
];

export default function ServicePageLayout({
    title,
    description,
    icon,
    heroImage,
    detailedDescription,
    process,
    faq,
    portfolioCategory,
}: ServicePageLayoutProps) {
    // FAQ Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <>
            {/* Inject FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <AnimatedSection className="lg:w-1/2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-4xl mb-6">
                                {icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                {title}
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                {description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button href="/contact" size="lg">započni projekat</Button>
                                <Button href="#portfolio" variant="outline" size="lg">vidi radove</Button>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="scale" delay={200} className="lg:w-1/2 relative">
                            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                                {/* Fallback pattern if no image */}
                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white/10">
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
                                    </svg>
                                </div>
                                {heroImage && (
                                    <Image
                                        src={heroImage}
                                        alt={`${title} - Professional digital service illustration showcasing modern solutions`}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                )}
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Detailed Description */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Šta je {title}?</h2>
                        <div className="prose prose-lg mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: detailedDescription }} />
                    </AnimatedSection>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Naš Proces</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Kako dolazimo do savršenog rešenja za vaše potrebe.
                        </p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((step, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 150} className="relative">
                                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow h-full border border-gray-100">
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>

                                    {/* Connector Line (desktop only) */}
                                    {index < process.length - 1 && (
                                        <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gray-200 z-10"></div>
                                    )}
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Examples */}
            <section id="portfolio" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Izabrani Radovi</h2>
                            <p className="text-gray-600">Primeri uspešnih projekata u kategoriji {title}.</p>
                        </div>
                        <Button href={`/portfolio?category=${portfolioCategory}`} variant="outline" icon="→" iconPosition="right">
                            Svi {title} projekti
                        </Button>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {dummyPortfolio.map((item, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                                <PortfolioCard {...item} />
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-orange-50/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Česta Pitanja</h2>
                    </AnimatedSection>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faq.map((item, index) => (
                            <AnimatedSection key={index} animation="fade-up" delay={index * 50}>
                                <details className="group bg-white rounded-xl shadow-sm border border-gray-100 open:border-orange-200 transition-all">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 list-none">
                                        <span>{item.question}</span>
                                        <span className="transition-transform group-open:rotate-180">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M6 9L12 15L18 9" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {item.answer}
                                    </div>
                                </details>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection animation="scale" className="bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Spremni za {title}?</h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Kontaktirajte nas danas i hajde da zajedno kreiramo nešto izvanredno.
                            </p>
                            <Button href="/contact" size="lg" className="bg-white text-gray-900 hover:bg-yellow-500">
                                Zatražite Ponudu
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}
