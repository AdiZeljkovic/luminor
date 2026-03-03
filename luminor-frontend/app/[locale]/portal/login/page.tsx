"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

export default function PortalLoginPage() {
    const router = useRouter();
    const locale = useLocale();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const t = {
        title: locale === "bs" ? "Klijentski Portal" : "Client Portal",
        subtitle: locale === "bs" ? "Prijavite se da vidite vaše projekte" : "Sign in to view your projects",
        emailLabel: locale === "bs" ? "Email Adresa" : "Email Address",
        passwordLabel: locale === "bs" ? "Lozinka" : "Password",
        submit: locale === "bs" ? "Prijava" : "Sign In",
        error: locale === "bs" ? "Pogrešan email ili lozinka" : "Invalid email or password",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/client-auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Store client info in sessionStorage (not localStorage - more secure)
                sessionStorage.setItem("client", JSON.stringify(data.data));
                router.push(`/${locale}/portal`);
            } else {
                setError(data.error || t.error);
            }
        } catch {
            setError(locale === "bs" ? "Greška na serveru. Pokušajte ponovo." : "Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <span className={styles.logoText}>Luminor</span>
                    <span className={styles.logoDot}>.Solutions</span>
                </div>

                <h1 className={styles.title}>{t.title}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>{t.emailLabel}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            autoFocus
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>{t.passwordLabel}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? "..." : t.submit}
                    </button>
                </form>

                <p className={styles.footer}>
                    {locale === "bs"
                        ? "Nemate pristup? Kontaktirajte nas na "
                        : "Don't have access? Contact us at "}
                    <a href="mailto:info@luminor.solutions">info@luminor.solutions</a>
                </p>
            </div>
        </main>
    );
}
