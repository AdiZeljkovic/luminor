"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

interface Client {
    id: number;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    is_active: boolean;
    createdAt: string;
}

export default function ClientsListPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", company: "", phone: "" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await apiClient.get("/api/portal/admin/clients");
            if (response.success) setClients(response.data);
        } catch (err) {
            console.error("Failed to fetch clients", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError("");

        try {
            const response = await apiClient.post("/api/portal/admin/clients", form);
            if (response.success) {
                setClients([response.data, ...clients]);
                setShowForm(false);
                setForm({ name: "", email: "", password: "", company: "", phone: "" });
            } else {
                setFormError(response.error || "Failed to create client");
            }
        } catch (err: any) {
            setFormError(err.message || "Failed to create client");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this client? This will also delete their projects, hosting, and invoices.")) return;
        try {
            await apiClient.delete(`/api/portal/admin/clients/${id}`);
            setClients(clients.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error deleting client", err);
        }
    };

    const handleToggleActive = async (client: Client) => {
        try {
            const response = await apiClient.put(`/api/portal/admin/clients/${client.id}`, { is_active: !client.is_active });
            if (response.success) {
                setClients(clients.map((c) => c.id === client.id ? { ...c, is_active: !c.is_active } : c));
            }
        } catch (err) {
            console.error("Error toggling client", err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
    }

    return (
        <div className="space-y-8 animate-fade-up max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Client Portal</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage client accounts, projects, hosting, and invoices.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary px-6 flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Add Client
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <form onSubmit={handleCreate} className="card-bento space-y-4">
                    <h3 className="font-bold text-[#0F172A]">New Client Account</h3>
                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{formError}</div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password (min 8 chars) *</label>
                            <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company</label>
                            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Creating..." : "Create Account"}</button>
                    </div>
                </form>
            )}

            {/* Clients Table */}
            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Company</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Since</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-[#0F172A] group-hover:text-[#FF9F1C] transition-colors">{client.name}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{client.email}</div>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-600">{client.company || "-"}</td>
                                <td className="px-6 py-5">
                                    <button
                                        onClick={() => handleToggleActive(client)}
                                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wide cursor-pointer transition-colors ${client.is_active ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]" : "bg-gray-100 text-gray-500 border-gray-300"}`}
                                    >
                                        {client.is_active ? "✓ Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-400">
                                    {new Date(client.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/clients/${client.id}`}
                                            className="px-3 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors border-2 border-[#0F172A] rounded-lg uppercase tracking-wide"
                                        >
                                            Manage
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-100 rounded-lg uppercase tracking-wide"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="text-6xl mb-6 opacity-20">👤</div>
                                    <h3 className="text-xl font-bold text-[#0F172A]">No clients yet</h3>
                                    <p className="text-gray-500 font-medium">Add your first client to get started.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
