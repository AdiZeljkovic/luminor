"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "../page.module.css";
import { API_URL } from "@/lib/api";

interface HostingPlan {
    id: number;
    domain: string;
    plan_name: string;
    storage_gb: number;
    bandwidth_gb: number;
    expires_at: string | null;
    status: string;
    ip_address: string | null;
    nameservers: string[];
    features: string[];
    monthly_price: number | null;
}

const STATUS_STYLES: Record<string, string> = {
    active: styles.statusCompleted,
    suspended: styles.statusOnHold,
    expired: styles.statusReview,
    pending: styles.statusPlanning,
};

export default function PortalHostingPage() {
    const t = useTranslations('portal.hosting');
    const [plans, setPlans] = useState<HostingPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/portal/hosting`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => { if (data.success) setPlans(data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className={styles.loading}><div className={styles.spinner} /></div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
            </div>

            {!plans.length ? (
                <p className={styles.empty}>{t('empty')}</p>
            ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                    {plans.map((plan) => (
                        <div key={plan.id} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.listInfo}>
                                    <span className={styles.sectionTitle}>{plan.domain}</span>
                                    <span className={`${styles.statusBadge} ${STATUS_STYLES[plan.status] || ""}`}>
                                        {plan.status}
                                    </span>
                                </div>
                                {plan.monthly_price && (
                                    <span className={styles.amount}>€{Number(plan.monthly_price).toFixed(2)}/mo</span>
                                )}
                            </div>

                            <div style={{ padding: "16px 24px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                                <div>
                                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{t('labels.plan')}</div>
                                    <div style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.9rem" }}>{plan.plan_name}</div>
                                </div>
                                <div>
                                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{t('labels.storage')}</div>
                                    <div style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.9rem" }}>{plan.storage_gb} GB</div>
                                </div>
                                <div>
                                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{t('labels.bandwidth')}</div>
                                    <div style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.9rem" }}>{plan.bandwidth_gb} GB</div>
                                </div>
                                {plan.expires_at && (
                                    <div>
                                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                                            {t('expires')}
                                        </div>
                                        <div style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.9rem" }}>
                                            {new Date(plan.expires_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                                {plan.ip_address && (
                                    <div>
                                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{t('labels.ip')}</div>
                                        <div style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.85rem", fontFamily: "monospace" }}>{plan.ip_address}</div>
                                    </div>
                                )}
                            </div>

                            {plan.features?.length > 0 && (
                                <div style={{ padding: "0 24px 20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {plan.features.map((feat, i) => (
                                        <span key={i} style={{
                                            padding: "4px 12px",
                                            background: "rgba(99, 102, 241, 0.1)",
                                            border: "1px solid rgba(99, 102, 241, 0.2)",
                                            borderRadius: "20px",
                                            color: "#a5b4fc",
                                            fontSize: "0.75rem",
                                            fontWeight: "600"
                                        }}>
                                            ✓ {feat}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
