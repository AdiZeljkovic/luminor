"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import styles from "../page.module.css";
import { API_URL } from "@/lib/api";

interface Project {
    id: number;
    title: string;
    description: string | null;
    status: string;
    progress: number;
    start_date: string | null;
    end_date: string | null;
    milestones: Array<{ title: string; status: string; due_date: string | null; completed: boolean }>;
}

const STATUS_STYLES: Record<string, string> = {
    planning: styles.statusPlanning,
    in_progress: styles.statusInProgress,
    review: styles.statusReview,
    completed: styles.statusCompleted,
    on_hold: styles.statusOnHold,
};

export default function PortalProjectsPage() {
    const locale = useLocale();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/portal/projects`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => { if (data.success) setProjects(data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className={styles.loading}><div className={styles.spinner} /></div>;
    }

    const title = locale === "bs" ? "Vaši Projekti" : "Your Projects";
    const empty = locale === "bs" ? "Nemate aktivnih projekata." : "You have no active projects.";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {!projects.length ? (
                <p className={styles.empty}>{empty}</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {projects.map((project) => (
                        <div key={project.id} className={styles.section}>
                            <div
                                className={styles.sectionHeader}
                                onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className={styles.listInfo}>
                                    <span className={styles.sectionTitle}>{project.title}</span>
                                    <span className={`${styles.statusBadge} ${STATUS_STYLES[project.status] || ""}`}>
                                        {project.status.replace("_", " ")}
                                    </span>
                                </div>
                                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                                    {project.progress}% · {expanded === project.id ? "▲" : "▼"}
                                </span>
                            </div>

                            {expanded === project.id && (
                                <div style={{ padding: "20px 24px" }}>
                                    {project.description && (
                                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "16px" }}>
                                            {project.description}
                                        </p>
                                    )}

                                    <div className={styles.progressBar} style={{ width: "100%", marginBottom: "20px" }}>
                                        <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
                                    </div>

                                    {project.milestones?.length > 0 && (
                                        <div>
                                            <h4 style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                                                Milestones
                                            </h4>
                                            {project.milestones.map((ms, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                    <span style={{ color: ms.completed ? "#86efac" : "rgba(255,255,255,0.3)", fontSize: "1rem" }}>
                                                        {ms.completed ? "✓" : "○"}
                                                    </span>
                                                    <span style={{ color: ms.completed ? "rgba(255,255,255,0.6)" : "#ffffff", fontSize: "0.875rem", textDecoration: ms.completed ? "line-through" : "none" }}>
                                                        {ms.title}
                                                    </span>
                                                    {ms.due_date && (
                                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginLeft: "auto" }}>
                                                            {new Date(ms.due_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
