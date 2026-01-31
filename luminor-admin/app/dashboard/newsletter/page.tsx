"use client";

import { useEffect, useState } from "react";

interface Subscriber {
    id: number;
    email: string;
    status: string;
    source: string;
    created_at: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/newsletter`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setSubscribers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch subscribers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this subscriber?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/newsletter/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setSubscribers(subscribers.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error("Error deleting subscriber", error);
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Email,Status,Date\n"
            + subscribers.map(s => `${s.id},${s.email},${s.status},${new Date(s.created_at).toLocaleDateString()}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "subscribers_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-dark">Newsletter Subscribers</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your email list</p>
                </div>
                <button
                    onClick={handleExport}
                    className="btn btn-primary"
                    disabled={subscribers.length === 0}
                >
                    📥 Export CSV
                </button>
            </div>

            {/* List */}
            <div className="bg-white border-2 border-[#0F172A] rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                            <tr>
                                <th className="px-6 py-4 font-bold font-display text-dark uppercase text-xs tracking-wider">Email</th>
                                <th className="px-6 py-4 font-bold font-display text-dark uppercase text-xs tracking-wider">Status</th>
                                <th className="px-6 py-4 font-bold font-display text-dark uppercase text-xs tracking-wider">Date</th>
                                <th className="px-6 py-4 font-bold font-display text-dark uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-[#FFF9F0] transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark">{sub.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${sub.status === 'active'
                                            ? 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                                            : 'bg-gray-100 text-gray-500 border-gray-300'
                                            }`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(sub.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="text-[#EF4444] hover:text-[#991B1B] font-semibold text-sm transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No subscribers yet
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
