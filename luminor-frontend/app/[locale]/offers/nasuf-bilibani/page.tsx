import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../offer.module.css';
import customStyles from './nasuf-bilibani.module.css';
import OfferPrintButton from '@/components/OfferPrintButton';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
    title: 'Ponuda — Izrada Web Shopa | Luminor Solutions',
    robots: { index: false, follow: false },
};

export default async function NasufBilibaniOffer({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const today = new Date().toLocaleDateString('bs-BA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const includes = [
        'Custom dizajn web shopa (unikatni UI po brendu)',
        'Custom admin panel za upravljanje shopom',
        'Upravljanje narudžbama (pregled, status, export)',
        'Upravljanje produktima — dodavanje, uređivanje, brisanje',
        'Kategorije, filteri i pretraga produkata',
        'Korisnički nalozi i registracija kupaca',
        'Integracija online plaćanja — kartice (Stripe)',
        'PayPal / lokalna plaćanja (po potrebi)',
        'Responsive dizajn — mobile, tablet, desktop',
        'Optimizacija brzine i Core Web Vitals',
        'Osnovni SEO setup (meta tagovi, strukturirani podaci)',
        '30 dana besplatne tehničke podrške po isporuci',
    ];

    const notIncluded = [
        'Hosting i domena (zasebno — vidi preporuku ispod)',
        'Grafički dizajn / logo i branding',
        'Pisanje tekstova i opisa produkata',
        'Fotografije i vizualni materijali produkata',
        'Plaćene integracije trećih strana (ERP, skladište...)',
    ];

    const techStack = [
        'Next.js 14+ (React framework)',
        'Node.js — backend API',
        'PostgreSQL — baza podataka',
        'Stripe — integracija plaćanja',
        'Custom Admin Panel (bez WordPress/WooCommerce)',
        'Vercel / VPS deployment',
        'Cloudflare — CDN & zaštita',
    ];

    const process = [
        {
            title: 'Discovery & Planiranje',
            desc: 'Definišemo strukturu shopa, kategorije, tok narudžbe i sve poslovne zahtjeve. Potpisujemo ugovor.',
            duration: '2–3 dana',
        },
        {
            title: 'Dizajn & Prototype',
            desc: 'Kreiramo Figma prototype svih ključnih stranica (homepage, listing, produkt, košarica, checkout). Dvije revizije uključene.',
            duration: '5–7 dana',
        },
        {
            title: 'Razvoj & Integracije',
            desc: 'Frontend, backend, admin panel i integracija plaćanja. Redovne update-e šaljemo na Viber/email.',
            duration: '15–20 dana',
        },
        {
            title: 'Testiranje & Isporuka',
            desc: 'QA testiranje na svim uređajima, test transakcije, performance check i predaja pristupnih podataka.',
            duration: '3–5 dana',
        },
    ];

    const clientResp = [
        'Logo i brand materijali (boje, fontovi) — ili dogovaramo dizajn u sklopu projekta',
        'Tekstualni sadržaj (opisi produkata, o nama, uslovi kupovine)',
        'Fotografije produkata (preporučeno min. 3 fotografije po produktu)',
        'Pristup domeni i hosting nalogu (ili kupujemo zajedno)',
        'Pravovremena povratna informacija na dizajn revizije (do 48h)',
    ];

    const terms = [
        'Cijena: 1.500 KM (bez PDV-a) — fiksna, bez skrivenih troškova',
        'Dinamika plaćanja: 50% avans (750 KM) pri potpisivanju, 50% (750 KM) pri isporuci',
        'Rok isporuke: 25–35 radnih dana od uplate avansa i dostave svih materijala',
        'Revizije dizajna: 2 revizije uključene, svaka dodatna = 50 KM',
        'Ponuda vrijedi 30 dana od datuma izdavanja',
        'Sve promjene u opsegu rada nakon potpisivanja se posebno procjenjuju',
        'Luminor Solutions zadržava pravo portfelja (referenca), osim ako klijent eksplicitno odbije',
    ];

    return (
        <div className={styles.wrapper}>
            {/* Action bar */}
            <div className={styles.actionBar}>
                <Link href="/bs/services" className={styles.backLink}>
                    ← Nazad na usluge
                </Link>
                <OfferPrintButton label="Preuzmi PDF" />
            </div>

            <div className={styles.document}>
                {/* Document header */}
                <div className={styles.docHeader}>
                    <div className={styles.brandName}>
                        Luminor<span className={styles.brandAccent}>.Solutions</span>
                    </div>
                    <div className={styles.docMeta}>
                        <span className={styles.docBadge}>Personalizovana ponuda</span>
                        <span className={styles.docDate}>{today}</span>
                        <span className={styles.docValidity}>Važi 30 dana</span>
                    </div>
                </div>

                {/* Service intro */}
                <div className={styles.intro}>
                    <h1 className={styles.serviceTitle}>
                        Izrada <span className={styles.serviceHighlight}>Web Shopa</span>
                    </h1>
                    <p className={styles.serviceSubtitle}>
                        Kompletna izrada e-commerce platforme s custom admin panelom, integracijom
                        plaćanja i upravljanjem narudžbama — razvijeno po mjeri vašeg poslovanja.
                    </p>
                    <div className={customStyles.clientBadge}>
                        Pripremljeno za: <strong>Nasuf Bilibani</strong>
                    </div>
                </div>

                {/* Single package */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Paket</span>
                    <div className={customStyles.singlePackage}>
                        <span className={customStyles.singleBadge}>Komplet paket</span>
                        <div className={customStyles.singlePackageInner}>
                            <div className={customStyles.singleLeft}>
                                <div className={customStyles.singleName}>Web Shop Komplet</div>
                                <p className={customStyles.singleDesc}>
                                    Sve što vam treba za pokretanje online prodaje — od dizajna do
                                    prvog plaćanja. Jedna cijena, bez iznenađenja.
                                </p>
                                <ul className={customStyles.singleHighlights}>
                                    <li>Custom dizajn + admin panel</li>
                                    <li>Stripe integracija plaćanja</li>
                                    <li>Upravljanje narudžbama</li>
                                    <li>30 dana podrška po isporuci</li>
                                </ul>
                            </div>
                            <div className={customStyles.singleRight}>
                                <div className={customStyles.singlePrice}>1.500 KM</div>
                                <div className={customStyles.singlePriceSub}>fiksna cijena · bez PDV-a</div>
                                <div className={customStyles.singlePayment}>
                                    <div className={customStyles.paymentRow}>
                                        <span>Avans (50%)</span>
                                        <strong>750 KM</strong>
                                    </div>
                                    <div className={customStyles.paymentRow}>
                                        <span>Pri isporuci (50%)</span>
                                        <strong>750 KM</strong>
                                    </div>
                                </div>
                                <div className={customStyles.singleTimeline}>
                                    ⏱ Rok isporuke: 25–35 radnih dana
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's included */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Šta je uključeno</span>
                    <ul className={styles.includesList}>
                        {includes.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* What's NOT included */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Nije uključeno</span>
                    <ul className={styles.notIncludedList}>
                        {notIncluded.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Hosting add-on recommendation */}
                <div className={customStyles.hostingAddon}>
                    <div className={customStyles.hostingAddonHeader}>
                        <span className={customStyles.hostingAddonLabel}>Preporučeni dodatak</span>
                        <span className={customStyles.hostingAddonBadge}>Business Hosting</span>
                    </div>
                    <div className={customStyles.hostingAddonBody}>
                        <div className={customStyles.hostingAddonInfo}>
                            <div className={customStyles.hostingAddonTitle}>Premium Web Hosting</div>
                            <p className={customStyles.hostingAddonDesc}>
                                Za web shop preporučujemo naš Business paket — NVMe SSD, backup svakih sat vremena,
                                staging okruženje za testiranje i prioritetna podrška 24/7.
                            </p>
                            <ul className={customStyles.hostingAddonFeatures}>
                                <li>Neograničeno sajtova · 50 GB NVMe SSD</li>
                                <li>Premium Wildcard SSL · 50 email naloga</li>
                                <li>Backup svakih sat vremena · Staging okruženje</li>
                                <li>Prioritetna 24/7 podrška · Besplatna migracija</li>
                            </ul>
                        </div>
                        <div className={customStyles.hostingAddonPrice}>
                            <div className={customStyles.hostingPrice}>100 KM</div>
                            <div className={customStyles.hostingPriceSub}>/godišnje</div>
                            <Link href="/bs/hosting" className={customStyles.hostingAddonLink} target="_blank">
                                Vidi hosting pakete →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tech stack */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Tehnologije</span>
                    <ul className={styles.techStackList}>
                        {techStack.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Process */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Tok Projekta</span>
                    <div className={styles.processList}>
                        {process.map((step, i) => (
                            <div key={i} className={styles.processItem}>
                                <div className={styles.processNumber}>0{i + 1}</div>
                                <div className={styles.processContent}>
                                    <h4>
                                        {step.title}
                                        <span className={customStyles.stepDuration}>{step.duration}</span>
                                    </h4>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client responsibilities */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Odgovornosti Klijenta</span>
                    <p className={styles.sectionIntro}>
                        Za nesmetano odvijanje projekta, od klijenta očekujemo sljedeće materijale i informacije:
                    </p>
                    <ul className={styles.responsibilitiesList}>
                        {clientResp.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Terms */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Uslovi Ponude</span>
                    <ul className={styles.termsList}>
                        {terms.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Acceptance */}
                <div className={customStyles.acceptance}>
                    <span className={styles.sectionTitle}>Prihvatanje Ponude</span>
                    <p className={customStyles.acceptanceIntro}>
                        Potpisom ove ponude klijent potvrđuje da je upoznat s uslovima saradnje i odobrava
                        početak rada po navedenim uvjetima.
                    </p>
                    <div className={customStyles.acceptanceGrid}>
                        <div className={customStyles.acceptanceField}>
                            <span className={customStyles.acceptanceLabel}>Klijent — Nasuf Bilibani</span>
                            <div className={customStyles.acceptanceLine} />
                            <span className={customStyles.acceptanceSubLabel}>Potpis i datum</span>
                        </div>
                        <div className={customStyles.acceptanceField}>
                            <span className={customStyles.acceptanceLabel}>Luminor Solutions d.o.o.</span>
                            <div className={customStyles.acceptanceLine} />
                            <span className={customStyles.acceptanceSubLabel}>Ovlašteno lice i datum</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.docFooter}>
                    <div className={styles.footerContact}>
                        <span><strong>Luminor Solutions</strong></span>
                        <span>info@luminor.solutions</span>
                        <span>+387 62 574 783</span>
                        <span>luminor.solutions</span>
                    </div>
                    <div className={styles.footerCta}>
                        <h3>Spremi se za start?</h3>
                        <Link href="/bs/contact" className={styles.footerCtaButton}>
                            Kontaktiraj nas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
