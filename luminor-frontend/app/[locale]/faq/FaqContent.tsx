"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import AnimatedSection from "@/components/AnimatedSection";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

interface FAQItem {
    id: number;
    question_en: string;
    question_bs: string;
    answer_en: string;
    answer_bs: string;
    category: string;
    order_num: number;
}

const CATEGORY_LABELS: Record<string, { en: string; bs: string }> = {
    general: { en: "General", bs: "Opće" },
    "web-development": { en: "Web Development", bs: "Web Razvoj" },
    seo: { en: "SEO", bs: "SEO" },
    hosting: { en: "Hosting", bs: "Hosting" },
    pricing: { en: "Pricing", bs: "Cijene" },
    process: { en: "Our Process", bs: "Naš Proces" },
};

const STATIC_FAQS: FAQItem[] = [
    {
        id: -1,
        category: "general",
        order_num: 0,
        question_en: "What services does Luminor Solutions offer?",
        question_bs: "Koje usluge nudi Luminor Solutions?",
        answer_en: "We offer web development, graphic design, digital marketing, SEO optimization, AI & automation solutions, and hosting services. Each service is tailored to your business needs.",
        answer_bs: "Nudimo web razvoj, grafički dizajn, digitalni marketing, SEO optimizaciju, AI i automatizacijska rješenja te hosting usluge. Svaka usluga je prilagođena vašim poslovnim potrebama.",
    },
    {
        id: -2,
        category: "process",
        order_num: 1,
        question_en: "How long does it take to build a website?",
        question_bs: "Koliko dugo traje izrada web stranice?",
        answer_en: "A typical website takes 2-6 weeks depending on complexity. A simple business site takes 2-3 weeks, while a full e-commerce platform can take 4-8 weeks. We'll give you an exact timeline after our initial consultation.",
        answer_bs: "Tipična web stranica traje 2-6 sedmica ovisno o složenosti. Jednostavna poslovna stranica traje 2-3 sedmice, dok kompletan e-commerce može trajati 4-8 sedmica. Dajemo vam tačan vremenski okvir nakon konzultacija.",
    },
    {
        id: -3,
        category: "process",
        order_num: 2,
        question_en: "Do you work with clients outside of Bosnia and Herzegovina?",
        question_bs: "Da li radite s klijentima izvan Bosne i Hercegovine?",
        answer_en: "Absolutely! We work with clients across Europe, North America, and worldwide. Our team communicates in Bosnian/Croatian/Serbian and English, making collaboration seamless regardless of location.",
        answer_bs: "Apsolutno! Radimo s klijentima širom Evrope, Sjeverne Amerike i cijelog svijeta. Naš tim komunicira na bosanskom/hrvatskom/srpskom i engleskom, što čini saradnju jednostavnom bez obzira na lokaciju.",
    },
    {
        id: -4,
        category: "pricing",
        order_num: 3,
        question_en: "How much does a website cost?",
        question_bs: "Koliko košta web stranica?",
        answer_en: "Website prices vary based on complexity and features. A basic business website starts from €500, while complex platforms with custom functionality start from €2,000+. Contact us for a free detailed quote.",
        answer_bs: "Cijene web stranica variraju ovisno o složenosti i funkcijama. Osnovna poslovna stranica počinje od 500€, dok složene platforme s prilagođenim funkcijama počinju od 2.000€+. Kontaktirajte nas za besplatan detaljni troškovnik.",
    },
    {
        id: -5,
        category: "pricing",
        order_num: 4,
        question_en: "Do you offer payment plans?",
        question_bs: "Da li nudite planove plaćanja?",
        answer_en: "Yes, we typically split projects into milestones: 30% upfront, 40% at midpoint, and 30% upon delivery. For larger projects, we can arrange custom payment schedules.",
        answer_bs: "Da, obično dijelimo projekte na faze: 30% unaprijed, 40% na sredini i 30% pri isporuci. Za veće projekte možemo dogovoriti prilagođene rasporede plaćanja.",
    },
    {
        id: -6,
        category: "web-development",
        order_num: 5,
        question_en: "What's included in a website package?",
        question_bs: "Šta je uključeno u paket web stranice?",
        answer_en: "Our web packages include design, development, mobile responsiveness, basic SEO setup, contact form, 1 month of free support, and training on how to manage your content. Hosting and domain are optional add-ons.",
        answer_bs: "Naši web paketi uključuju dizajn, razvoj, prilagodbu za mobilne uređaje, osnovno SEO podešavanje, kontakt formu, 1 mjesec besplatne podrške i obuku za upravljanje sadržajem. Hosting i domena su opcijski dodaci.",
    },
    {
        id: -7,
        category: "seo",
        order_num: 6,
        question_en: "How long does it take to see SEO results?",
        question_bs: "Koliko dugo traje da se vide rezultati SEO-a?",
        answer_en: "SEO is a long-term strategy. You can expect to see initial improvements in 2-3 months, with significant results in 4-6 months. We provide monthly reports so you can track progress.",
        answer_bs: "SEO je dugoročna strategija. Možete očekivati početna poboljšanja za 2-3 mjeseca, uz značajne rezultate za 4-6 mjeseci. Pružamo mjesečne izvještaje kako biste mogli pratiti napredak.",
    },
    {
        id: -8,
        category: "hosting",
        order_num: 7,
        question_en: "What hosting plans do you offer?",
        question_bs: "Koje planove hostinga nudite?",
        answer_en: "We offer shared hosting, VPS hosting, and dedicated server solutions. All plans include SSL certificates, daily backups, 99.9% uptime guarantee, and 24/7 technical support.",
        answer_bs: "Nudimo shared hosting, VPS hosting i rješenja sa dedicated serverima. Svi planovi uključuju SSL certifikate, dnevne sigurnosne kopije, garanciju dostupnosti od 99,9% i 24/7 tehničku podršku.",
    },
    {
        id: -9,
        category: "general",
        order_num: 8,
        question_en: "Do you provide support after the project is done?",
        question_bs: "Da li pružate podršku nakon završetka projekta?",
        answer_en: "Yes! All projects include 1 month of free support. After that, we offer maintenance packages (monthly retainers) for ongoing updates, security monitoring, and technical support.",
        answer_bs: "Da! Svi projekti uključuju 1 mjesec besplatne podrške. Nakon toga nudimo pakete održavanja (mjesečni retaineri) za redovna ažuriranja, praćenje sigurnosti i tehničku podršku.",
    },
    {
        id: -10,
        category: "general",
        order_num: 9,
        question_en: "Can you help redesign my existing website?",
        question_bs: "Možete li pomoći s redizajnom moje postojeće stranice?",
        answer_en: "Absolutely! We specialize in website redesigns. We analyze your current site, identify issues, and create a modern, high-performing replacement while preserving your SEO rankings and content.",
        answer_bs: "Apsolutno! Specijalizovani smo za redizajn web stranica. Analiziramo vašu trenutnu stranicu, identificiramo probleme i kreiramo moderni, visokoučinkovit zamjenu uz čuvanje vaših SEO pozicija i sadržaja.",
    },
];

export default function FAQPage() {
    const locale = useLocale();
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await fetch(`${API_URL}/api/faq?locale=${locale}`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setFaqs(data.data);
                } else {
                    setFaqs(STATIC_FAQS);
                }
            } catch {
                setFaqs(STATIC_FAQS);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, [locale]);

    const getQuestion = (faq: FAQItem) =>
        locale === "bs" ? faq.question_bs : faq.question_en;
    const getAnswer = (faq: FAQItem) =>
        locale === "bs" ? faq.answer_bs : faq.answer_en;

    const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))];
    const filtered = activeCategory === "all" ? faqs : faqs.filter((f) => f.category === activeCategory);

    // JSON-LD FAQPage schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: getQuestion(faq),
            acceptedAnswer: {
                "@type": "Answer",
                text: getAnswer(faq),
            },
        })),
    };

    const title = locale === "bs" ? "Često Postavljana Pitanja" : "Frequently Asked Questions";
    const subtitle =
        locale === "bs"
            ? "Pronađite odgovore na najčešća pitanja o našim uslugama"
            : "Find answers to the most common questions about our services";

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <main className={styles.page}>
                <AnimatedSection className={styles.hero}>
                    <div className={styles.container}>
                        <span className={styles.badge}>FAQ</span>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.subtitle}>{subtitle}</p>
                    </div>
                </AnimatedSection>

                <section className={styles.faqSection}>
                    <div className={styles.container}>
                        {/* Category Filter */}
                        <div className={styles.categories}>
                            {categories.map((cat) => {
                                const label =
                                    cat === "all"
                                        ? locale === "bs" ? "Sve" : "All"
                                        : (CATEGORY_LABELS[cat]?.[locale as "en" | "bs"] || cat);
                                return (
                                    <button
                                        key={cat}
                                        className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ""}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* FAQ Accordion */}
                        {loading ? (
                            <div className={styles.loading}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={styles.skeleton} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.accordion}>
                                {filtered.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className={`${styles.item} ${openId === faq.id ? styles.open : ""}`}
                                    >
                                        <button
                                            className={styles.question}
                                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                            aria-expanded={openId === faq.id}
                                        >
                                            <span>{getQuestion(faq)}</span>
                                            <span className={styles.icon}>
                                                {openId === faq.id ? "−" : "+"}
                                            </span>
                                        </button>
                                        <div className={styles.answer}>
                                            <p>{getAnswer(faq)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <AnimatedSection className={styles.cta}>
                            <p className={styles.ctaText}>
                                {locale === "bs"
                                    ? "Niste pronašli odgovor na vaše pitanje?"
                                    : "Didn't find the answer you were looking for?"}
                            </p>
                            <a href="/contact" className={styles.ctaButton}>
                                {locale === "bs" ? "Kontaktirajte nas" : "Contact Us"}
                            </a>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
        </>
    );
}
