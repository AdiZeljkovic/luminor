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
        'Unikatni dizajn shopa rađen po vašem brendu',
        'Custom admin panel koji sami kontrolišete',
        'Pregled narudžbi, statusi i export',
        'Dodavanje, uređivanje i brisanje produkata',
        'Kategorije, filteri i pretraga',
        'Korisnički nalozi i registracija kupaca',
        'Plaćanje karticom putem Stripea',
        'PayPal ili lokalne metode plaćanja (po dogovoru)',
        'Radi savršeno na mobitelu, tabletu i desktopu',
        'Optimizacija brzine i Core Web Vitals',
        'Osnovna SEO konfiguracija (meta tagovi, strukturirani podaci)',
        '30 dana besplatne podrške nakon predaje',
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
            title: 'Razgovor i plan',
            desc: 'Sjednemo zajedno — uživo ili na pozivu — i prolazimo kroz sve detalje. Koje kategorije, kako izgleda tok kupovine, šta vi vidite u adminu. Na kraju imamo jasan plan i potpisujemo ugovor.',
            duration: '2–3 dana',
        },
        {
            title: 'Dizajn i prototype',
            desc: 'Radimo kompletan dizajn u Figmi — homepage, listing, stranica produkta, košarica i checkout. Šaljemo vam na pregled i zajedno usklađujemo dok ne bude tačno onako kako ste zamislili.',
            duration: '5–7 dana',
        },
        {
            title: 'Razvoj i integracije',
            desc: 'Krećemo s razvojem. Frontend, backend, admin panel i Stripe. Svaki dan-dva šaljemo kratki update šta je gotovo, tako da uvijek znate gdje smo.',
            duration: '15–20 dana',
        },
        {
            title: 'Testiranje i predaja',
            desc: 'Testiramo sve na pravim uređajima i radimo test transakcije. Kad je sve čisto — predajemo vam pristupe i shop je vaš.',
            duration: '3–5 dana',
        },
    ];

    const clientResp = [
        'Logo i boje brenda — ako nemate ništa, dogovorimo se posebno',
        'Tekstovi i opisi produkata (možemo pomoći ako treba)',
        'Fotografije produkata — što bolji kvalitet, to bolji shop',
        'Brz odgovor na naše poruke, posebno kad šaljemo dizajn na pregled',
    ];

    const terms = [
        'Cijena je 1.500 KM i to je to — nema skrivenih troškova ni nenajavljenih faktura',
        'Platite 750 KM kad krenemo, a ostalih 750 KM kad predamo gotov shop',
        'Shop isporučujemo u roku od 25–35 radnih dana od kad dobijemo avans i materijale',
        'Ponuda važi 30 dana od datuma izdavanja',
        'Ako u toku rada odlučite promijeniti ili proširiti opseg projekta, to procjenjujemo zajedno',
        'Zadržavamo pravo da shop koristimo kao referencu, osim ako preferirate da ostane privatno',
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
                        Izrada <span className={styles.serviceHighlight}>web shopa</span>
                    </h1>
                    <p className={styles.serviceSubtitle}>
                        Pravimo vam potpunu platformu za online prodaju — od prvog dizajna do momenta
                        kada kupac plati i vama stigne notifikacija. Custom admin panel koji vi sami
                        kontrolišete, integracija kartičnog plaćanja putem Stripea, upravljanje
                        narudžbama i produktima, i sve ostalo što treba da vaš shop ozbiljno radi
                        od prvog dana.
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
                                <div className={customStyles.singleName}>Web shop komplet</div>
                                <ul className={customStyles.singleHighlights}>
                                    <li>Custom dizajn po vašem brendu</li>
                                    <li>Custom admin panel</li>
                                    <li>Stripe integracija plaćanja</li>
                                    <li>Upravljanje narudžbama i statusima</li>
                                    <li>Upravljanje produktima i cijenama</li>
                                    <li>Kategorije i filteri</li>
                                    <li>Korisnički nalozi kupaca</li>
                                    <li>Responsive za sve uređaje</li>
                                    <li>Optimizacija brzine</li>
                                    <li>30 dana podrška po predaji</li>
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
                        Da bismo mogli početi i da sve ide glatko, trebamo od vas:
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
                        Potpisom potvrđujemo da smo obostrano razumjeli šta radimo, po kojoj cijeni i na koji rok.
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
