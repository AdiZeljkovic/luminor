"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

interface StatusService {
    id: number;
    name: string;
    description: string | null;
    status: "operational" | "degraded" | "outage" | "maintenance";
    category: string;
    order_num: number;
}

const STATUS_OPTIONS = [
    { value: "operational", label: "Operational", color: "bg-green-100 text-green-800 border-green-300" },
    { value: "degraded", label: "Degraded Performance", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    { value: "outage", label: "Outage", color: "bg-red-100 text-red-800 border-red-300" },
    { value: "maintenance", label: "Maintenance", color: "bg-blue-100 text-blue-800 border-blue-300" },
];

const DEFAULT_SERVICES: Omit<StatusService, "id">[] = [
    { name: "Website / Frontend", description: "luminor.solutions main website", status: "operational", category: "web", order_num: 0 },
    { name: "Admin Panel", description: "Management dashboard", status: "operational", category: "web", order_num: 1 },
    { name: "API / Backend", description: "REST API and server services", status: "operational", category: "backend", order_num: 2 },
    { name: "Email Services", description: "Transactional and contact emails", status: "operational", category: "communication", order_num: 3 },
    { name: "Database", description: "Primary database cluster", status: "operational", category: "infrastructure", order_num: 4 },
    { name: "CDN / File Storage", description: "Uploads and static assets", status: "operational", category: "infrastructure", order_num: 5 },
];

export default function StatusAdminPage() {
    const [services, setServices] = useState<StatusService[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({ name: "", description: "", status: "operational" as const, category: "general", order_num: 0 });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get("/api/status");
            if (response.success) {
                setServices(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (service: StatusService, newStatus: string) => {
        setSaving(service.id);
        try {
            const response = await apiClient.put(`/api/status/${service.id}`, { status: newStatus });
            if (response.success) {
                setServices(services.map((s) => (s.id === service.id ? response.data : s)));
            }
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this service monitor?")) return;
        try {
            await apiClient.delete(`/api/status/${id}`);
            setServices(services.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Error deleting service", error);
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("/api/status", newService);
            if (response.success) {
                setServices([...services, response.data]);
                setShowAddForm(false);
                setNewService({ name: "", description: "", status: "operational", category: "general", order_num: 0 });
            }
        } catch (error) {
            console.error("Error adding service", error);
        }
    };

    const seedDefaults = async () => {
        if (!confirm("This will add default service monitors. Continue?")) return;
        for (const svc of DEFAULT_SERVICES) {
            try {
                await apiClient.post("/api/status", svc);
            } catch {
                // ignore duplicates
            }
        }
        fetchServices();
    };

    const getStatusConfig = (status: string) => {
        return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-up max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Status Page</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage service availability shown on the public status page.</p>
                </div>
                <div className="flex gap-3">
                    {services.length === 0 && (
                        <button onClick={seedDefaults} className="btn btn-secondary">
                            Seed Defaults
                        </button>
                    )}
                    <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary px-6 flex items-center gap-2">
                        <span className="text-lg leading-none">+</span> Add Service
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <form onSubmit={handleAddService} className="card-bento space-y-4">
                    <h3 className="font-bold text-[#0F172A]">Add New Service Monitor</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Name *</label>
                            <input
                                type="text"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                required
                                placeholder="e.g. API / Backend"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                            <input
                                type="text"
                                value={newService.category}
                                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                placeholder="e.g. backend, web, infrastructure"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input
                            type="text"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            placeholder="Short description of this service"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FF9F1C] text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Service</button>
                    </div>
                </form>
            )}

            {/* Services Table */}
            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Service</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Current Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Change Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map((service) => {
                            const config = getStatusConfig(service.status);
                            return (
                                <tr key={service.id} className="hover:bg-[#FFF9F0] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-[#0F172A]">{service.name}</div>
                                        {service.description && (
                                            <div className="text-xs text-gray-400 mt-1">{service.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full uppercase tracking-wide">
                                            {service.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${config.color}`}>
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            value={service.status}
                                            onChange={(e) => handleStatusChange(service, e.target.value)}
                                            disabled={saving === service.id}
                                            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#FF9F1C] cursor-pointer disabled:opacity-50"
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {saving === service.id && (
                                            <span className="ml-2 text-xs text-gray-400">Saving...</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-100 rounded-lg uppercase tracking-wide"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="text-6xl mb-6 opacity-20">📡</div>
                                    <h3 className="text-xl font-bold text-[#0F172A]">No services monitored yet</h3>
                                    <p className="text-gray-500 font-medium mb-6">Add services or click "Seed Defaults" to get started quickly.</p>
                                    <button onClick={seedDefaults} className="btn btn-secondary">
                                        Seed Default Services
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Public Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <p className="text-sm text-blue-700 font-medium">
                    Public status page is visible at <strong>/status</strong> on the main website.
                </p>
                <a
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://luminor.solutions'}/status`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline"
                >
                    View Public Page →
                </a>
            </div>
        </div>
    );
}
