"use client";

import { useState, useRef } from "react";
import styles from "./DomainChecker.module.css";
import { API_URL } from "@/lib/api";

interface DomainResult {
    domain: string;
    tld: string;
    status: "available" | "taken" | "unknown";
}

interface Props {
    locale: string;
}

const TLD_LABELS: Record<string, string> = {
    ".com": "COM",
    ".net": "NET",
    ".org": "ORG",
    ".ba": "BA",
    ".io": "IO",
    ".co": "CO",
};

export default function DomainChecker({ locale }: Props) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DomainResult[] | null>(null);
    const [baseName, setBaseName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const t = {
        label: locale === "bs" ? "Domain Checker" : "Domain Checker",
        title: locale === "bs" ? "Provjerite vašu domenu" : "Check Your Domain",
        subtitle:
            locale === "bs"
                ? "Ukucajte naziv domene i provjerite dostupnost za popularne ekstenzije."
                : "Enter a domain name and instantly check availability across popular extensions.",
        placeholder: locale === "bs" ? "vasadomena" : "yourdomain",
        button: locale === "bs" ? "Provjeri" : "Check",
        checking: locale === "bs" ? "Provjera..." : "Checking...",
        available: locale === "bs" ? "Slobodna" : "Available",
        taken: locale === "bs" ? "Zauzeta" : "Taken",
        unknown: locale === "bs" ? "Nepoznato" : "Unknown",
        register: locale === "bs" ? "Registruj" : "Register",
        contactSubject:
            locale === "bs"
                ? "Registracija domene"
                : "Domain Registration",
        errorInvalid:
            locale === "bs"
                ? "Unesite naziv domene (min. 2 slova, bez razmaka)."
                : "Enter a valid domain name (min. 2 chars, no spaces).",
        errorFailed:
            locale === "bs"
                ? "Provjera nije uspjela. Pokušajte ponovo."
                : "Check failed. Please try again.",
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = query.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(".")[0];
        if (!name || name.length < 2) {
            setError(t.errorInvalid);
            return;
        }
        setError("");
        setLoading(true);
        setResults(null);

        try {
            const res = await fetch(`${API_URL}/api/domain/check?name=${encodeURIComponent(name)}`);
            const data = await res.json();
            if (data.success) {
                setBaseName(data.baseName);
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

    const availableCount = results?.filter((r) => r.status === "available").length ?? 0;

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
                            maxLength={63}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.button}
                        >
                            {loading ? (
                                <span className={styles.spinner} aria-hidden="true" />
                            ) : null}
                            {loading ? t.checking : t.button}
                        </button>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                </form>

                {results && (
                    <div className={styles.results}>
                        {availableCount > 0 && (
                            <p className={styles.resultsHint}>
                                {locale === "bs"
                                    ? `${availableCount} slobodna domena za „${baseName}"`
                                    : `${availableCount} available domain${availableCount !== 1 ? "s" : ""} for "${baseName}"`}
                            </p>
                        )}
                        <div className={styles.grid}>
                            {results.map((r) => (
                                <div
                                    key={r.tld}
                                    className={`${styles.card} ${
                                        r.status === "available"
                                            ? styles.cardAvailable
                                            : r.status === "taken"
                                            ? styles.cardTaken
                                            : styles.cardUnknown
                                    }`}
                                >
                                    <div className={styles.cardTop}>
                                        <span className={styles.tldBadge}>
                                            {TLD_LABELS[r.tld] ?? r.tld.toUpperCase()}
                                        </span>
                                        <span
                                            className={`${styles.statusBadge} ${
                                                r.status === "available"
                                                    ? styles.statusAvailable
                                                    : r.status === "taken"
                                                    ? styles.statusTaken
                                                    : styles.statusUnknown
                                            }`}
                                        >
                                            {r.status === "available"
                                                ? "✓ " + t.available
                                                : r.status === "taken"
                                                ? "✗ " + t.taken
                                                : "? " + t.unknown}
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
        </section>
    );
}
