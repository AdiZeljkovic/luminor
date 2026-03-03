"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

interface DashboardData {
    projects: Array<{ id: number; title: string; status: string; progress: number; end_date: string | null }>;
    hosting: Array<{ id: number; domain: string; plan_name: string; status: string; expires_at: string | null }>;
    invoices: Array<{ id: number; invoice_number: string; amount: number; currency: string; status: string; due_date: string | null }>;
    summary: { activeProjects: number; pendingInvoices: number; activeHosting: number };
}

const PROJECT_STATUS_COLORS: Record<string, string> = {
    planning: styles.statusPlanning,
    in_progress: styles.statusInProgress,
    review: styles.statusReview,
    completed: styles.statusCompleted,
    on_hold: styles.statusOnHold,
};

export default function PortalDashboard() {
    const locale = useLocale();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/portal/dashboard`, { credentials: "include" })
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setData(res.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const t = {
        welcome: locale === "bs" ? "Dobrodošli u vaš portal!" : "Welcome to your portal!",
        subtitle: locale === "bs" ? "Ovdje možete pratiti sve vaše projekte, hosting i fakture." : "Here you can track all your projects, hosting, and invoices.",
        projects: locale === "bs" ? "Projekti" : "Projects",
        hosting: "Hosting",
        invoices: locale === "bs" ? "Fakture" : "Invoices",
        active: locale === "bs" ? "aktivnih" : "active",
        pending: locale === "bs" ? "na čekanju" : "pending",
        viewAll: locale === "bs" ? "Pogledaj sve →" : "View all →",
        noProjects: locale === "bs" ? "Nema projekata" : "No projects",
        noHosting: locale === "bs" ? "Nema hosting planova" : "No hosting plans",
        noInvoices: locale === "bs" ? "Nema faktura" : "No invoices",
    };

    if (loading) {
        return <div className={styles.loading}><div className={styles.spinner} /></div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.welcome}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🚀</div>
                    <div className={styles.summaryNumber}>{data?.summary.activeProjects || 0}</div>
                    <div className={styles.summaryLabel}>{t.active} {t.projects.toLowerCase()}</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🌐</div>
                    <div className={styles.summaryNumber}>{data?.summary.activeHosting || 0}</div>
                    <div className={styles.summaryLabel}>{t.active} {t.hosting.toLowerCase()}</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>📄</div>
                    <div className={styles.summaryNumber}>{data?.summary.pendingInvoices || 0}</div>
                    <div className={styles.summaryLabel}>{t.invoices} {t.pending}</div>
                </div>
            </div>

            {/* Recent Projects */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t.projects}</h2>
                    <Link href="projects" className={styles.viewAll}>{t.viewAll}</Link>
                </div>
                {!data?.projects.length ? (
                    <p className={styles.empty}>{t.noProjects}</p>
                ) : (
                    <div className={styles.list}>
                        {data.projects.slice(0, 3).map((project) => (
                            <div key={project.id} className={styles.listItem}>
                                <div className={styles.listInfo}>
                                    <span className={styles.listTitle}>{project.title}</span>
                                    <span className={`${styles.statusBadge} ${PROJECT_STATUS_COLORS[project.status] || ""}`}>
                                        {project.status.replace("_", " ")}
                                    </span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
                                </div>
                                <span className={styles.progressLabel}>{project.progress}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Invoices */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t.invoices}</h2>
                    <Link href="invoices" className={styles.viewAll}>{t.viewAll}</Link>
                </div>
                {!data?.invoices.length ? (
                    <p className={styles.empty}>{t.noInvoices}</p>
                ) : (
                    <div className={styles.list}>
                        {data.invoices.slice(0, 3).map((inv) => (
                            <div key={inv.id} className={styles.listItem}>
                                <div className={styles.listInfo}>
                                    <span className={styles.listTitle}>{inv.invoice_number}</span>
                                    <span className={`${styles.statusBadge} ${inv.status === "paid" ? styles.statusCompleted : inv.status === "overdue" ? styles.statusOnHold : styles.statusPlanning}`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <span className={styles.amount}>{inv.currency} {Number(inv.amount).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
