"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

interface Project { id: number; title: string; status: string; progress: number; }
interface HostingPlan { id: number; domain: string; plan_name: string; status: string; expires_at: string | null; }
interface Invoice { id: number; invoice_number: string; amount: number; currency: string; status: string; due_date: string | null; }

type TabType = "projects" | "hosting" | "invoices";

export default function ClientDetailPage() {
    const params = useParams();
    const clientId = params.id as string;

    const [activeTab, setActiveTab] = useState<TabType>("projects");
    const [projects, setProjects] = useState<Project[]>([]);
    const [hosting, setHosting] = useState<HostingPlan[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState("");

    // Project form
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectForm, setProjectForm] = useState({ title: "", description: "", status: "planning", progress: 0 });

    // Hosting form
    const [showHostingForm, setShowHostingForm] = useState(false);
    const [hostingForm, setHostingForm] = useState({ domain: "", plan_name: "Basic", storage_gb: 5, bandwidth_gb: 50, status: "active", monthly_price: "" });

    // Invoice form
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ amount: "", currency: "EUR", status: "pending", due_date: "" });

    useEffect(() => {
        // Get client name
        apiClient.get(`/api/portal/admin/clients`).then((res) => {
            if (res.success) {
                const c = res.data.find((c: any) => String(c.id) === clientId);
                if (c) setClientName(c.name);
            }
        }).catch(() => {});

        loadAll();
    }, [clientId]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [p, h, i] = await Promise.all([
                apiClient.get(`/api/portal/admin/clients/${clientId}/projects`),
                apiClient.get(`/api/portal/admin/clients/${clientId}/hosting`),
                apiClient.get(`/api/portal/admin/clients/${clientId}/invoices`),
            ]);
            if (p.success) setProjects(p.data);
            if (h.success) setHosting(h.data);
            if (i.success) setInvoices(i.data);
        } catch (err) {
            console.error("Load error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiClient.post("/api/portal/admin/projects", { ...projectForm, client_id: parseInt(clientId) });
        setShowProjectForm(false);
        setProjectForm({ title: "", description: "", status: "planning", progress: 0 });
        const res = await apiClient.get(`/api/portal/admin/clients/${clientId}/projects`);
        if (res.success) setProjects(res.data);
    };

    const handleCreateHosting = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiClient.post("/api/portal/admin/hosting", { ...hostingForm, client_id: parseInt(clientId) });
        setShowHostingForm(false);
        const res = await apiClient.get(`/api/portal/admin/clients/${clientId}/hosting`);
        if (res.success) setHosting(res.data);
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        await apiClient.post("/api/portal/admin/invoices", { ...invoiceForm, client_id: parseInt(clientId) });
        setShowInvoiceForm(false);
        const res = await apiClient.get(`/api/portal/admin/clients/${clientId}/invoices`);
        if (res.success) setInvoices(res.data);
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Delete project?")) return;
        await apiClient.delete(`/api/portal/admin/projects/${id}`);
        setProjects(projects.filter((p) => p.id !== id));
    };

    const handleDeleteHosting = async (id: number) => {
        if (!confirm("Delete hosting plan?")) return;
        await apiClient.delete(`/api/portal/admin/hosting/${id}`);
        setHosting(hosting.filter((h) => h.id !== id));
    };

    const handleDeleteInvoice = async (id: number) => {
        if (!confirm("Delete invoice?")) return;
        await apiClient.delete(`/api/portal/admin/invoices/${id}`);
        setInvoices(invoices.filter((i) => i.id !== id));
    };

    const handleMarkPaid = async (invoice: Invoice) => {
        const res = await apiClient.put(`/api/portal/admin/invoices/${invoice.id}`, { status: "paid" });
        if (res.success) setInvoices(invoices.map((i) => i.id === invoice.id ? res.data : i));
    };

    const TABS: { key: TabType; label: string }[] = [
        { key: "projects", label: `Projects (${projects.length})` },
        { key: "hosting", label: `Hosting (${hosting.length})` },
        { key: "invoices", label: `Invoices (${invoices.length})` },
    ];

    return (
        <div className="space-y-6 animate-fade-up max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/clients" className="text-gray-400 hover:text-[#0F172A] text-xl font-bold transition-colors">←</Link>
                    <div>
                        <h1 className="text-2xl font-extrabold font-display text-[#0F172A]">{clientName || `Client #${clientId}`}</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Manage projects, hosting, and invoices</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white border border-gray-200 p-2 rounded-xl shadow-sm w-fit">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab.key ? "bg-[#0F172A] text-white" : "text-gray-500 hover:text-[#0F172A]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#0F172A]">Projects</h2>
                        <button onClick={() => setShowProjectForm(!showProjectForm)} className="btn btn-primary px-4 text-sm">+ Add Project</button>
                    </div>
                    {showProjectForm && (
                        <form onSubmit={handleCreateProject} className="card-bento space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
                                    <input required type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm">
                                        {["planning", "in_progress", "review", "completed", "on_hold"].map((s) => (
                                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm resize-none" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-xs font-bold text-gray-500 uppercase">Progress: {projectForm.progress}%</label>
                                <input type="range" min={0} max={100} value={projectForm.progress} onChange={(e) => setProjectForm({ ...projectForm, progress: parseInt(e.target.value) })} className="flex-1" />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowProjectForm(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    )}
                    <div className="card-bento p-0 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {["Title", "Status", "Progress", "Actions"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-[#0F172A]">{p.title}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{p.status.replace("_", " ")}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full"><div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${p.progress}%` }} /></div>
                                                <span className="text-xs text-gray-500">{p.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleDeleteProject(p.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {projects.length === 0 && (
                                    <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">No projects yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Hosting Tab */}
            {activeTab === "hosting" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#0F172A]">Hosting Plans</h2>
                        <button onClick={() => setShowHostingForm(!showHostingForm)} className="btn btn-primary px-4 text-sm">+ Add Hosting</button>
                    </div>
                    {showHostingForm && (
                        <form onSubmit={handleCreateHosting} className="card-bento space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Domain *</label>
                                    <input required type="text" placeholder="example.com" value={hostingForm.domain} onChange={(e) => setHostingForm({ ...hostingForm, domain: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan Name</label>
                                    <input type="text" value={hostingForm.plan_name} onChange={(e) => setHostingForm({ ...hostingForm, plan_name: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Price (€)</label>
                                    <input type="number" step="0.01" value={hostingForm.monthly_price} onChange={(e) => setHostingForm({ ...hostingForm, monthly_price: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select value={hostingForm.status} onChange={(e) => setHostingForm({ ...hostingForm, status: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm">
                                        {["active", "suspended", "expired", "pending"].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowHostingForm(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    )}
                    <div className="card-bento p-0 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {["Domain", "Plan", "Status", "Expires", "Actions"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {hosting.map((h) => (
                                    <tr key={h.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-[#0F172A]">{h.domain}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600">{h.plan_name}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${h.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{h.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-400">{h.expires_at ? new Date(h.expires_at).toLocaleDateString() : "—"}</td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleDeleteHosting(h.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {hosting.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No hosting plans yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-[#0F172A]">Invoices</h2>
                        <button onClick={() => setShowInvoiceForm(!showInvoiceForm)} className="btn btn-primary px-4 text-sm">+ Add Invoice</button>
                    </div>
                    {showInvoiceForm && (
                        <form onSubmit={handleCreateInvoice} className="card-bento space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount *</label>
                                    <input required type="number" step="0.01" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Currency</label>
                                    <select value={invoiceForm.currency} onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm">
                                        {["EUR", "USD", "BAM", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                                    <input type="date" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select value={invoiceForm.status} onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm">
                                        {["draft", "pending", "paid", "overdue", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowInvoiceForm(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    )}
                    <div className="card-bento p-0 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {["Invoice #", "Amount", "Status", "Due Date", "Actions"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-medium text-[#0F172A]">{inv.invoice_number}</td>
                                        <td className="px-5 py-4 font-bold">{inv.currency} {Number(inv.amount).toFixed(2)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full ${inv.status === "paid" ? "bg-green-100 text-green-700" : inv.status === "overdue" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-400">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                {inv.status !== "paid" && (
                                                    <button onClick={() => handleMarkPaid(inv)} className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors font-bold">Mark Paid</button>
                                                )}
                                                <button onClick={() => handleDeleteInvoice(inv.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No invoices yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
