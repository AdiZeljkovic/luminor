import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thank You | Luminor Solutions",
    robots: { index: false, follow: false },
};

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "contact" });

    return (
        <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
            <div style={{ textAlign: "center", maxWidth: "540px" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }} aria-hidden="true">✅</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "var(--color-dark)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                    {locale === "bs" ? "Poruka Primljena!" : "Message Received!"}
                </h1>
                <p style={{ fontFamily: "var(--font-primary)", color: "var(--color-gray-600)", lineHeight: 1.7, marginBottom: "2rem", fontSize: "1.1rem" }}>
                    {locale === "bs"
                        ? "Hvala vam na poruci. Javit ćemo vam se u roku od 1 radnog dana."
                        : "Thank you for reaching out. We'll get back to you within 1 business day."}
                </p>
                <Link
                    href="/"
                    style={{ display: "inline-block", padding: "14px 32px", background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", border: "2px solid var(--color-dark)", boxShadow: "4px 4px 0 var(--color-dark)" }}
                >
                    {locale === "bs" ? "← Povratak na Početnu" : "← Back to Home"}
                </Link>
            </div>
        </div>
    );
}
