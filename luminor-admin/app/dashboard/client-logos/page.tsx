"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ClientLogo {
    id: number;
    client_name: string;
    logo_url: string;
    website_url: string;
    is_active: boolean;
    display_order: number;
}

export default function ClientLogosListPage() {
    const [logos, setLogos] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const res = await fetch(`${API_URL}/api/client-logos/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (data.success) setLogos(data.data);
        } catch (error) {
            console.error("Failed to fetch logos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this logo?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/client-logos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setLogos(logos.filter((l) => l.id !== id));
            } else {
                alert("Failed to delete logo");
            }
        } catch (error) {
            console.error("Error deleting logo", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Client Logos</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">Manage partner and client logos.</p>
                </div>
                <Link href="/dashboard/client-logos/create" className="btn btn-primary group">
                    <span className="mr-2 text-lg">+</span>
                    New Logo
                </Link>
            </div>

            {/* Table */}
            <div className="card-bento p-0 overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] border-b-2 border-[#0F172A]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Logo</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Website</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logos.map((logo) => (
                                <tr key={logo.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-20 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-2 group-hover:border-[#FF9F1C] transition-colors">
                                            <img src={logo.logo_url} alt={logo.client_name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#0F172A] group-hover:text-[#FF9F1C] transition-colors">{logo.client_name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {logo.website_url ? (
                                            <a href={logo.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                                                {logo.website_url.replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {logo.is_active ? (
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-[#DCFCE7] text-[#166534] rounded-lg border border-[#86EFAC]">
                                                ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-500 rounded-lg border border-gray-200">
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/dashboard/client-logos/edit/${logo.id}`}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                                                title="Edit"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(logo.id)}
                                                className="w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {logos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-gray-100">
                                            🌟
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0F172A]">No client logos yet</h3>
                                        <p className="text-gray-500 font-medium mb-6 mt-1">Add logos to showcase your partners.</p>
                                        <Link href="/dashboard/client-logos/create" className="btn btn-secondary inline-flex">
                                            Add First Logo
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
