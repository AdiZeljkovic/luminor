import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../offer.module.css';
import s from './solarni-paneli.module.css';
import OfferPrintButton from '@/components/OfferPrintButton';

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
    title: 'Ponuda — On-demand platforma za servisiranje | Luminor Solutions',
    robots: { index: false, follow: false },
};

export default async function SolarniPaneliOffer({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const today = new Date().toLocaleDateString('bs-BA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const howItWorks = [
        {
            step: '01',
            title: 'Korisnik prijavljuje kvar',
            desc: 'Kroz aplikaciju unosi opis problema, opciono šalje fotografiju i potvrđuje lokaciju solarnog sistema na mapi.',
        },
        {
            step: '02',
            title: 'Sistem pronalazi najbližeg servisera',
            desc: 'Backend automatski mapira lokaciju kvara i provjerava koji su električari trenutno slobodni i na dužnosti.',
        },
        {
            step: '03',
            title: 'Push notifikacija najbližem',
            desc: 'Algoritam izračunava udaljenosti i šalje zahtjev samo prvom najbližem slobodnom električaru.',
        },
        {
            step: '04',
            title: 'Prihvatanje ili automatski prelaz',
            desc: 'Električar ima 120 sekundi da prihvati posao. Ako odbije ili ne odgovori, sistem automatski kontaktira sljedećeg.',
        },
        {
            step: '05',
            title: 'Korisnik prati dolazak uživo',
            desc: 'Čim servis bude prihvaćen, korisnik na mapi u realnom vremenu vidi gdje se električar nalazi i koliko će stići.',
        },
    ];

    const components = [
        {
            icon: '📱',
            title: 'Korisnička aplikacija',
            subtitle: 'Vlasnici solarnih panela',
            features: [
                'Registracija i upravljanje profilom',
                'Prijava kvara s fotografijom i GPS lokacijom',
                'Odabir kategorije problema',
                'Praćenje servisera na mapi uživo',
                'Vizuelni statusi: traženje → stiže → u toku → završeno',
                'Kompletna istorija svih servisa',
                'Push notifikacije o svakoj promjeni statusa',
            ],
        },
        {
            icon: '🔧',
            title: 'Aplikacija za servisere',
            subtitle: 'Terenski tim (10+ servisera)',
            features: [
                'Logovanje s kredencijalima koje kreira admin',
                'Toggle "Na dužnosti / Van dužnosti"',
                'Pop-up s alarmom pri novom poslu',
                'Prikaz udaljenosti i okvirnog vremena dolaska',
                'Navigacija putem Google Maps / Apple Maps',
                'Promjena statusa jednim klikom',
                'Zatvaranje naloga s izveštajem i fotografijom',
                'Optimizovano GPS praćenje u pozadini',
            ],
        },
        {
            icon: '🖥️',
            title: 'Admin panel & backend',
            subtitle: 'Centralno upravljanje sistemom',
            features: [
                'Mapa uživo sa svim serviserima (zeleni/crveni/sivi pin)',
                'Kreiranje naloga za servisere',
                'Pregled performansi tima (broj servisa, prosječno vrijeme)',
                'Upravljanje svim aktivnim i historijskim kvarovima',
                'Ručna dodjela posla (override algoritma)',
                'Analitika — najčešći kvarovi, opterećenost tima',
            ],
        },
    ];

    const techStack = [
        { label: 'Mobilne aplikacije', value: 'Flutter ili React Native', reason: 'jedan kod za iOS i Android' },
        { label: 'Backend / API', value: 'Node.js (NestJS)', reason: 'brz za real-time komunikaciju' },
        { label: 'Baza podataka', value: 'PostgreSQL + PostGIS', reason: 'standard za geoprostorne podatke' },
        { label: 'Real-time', value: 'WebSockets (Socket.io)', reason: 'mapa uživo bez refresha' },
        { label: 'Push notifikacije', value: 'Firebase Cloud Messaging', reason: 'iOS i Android, najpouzdanije' },
        { label: 'Mape', value: 'Google Maps API', reason: 'navigacija i računanje udaljenosti' },
    ];

    const phases = [
        { num: '01', title: 'Dizajn i UI/UX', duration: '2 sedmice', desc: 'Wireframi i finalni dizajn svih ekrana za obje aplikacije i admin panel u Figmi.' },
        { num: '02', title: 'Backend i baza podataka', duration: '3 sedmice', desc: 'Postavljanje servera, baze podataka i geo-algoritama za pronalazak najbližeg servisera.' },
        { num: '03', title: 'Razvoj aplikacija', duration: '5 sedmica', desc: 'Paralelan razvoj korisničke i serviserne aplikacije, integracija mapa i praćenja u pozadini.' },
        { num: '04', title: 'Testiranje i QA', duration: '2 sedmice', desc: 'Testiranje na terenu — simulacija kretanja servisera, push notifikacije na zaključanom telefonu, offline mode.' },
        { num: '05', title: 'Lansiranje i predaja', duration: null, desc: 'Predaja pristupnih podataka, postavljanje produkcionog servera i obuka administratora. Objava na Google Play i App Store se podnosi na odobrenje — rok pregleda ovisi o samim platformama.' },
    ];

    const terms = [
        'Cijena razvoja je fiksna — nema dodatnih troškova koji nisu navedeni u ovoj ponudi',
        'Plaćanje u fazama: 40% pri potpisivanju, 30% nakon završetka dizajna (Faza 1), 30% pri finalnoj isporuci',
        'Razvoj traje okvirno 3 mjeseca od uplate prvog avansa i dostave materijala',
        'Troškovi Google Play, App Store, servera i održavanja su zasebni i snosi ih klijent',
        'Ponuda važi 30 dana od datuma izdavanja',
        'Sve promjene u opsegu rada nakon potpisivanja se dogovaraju i procjenjuju zasebno',
        'Zadržavamo pravo da projekat koristimo kao referencu, osim ako preferirate da ostane privatno',
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
                {/* Header */}
                <div className={styles.docHeader}>
                    <div className={styles.brandName}>
                        Luminor<span className={styles.brandAccent}>.Solutions</span>
                    </div>
                    <div className={styles.docMeta}>
                        <span className={styles.docBadge}>Tehnička ponuda</span>
                        <span className={styles.docDate}>{today}</span>
                        <span className={styles.docValidity}>Važi 30 dana</span>
                    </div>
                </div>

                {/* Intro */}
                <div className={styles.intro}>
                    <h1 className={styles.serviceTitle}>
                        On-demand platforma za{' '}
                        <span className={styles.serviceHighlight}>servisiranje solarnih panela</span>
                    </h1>
                    <p className={styles.serviceSubtitle}>
                        Razvoj kompletnog softverskog sistema koji spaja vlasnike solarnih panela s
                        vašim timom servisera na terenu — po principu sličnom Uberu. Korisnik prijavi
                        kvar, sistem automatski pronađe najbližeg slobodnog servisera i pošalje mu
                        posao. Sve u realnom vremenu.
                    </p>
                    <div className={s.componentsBadgeRow}>
                        <span className={s.componentBadge}>📱 Korisnička aplikacija</span>
                        <span className={s.componentBadge}>🔧 Aplikacija za servisere</span>
                        <span className={s.componentBadge}>🖥️ Admin panel & backend</span>
                    </div>
                </div>

                {/* How it works */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Kako sistem funkcioniše</span>
                    <div className={s.howItWorksList}>
                        {howItWorks.map((item) => (
                            <div key={item.step} className={s.howItem}>
                                <div className={s.howStep}>{item.step}</div>
                                <div className={s.howContent}>
                                    <strong>{item.title}</strong>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3 Components */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Šta razvijamo</span>
                    <div className={s.componentsGrid}>
                        {components.map((comp) => (
                            <div key={comp.title} className={s.componentCard}>
                                <div className={s.componentIcon}>{comp.icon}</div>
                                <div className={s.componentTitle}>{comp.title}</div>
                                <div className={s.componentSubtitle}>{comp.subtitle}</div>
                                <ul className={s.componentFeatures}>
                                    {comp.features.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech stack */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Tehnologije</span>
                    <div className={s.techTable}>
                        {techStack.map((t) => (
                            <div key={t.label} className={s.techRow}>
                                <span className={s.techLabel}>{t.label}</span>
                                <span className={s.techValue}>{t.value}</span>
                                <span className={s.techReason}>{t.reason}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phases */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Faze razvoja</span>
                    <div className={styles.processList}>
                        {phases.map((phase) => (
                            <div key={phase.num} className={styles.processItem}>
                                <div className={styles.processNumber}>{phase.num}</div>
                                <div className={styles.processContent}>
                                    <h4>
                                        {phase.title}
                                        {phase.duration && (
                                            <span className={s.phaseDuration}>{phase.duration}</span>
                                        )}
                                    </h4>
                                    <p>{phase.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={s.totalDuration}>
                        Ukupno procijenjeno trajanje razvoja: <strong>3 mjeseca</strong>
                    </div>
                </div>

                {/* Pricing */}
                <div className={styles.sectionDark}>
                    <span className={styles.sectionTitle}>Cijena</span>
                    <div className={s.pricingTable}>
                        <div className={s.pricingRow + ' ' + s.pricingRowMain}>
                            <div className={s.pricingLabel}>
                                <strong>Izrada kompletnog sistema</strong>
                                <span>Obje aplikacije + admin panel + backend</span>
                            </div>
                            <div className={s.pricingAmount}>1.200 KM</div>
                            <div className={s.pricingNote}>jednokratno</div>
                        </div>

                        <div className={s.pricingDivider}>Zasebni troškovi (snosi klijent)</div>

                        <div className={s.pricingRow}>
                            <div className={s.pricingLabel}>
                                <strong>Google Play Store</strong>
                                <span>Jednokratna naknada za developer nalog</span>
                            </div>
                            <div className={s.pricingAmount}>$25</div>
                            <div className={s.pricingNote}>jednokratno</div>
                        </div>
                        <div className={s.pricingRow}>
                            <div className={s.pricingLabel}>
                                <strong>Apple App Store</strong>
                                <span>Apple Developer Program godišnja pretplata</span>
                            </div>
                            <div className={s.pricingAmount}>$99</div>
                            <div className={s.pricingNote}>/godišnje</div>
                        </div>
                        <div className={s.pricingRow}>
                            <div className={s.pricingLabel}>
                                <strong>Server (VPS)</strong>
                                <span>Hosting za backend, bazu i WebSocket server</span>
                            </div>
                            <div className={s.pricingAmount}>15 €</div>
                            <div className={s.pricingNote}>/mjesečno</div>
                        </div>
                        <div className={s.pricingRow}>
                            <div className={s.pricingLabel}>
                                <strong>Mjesečno održavanje</strong>
                                <span>Monitoring, ažuriranja, tehnička podrška</span>
                            </div>
                            <div className={s.pricingAmount}>100 KM</div>
                            <div className={s.pricingNote}>/mjesečno</div>
                        </div>
                    </div>

                    <div className={s.paymentPlan}>
                        <span className={s.paymentPlanLabel}>Dinamika plaćanja za razvoj</span>
                        <div className={s.paymentPlanRow}>
                            <span>Pri potpisivanju (40%)</span>
                            <strong>480 KM</strong>
                        </div>
                        <div className={s.paymentPlanRow}>
                            <span>Nakon završetka dizajna (30%)</span>
                            <strong>360 KM</strong>
                        </div>
                        <div className={s.paymentPlanRow}>
                            <span>Pri finalnoj isporuci (30%)</span>
                            <strong>360 KM</strong>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className={styles.section}>
                    <span className={styles.sectionTitle}>Uslovi ponude</span>
                    <ul className={styles.termsList}>
                        {terms.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Acceptance */}
                <div className={s.acceptance}>
                    <span className={styles.sectionTitle}>Prihvatanje ponude</span>
                    <p className={s.acceptanceIntro}>
                        Potpisom potvrđujemo da smo obostrano razumjeli šta radimo, po kojoj cijeni i na koji rok.
                    </p>
                    <div className={s.acceptanceGrid}>
                        <div className={s.acceptanceField}>
                            <span className={s.acceptanceLabel}>Klijent</span>
                            <div className={s.acceptanceLine} />
                            <span className={s.acceptanceSubLabel}>Potpis i datum</span>
                        </div>
                        <div className={s.acceptanceField}>
                            <span className={s.acceptanceLabel}>Luminor Solutions d.o.o.</span>
                            <div className={s.acceptanceLine} />
                            <span className={s.acceptanceSubLabel}>Ovlašteno lice i datum</span>
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
                        <h3>Gotovi za start?</h3>
                        <Link href="/bs/contact" className={styles.footerCtaButton}>
                            Kontaktiraj nas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
