"use client";

import { useState, useRef } from "react";
import styles from "./DomainChecker.module.css";
import { API_URL } from "@/lib/api";

interface DomainResult {
    domain: string;
    tld: string;
    status: "available" | "taken" | "unknown";
}

interface ApiResponse {
    success: boolean;
    baseName: string;
    featured: DomainResult | null;
    results: DomainResult[];
    error?: string;
}

interface Props {
    locale: string;
}

const TLD_LABELS: Record<string, string> = {
    ".com": "COM", ".net": "NET", ".org": "ORG", ".ba": "BA",
    ".io": "IO", ".co": "CO", ".me": "ME", ".hr": "HR",
    ".rs": "RS", ".si": "SI", ".eu": "EU", ".de": "DE",
    ".fr": "FR", ".uk": "UK", ".at": "AT", ".nl": "NL",
    ".it": "IT", ".es": "ES", ".info": "INFO", ".biz": "BIZ",
    ".online": "ONLINE", ".store": "STORE", ".app": "APP",
    ".dev": "DEV", ".tech": "TECH", ".gg": "GG", ".tv": "TV",
    ".shop": "SHOP", ".agency": "AGENCY", ".digital": "DIGITAL",
    ".studio": "STUDIO", ".media": "MEDIA", ".solutions": "SOLUTIONS",
};

export default function DomainChecker({ locale }: Props) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingExtended, setLoadingExtended] = useState(false);
    const [featured, setFeatured] = useState<DomainResult | null>(null);
    const [results, setResults] = useState<DomainResult[] | null>(null);
    const [extendedResults, setExtendedResults] = useState<DomainResult[] | null>(null);
    const [baseName, setBaseName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const bs = locale === "bs";
    const t = {
        label: "Domain Checker",
        title: bs ? "Provjerite vašu domenu" : "Check Your Domain",
        subtitle: bs
            ? "Ukucajte naziv domene i provjerite dostupnost za popularne ekstenzije."
            : "Enter a domain name and instantly check availability across popular extensions.",
        placeholder: bs ? "vasadomena" : "yourdomain",
        button: bs ? "Provjeri" : "Check",
        checking: bs ? "Provjera..." : "Checking...",
        available: bs ? "Slobodna" : "Available",
        taken: bs ? "Zauzeta" : "Taken",
        unknown: bs ? "Nepoznato" : "Unknown",
        register: bs ? "Registruj" : "Register",
        contactSubject: bs ? "Registracija domene" : "Domain Registration",
        errorInvalid: bs
            ? "Unesite naziv domene (min. 2 slova, bez razmaka)."
            : "Enter a valid domain name (min. 2 chars, no spaces).",
        errorFailed: bs ? "Provjera nije uspjela. Pokušajte ponovo." : "Check failed. Please try again.",
        featuredLabel: bs ? "Vaša domena" : "Your domain",
        popularLabel: bs ? "Popularne ekstenzije" : "Popular extensions",
        checkAll: bs ? "Provjeri sve domene" : "Check all domains",
        checkingAll: bs ? "Provjera..." : "Checking...",
        allLabel: bs ? "Sve ekstenzije" : "All extensions",
        availableFirst: bs ? "Slobodne domene prikazane prve" : "Available domains shown first",
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const raw = query.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
        const base = raw.split(".")[0];
        if (!base || base.length < 2) {
            setError(t.errorInvalid);
            return;
        }
        setError("");
        setLoading(true);
        setResults(null);
        setFeatured(null);
        setExtendedResults(null);

        try {
            const res = await fetch(`${API_URL}/api/domain/check?name=${encodeURIComponent(raw)}`);
            const data: ApiResponse = await res.json();
            if (data.success) {
                setBaseName(data.baseName);
                setFeatured(data.featured);
                setResults(data.results);
            } else {
                setError(data.error || t.errorFailed);
            }
        } catch {
            setError(t.errorFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleExtendedCheck = async () => {
        setLoadingExtended(true);
        try {
            const raw = query.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
            const res = await fetch(`${API_URL}/api/domain/check?name=${encodeURIComponent(raw)}&extended=true`);
            const data: ApiResponse = await res.json();
            if (data.success) {
                setExtendedResults(data.results);
                setTimeout(() => {
                    document.getElementById("domain-extended")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        } catch {
            // ignore
        } finally {
            setLoadingExtended(false);
        }
    };

    const statusClass = (status: string) =>
        status === "available" ? styles.cardAvailable
        : status === "taken" ? styles.cardTaken
        : styles.cardUnknown;

    const badgeClass = (status: string) =>
        status === "available" ? styles.statusAvailable
        : status === "taken" ? styles.statusTaken
        : styles.statusUnknown;

    const badgeText = (status: string) =>
        status === "available" ? `✓ ${t.available}`
        : status === "taken" ? `✗ ${t.taken}`
        : `? ${t.unknown}`;

    const tldLabel = (tld: string) => TLD_LABELS[tld] ?? tld.replace(".", "").toUpperCase();

    const availableCount = results?.filter((r) => r.status === "available").length ?? 0;
    const extAvailableCount = extendedResults?.filter((r) => r.status === "available").length ?? 0;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.label}>{t.label}</span>
                    <h2 className={styles.title}>{t.title}</h2>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>

                <form onSubmit={handleSearch} className={styles.form}>
                    <div className={styles.inputWrap}>
                        <span className={styles.inputPrefix}>www.</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t.placeholder}
                            className={styles.input}
                            autoComplete="off"
                            spellCheck={false}
                            maxLength={70}
                        />
                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading && <span className={styles.spinner} aria-hidden="true" />}
                            {loading ? t.checking : t.button}
                        </button>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                </form>

                {(featured || results) && (
                    <div className={styles.results}>

                        {/* Featured — specific TLD the user typed */}
                        {featured && (
                            <div className={styles.featuredSection}>
                                <p className={styles.sectionHint}>{t.featuredLabel}</p>
                                <div className={`${styles.featuredCard} ${statusClass(featured.status)}`}>
                                    <div className={styles.featuredLeft}>
                                        <span className={`${styles.statusBadge} ${badgeClass(featured.status)}`}>
                                            {badgeText(featured.status)}
                                        </span>
                                        <p className={styles.featuredDomain}>{featured.domain}</p>
                                    </div>
                                    <div className={styles.featuredRight}>
                                        <span className={styles.tldPill}>{tldLabel(featured.tld)}</span>
                                        {featured.status === "available" && (
                                            <a
                                                href={`/${locale}/contact?subject=${encodeURIComponent(t.contactSubject + ": " + featured.domain)}`}
                                                className={styles.registerBtn}
                                            >
                                                {t.register} →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Popular TLDs grid */}
                        {results && results.length > 0 && (
                            <div className={styles.popularSection}>
                                <p className={styles.sectionHint}>
                                    {featured ? t.popularLabel : (
                                        availableCount > 0
                                            ? bs
                                                ? `${availableCount} slobodna domena za „${baseName}"`
                                                : `${availableCount} available domain${availableCount !== 1 ? "s" : ""} for "${baseName}"`
                                            : bs ? `Rezultati za „${baseName}"` : `Results for "${baseName}"`
                                    )}
                                </p>
                                <div className={styles.grid}>
                                    {results.map((r) => (
                                        <div key={r.tld} className={`${styles.card} ${statusClass(r.status)}`}>
                                            <div className={styles.cardTop}>
                                                <span className={styles.tldBadge}>{tldLabel(r.tld)}</span>
                                                <span className={`${styles.statusBadge} ${badgeClass(r.status)}`}>
                                                    {badgeText(r.status)}
                                                </span>
                                            </div>
                                            <p className={styles.domainName}>{r.domain}</p>
                                            {r.status === "available" && (
                                                <a
                                                    href={`/${locale}/contact?subject=${encodeURIComponent(t.contactSubject + ": " + r.domain)}`}
                                                    className={styles.registerBtn}
                                                >
                                                    {t.register} →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Check all domains button */}
                        {!extendedResults && (
                            <div className={styles.extendedBtnWrap}>
                                <button
                                    onClick={handleExtendedCheck}
                                    disabled={loadingExtended}
                                    className={styles.extendedBtn}
                                >
                                    {loadingExtended && <span className={styles.spinner} aria-hidden="true" />}
                                    {loadingExtended ? t.checkingAll : `${t.checkAll} →`}
                                </button>
                            </div>
                        )}

                        {/* Extended results */}
                        {extendedResults && (
                            <div id="domain-extended" className={styles.extendedSection}>
                                <div className={styles.extendedHeader}>
                                    <p className={styles.sectionHint}>{t.allLabel}</p>
                                    {extAvailableCount > 0 && (
                                        <span className={styles.extAvailableBadge}>
                                            {extAvailableCount} {bs ? "slobodnih" : "available"}
                                        </span>
                                    )}
                                </div>
                                <p className={styles.extendedSubhint}>{t.availableFirst}</p>
                                <div className={styles.extendedGrid}>
                                    {extendedResults.map((r) => (
                                        <div key={r.tld} className={`${styles.card} ${statusClass(r.status)}`}>
                                            <div className={styles.cardTop}>
                                                <span className={styles.tldBadge}>{tldLabel(r.tld)}</span>
                                                <span className={`${styles.statusBadge} ${badgeClass(r.status)}`}>
                                                    {badgeText(r.status)}
                                                </span>
                                            </div>
                                            <p className={styles.domainName}>{r.domain}</p>
                                            {r.status === "available" && (
                                                <a
                                                    href={`/${locale}/contact?subject=${encodeURIComponent(t.contactSubject + ": " + r.domain)}`}
                                                    className={styles.registerBtn}
                                                >
                                                    {t.register} →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
