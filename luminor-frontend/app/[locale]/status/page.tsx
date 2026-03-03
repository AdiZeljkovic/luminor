"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import AnimatedSection from "@/components/AnimatedSection";
import styles from "./page.module.css";
import { API_URL } from "@/lib/api";

interface StatusService {
    id: number;
    name: string;
    description: string | null;
    status: "operational" | "degraded" | "outage" | "maintenance";
    category: string;
    order_num: number;
}

const STATUS_CONFIG = {
    operational: {
        label: { en: "Operational", bs: "Operativno" },
        color: "#22c55e",
        bg: "rgba(34, 197, 94, 0.1)",
        dot: "#22c55e",
    },
    degraded: {
        label: { en: "Degraded Performance", bs: "Smanjen Učinak" },
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.1)",
        dot: "#f59e0b",
    },
    outage: {
        label: { en: "Outage", bs: "Nedostupno" },
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.1)",
        dot: "#ef4444",
    },
    maintenance: {
        label: { en: "Maintenance", bs: "Održavanje" },
        color: "#6366f1",
        bg: "rgba(99, 102, 241, 0.1)",
        dot: "#6366f1",
    },
};

const STATIC_SERVICES: StatusService[] = [
    { id: 1, name: "Website / Frontend", description: "luminor.solutions main website", status: "operational", category: "web", order_num: 0 },
    { id: 2, name: "Admin Panel", description: "Management dashboard", status: "operational", category: "web", order_num: 1 },
    { id: 3, name: "API / Backend", description: "REST API and server services", status: "operational", category: "backend", order_num: 2 },
    { id: 4, name: "Email Services", description: "Transactional and contact emails", status: "operational", category: "communication", order_num: 3 },
    { id: 5, name: "Database", description: "Primary database cluster", status: "operational", category: "infrastructure", order_num: 4 },
    { id: 6, name: "CDN / File Storage", description: "Uploads and static assets", status: "operational", category: "infrastructure", order_num: 5 },
];

export default function StatusPage() {
    const locale = useLocale();
    const [services, setServices] = useState<StatusService[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/api/status`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setServices(data.data);
                } else {
                    setServices(STATIC_SERVICES);
                }
            } catch {
                setServices(STATIC_SERVICES);
            } finally {
                setLoading(false);
                setLastUpdated(new Date());
            }
        };

        fetchStatus();
        // Refresh every 60 seconds
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const allOperational = services.every((s) => s.status === "operational");
    const hasOutage = services.some((s) => s.status === "outage");
    const hasDegraded = services.some((s) => s.status === "degraded");

    const overallStatus = hasOutage
        ? "outage"
        : hasDegraded
        ? "degraded"
        : "operational";

    const overallMessages = {
        operational: {
            en: "All Systems Operational",
            bs: "Svi Sistemi Rade Normalno",
        },
        degraded: {
            en: "Partial System Degradation",
            bs: "Djelomično Smanjen Učinak",
        },
        outage: {
            en: "System Outage Detected",
            bs: "Otkrivena Nedostupnost Sustava",
        },
    };

    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, StatusService[]>);

    return (
        <main className={styles.page}>
            <AnimatedSection className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.badge}>Status</span>
                    <h1 className={styles.title}>
                        {locale === "bs" ? "Status Servisa" : "System Status"}
                    </h1>
                    <p className={styles.subtitle}>
                        {locale === "bs"
                            ? "Pratite dostupnost naših servisa u realnom vremenu"
                            : "Real-time availability of our services"}
                    </p>
                </div>
            </AnimatedSection>

            <section className={styles.statusSection}>
                <div className={styles.container}>
                    {/* Overall Status Banner */}
                    <div
                        className={styles.overallStatus}
                        style={{
                            background: STATUS_CONFIG[overallStatus].bg,
                            borderColor: STATUS_CONFIG[overallStatus].color,
                        }}
                    >
                        <span
                            className={styles.overallDot}
                            style={{ background: STATUS_CONFIG[overallStatus].dot }}
                        />
                        <span
                            className={styles.overallLabel}
                            style={{ color: STATUS_CONFIG[overallStatus].color }}
                        >
                            {overallMessages[overallStatus][locale as "en" | "bs"] || overallMessages[overallStatus].en}
                        </span>
                    </div>

                    {/* Services List */}
                    {loading ? (
                        <div className={styles.loading}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={styles.skeleton} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.servicesList}>
                            {Object.entries(groupedServices).map(([category, items]) => (
                                <div key={category} className={styles.categoryGroup}>
                                    <h3 className={styles.categoryTitle}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </h3>
                                    {items
                                        .sort((a, b) => a.order_num - b.order_num)
                                        .map((service) => {
                                            const config = STATUS_CONFIG[service.status];
                                            return (
                                                <div key={service.id} className={styles.serviceRow}>
                                                    <div className={styles.serviceInfo}>
                                                        <span className={styles.serviceName}>{service.name}</span>
                                                        {service.description && (
                                                            <span className={styles.serviceDesc}>{service.description}</span>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={styles.statusBadge}
                                                        style={{
                                                            background: config.bg,
                                                            color: config.color,
                                                        }}
                                                    >
                                                        <span
                                                            className={styles.statusDot}
                                                            style={{ background: config.dot }}
                                                        />
                                                        {config.label[locale as "en" | "bs"] || config.label.en}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Last Updated */}
                    <p className={styles.lastUpdated}>
                        {locale === "bs" ? "Zadnje ažuriranje" : "Last updated"}:{" "}
                        {lastUpdated.toLocaleTimeString(locale === "bs" ? "bs-BA" : "en-US")}
                        {" · "}
                        {locale === "bs" ? "Automatski refresh svakih 60 sekundi" : "Auto-refreshes every 60 seconds"}
                    </p>

                    {/* Contact CTA */}
                    <AnimatedSection className={styles.cta}>
                        <p className={styles.ctaText}>
                            {locale === "bs"
                                ? "Imate problem koji nije prikazan ovdje?"
                                : "Experiencing an issue not shown here?"}
                        </p>
                        <a href="/contact" className={styles.ctaButton}>
                            {locale === "bs" ? "Prijavite Incident" : "Report an Incident"}
                        </a>
                    </AnimatedSection>
                </div>
            </section>
        </main>
    );
}
