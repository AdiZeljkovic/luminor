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

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [client, setClient] = useState<ClientUser | null>(null);
    const [loading, setLoading] = useState(true);

    const isLoginPage = pathname.endsWith("/login");

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        // Verify auth with backend
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
            .catch(() => {
                router.push(`/${locale}/portal/login`);
            })
            .finally(() => setLoading(false));
    }, [isLoginPage, router, locale]);

    const handleLogout = async () => {
        await fetch(`${API_URL}/api/client-auth/logout`, {
            method: "POST",
            credentials: "include",
        }).catch(() => {});
        sessionStorage.removeItem("client");
        router.push(`/${locale}/portal/login`);
    };

    if (isLoginPage) return <>{children}</>;
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
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
        { label: t.dashboard, href: `/${locale}/portal` },
        { label: t.projects, href: `/${locale}/portal/projects` },
        { label: t.hosting, href: `/${locale}/portal/hosting` },
        { label: t.invoices, href: `/${locale}/portal/invoices` },
    ];

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.brandLink}>
                        <span className={styles.brandText}>Luminor</span>
                        <span className={styles.brandDot}>.Solutions</span>
                    </Link>
                    <span className={styles.brandSub}>{t.portal}</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{client?.name?.charAt(0).toUpperCase() || "C"}</div>
                        <div>
                            <div className={styles.userName}>{client?.name}</div>
                            {client?.company && <div className={styles.userCompany}>{client.company}</div>}
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>{t.logout}</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>{children}</main>
        </div>
    );
}
