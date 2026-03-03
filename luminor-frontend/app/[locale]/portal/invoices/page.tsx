"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import styles from "../page.module.css";
import { API_URL } from "@/lib/api";

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    currency: string;
    status: string;
    due_date: string | null;
    paid_at: string | null;
    items: Array<{ description: string; quantity: number; unit_price: number; total: number }>;
    notes: string | null;
}

const STATUS_STYLES: Record<string, string> = {
    draft: styles.statusPlanning,
    pending: styles.statusInProgress,
    paid: styles.statusCompleted,
    overdue: styles.statusOnHold,
    cancelled: styles.statusReview,
};

export default function PortalInvoicesPage() {
    const locale = useLocale();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/portal/invoices`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => { if (data.success) setInvoices(data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className={styles.loading}><div className={styles.spinner} /></div>;
    }

    const title = locale === "bs" ? "Vaše Fakture" : "Your Invoices";
    const empty = locale === "bs" ? "Nemate faktura." : "You have no invoices.";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {!invoices.length ? (
                <p className={styles.empty}>{empty}</p>
            ) : (
                <div className={styles.section}>
                    <div className={styles.list}>
                        {invoices.map((inv) => (
                            <div key={inv.id}>
                                <div
                                    className={styles.listItem}
                                    onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className={styles.listInfo}>
                                        <span className={styles.listTitle}>{inv.invoice_number}</span>
                                        <span className={`${styles.statusBadge} ${STATUS_STYLES[inv.status] || ""}`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        {inv.due_date && (
                                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                                                {locale === "bs" ? "Rok: " : "Due: "}
                                                {new Date(inv.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                        <span className={styles.amount}>{inv.currency} {Number(inv.amount).toFixed(2)}</span>
                                    </div>
                                </div>

                                {expanded === inv.id && inv.items?.length > 0 && (
                                    <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                                    {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                                                        <th key={h} style={{ padding: "8px 0", textAlign: "left", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inv.items.map((item, i) => (
                                                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                        <td style={{ padding: "10px 0", color: "#fff", fontSize: "0.875rem" }}>{item.description}</td>
                                                        <td style={{ padding: "10px 0", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>{item.quantity}</td>
                                                        <td style={{ padding: "10px 0", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>{inv.currency} {Number(item.unit_price).toFixed(2)}</td>
                                                        <td style={{ padding: "10px 0", color: "#fff", fontSize: "0.875rem", fontWeight: "700" }}>{inv.currency} {Number(item.total).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {inv.notes && (
                                            <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontStyle: "italic" }}>
                                                {inv.notes}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
