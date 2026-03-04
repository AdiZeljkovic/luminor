"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import styles from "./layout.module.css";
import { API_URL } from "@/lib/api";

interface ClientUser {
    id: number;
    name: string;
    email: string;
    company: string | null;
}

const IconDashboard = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
);
const IconProjects = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><path d="M9 20v-5h6v5" />
    </svg>
);
const IconHosting = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v4c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 13v4c0 1.66 4 3 9 3s9-1.34 9-3v-4" />
    </svg>
);
const IconInvoices = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
const IconLogout = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default function PortalLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [client, setClient] = useState<ClientUser | null>(null);
    const [loading, setLoading] = useState(true);

    const isLoginPage = pathname.endsWith("/login");

    useEffect(() => {
        if (isLoginPage) { setLoading(false); return; }
        fetch(`${API_URL}/api/client-auth/me`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    setClient(data.data);
                    sessionStorage.setItem("client", JSON.stringify(data.data));
                } else {
                    router.push(`/${locale}/portal/login`);
                }
            })
            .catch(() => router.push(`/${locale}/portal/login`))
            .finally(() => setLoading(false));
    }, [isLoginPage, router, locale]);

    const handleLogout = async () => {
        await fetch(`${API_URL}/api/client-auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
        sessionStorage.removeItem("client");
        router.push(`/${locale}/portal/login`);
    };

    if (isLoginPage) return <>{children}</>;

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingInner}>
                    <div className={styles.spinner} />
                    <span className={styles.loadingText}>Loading...</span>
                </div>
            </div>
        );
    }

    const t = {
        dashboard: locale === "bs" ? "Pregled" : "Dashboard",
        projects: locale === "bs" ? "Projekti" : "Projects",
        hosting: "Hosting",
        invoices: locale === "bs" ? "Fakture" : "Invoices",
        logout: locale === "bs" ? "Odjava" : "Sign Out",
        portal: locale === "bs" ? "Klijentski Portal" : "Client Portal",
    };

    const navItems = [
        { label: t.dashboard, href: `/${locale}/portal`, icon: <IconDashboard /> },
        { label: t.projects, href: `/${locale}/portal/projects`, icon: <IconProjects /> },
        { label: t.hosting, href: `/${locale}/portal/hosting`, icon: <IconHosting /> },
        { label: t.invoices, href: `/${locale}/portal/invoices`, icon: <IconInvoices /> },
    ];

    const initials = client?.name
        ? client.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.brandLink}>
                        <span className={styles.brandText}>Luminor</span>
                        <span className={styles.brandDot}>.Solutions</span>
                    </Link>
                    <span className={styles.brandSub}>{t.portal}</span>
                </div>

                <nav className={styles.nav}>
                    <span className={styles.navLabel}>Navigation</span>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ""}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{initials}</div>
                        <div className={styles.userMeta}>
                            <div className={styles.userName}>{client?.name || "—"}</div>
                            <div className={styles.userCompany}>{client?.company || "Client"}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <IconLogout />
                        {t.logout}
                    </button>
                </div>
            </aside>

            <main className={styles.main}>{children}</main>
        </div>
    );
}
