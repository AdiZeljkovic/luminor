"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/client-logos/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setLogos(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch client logos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this logo?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/client-logos/${id}`, {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-dark">Client Logos</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage partner and client logos</p>
                </div>
                <Link href="/dashboard/client-logos/create" className="btn btn-primary">
                    + Add New Logo
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-[#0F172A] rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Logo</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Website</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {logos.map((logo) => (
                            <tr key={logo.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="w-16 h-10 flex items-center justify-center bg-gray-100 rounded border border-gray-200 p-1">
                                        <img src={logo.logo_url} alt={logo.client_name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-dark group-hover:text-[#FF9F1C] transition-colors">{logo.client_name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-500 text-sm truncate max-w-[150px] block">
                                        {logo.website_url || "-"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {logo.is_active ? (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-[#DCFCE7] text-[#166534] rounded-full border border-[#86EFAC]">
                                            ACTIVE
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                            INACTIVE
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/client-logos/edit/${logo.id}`}
                                            className="px-3 py-2 text-sm font-semibold text-[#3B82F6] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(logo.id)}
                                            className="px-3 py-2 text-sm font-semibold text-[#EF4444] bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {logos.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-4">🌟</div>
                                    <p className="text-gray-500 font-medium mb-4">No client logos found</p>
                                    <Link href="/dashboard/client-logos/create" className="btn btn-secondary btn-sm">
                                        Add your first client logo
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
