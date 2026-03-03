"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

interface FAQItem {
    id: number;
    question_en: string;
    question_bs: string;
    category: string;
    order_num: number;
    is_active: boolean;
    created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    general: "General",
    "web-development": "Web Development",
    seo: "SEO",
    hosting: "Hosting",
    pricing: "Pricing",
    process: "Process",
};

export default function FAQListPage() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const response = await apiClient.get("/api/faq/all");
            if (response.success) {
                setFaqs(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            await apiClient.delete(`/api/faq/${id}`);
            setFaqs(faqs.filter((f) => f.id !== id));
        } catch (error) {
            console.error("Error deleting FAQ", error);
            alert("Failed to delete FAQ");
        }
    };

    const handleToggle = async (faq: FAQItem) => {
        try {
            const response = await apiClient.put(`/api/faq/${faq.id}`, {
                is_active: !faq.is_active,
            });
            if (response.success) {
                setFaqs(faqs.map((f) => (f.id === faq.id ? response.data : f)));
            }
        } catch (error) {
            console.error("Error toggling FAQ", error);
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
        <div className="space-y-8 animate-fade-up max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">FAQ Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage frequently asked questions shown on the website.</p>
                </div>
                <Link href="/dashboard/faq/create" className="btn btn-primary px-6 flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Add FAQ
                </Link>
            </div>

            {/* Table */}
            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Question (EN)</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {faqs.map((faq) => (
                            <tr key={faq.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-[#0F172A] text-sm group-hover:text-[#FF9F1C] transition-colors max-w-md truncate">
                                        {faq.question_en}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-1 max-w-md truncate">
                                        BS: {faq.question_bs}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full border border-gray-200 uppercase tracking-wide">
                                        {CATEGORY_LABELS[faq.category] || faq.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[#0F172A] font-bold">{faq.order_num}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <button
                                        onClick={() => handleToggle(faq)}
                                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wide cursor-pointer transition-colors ${faq.is_active
                                            ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]"
                                            : "bg-gray-100 text-gray-500 border-gray-300"
                                        }`}
                                    >
                                        {faq.is_active ? "✓ Active" : "Hidden"}
                                    </button>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/faq/edit/${faq.id}`}
                                            className="px-3 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors border-2 border-[#0F172A] rounded-lg uppercase tracking-wide"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-100 rounded-lg uppercase tracking-wide"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {faqs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="text-6xl mb-6 opacity-20">❓</div>
                                    <h3 className="text-xl font-bold text-[#0F172A]">No FAQs yet</h3>
                                    <p className="text-gray-500 font-medium mb-6">Start by adding your first FAQ.</p>
                                    <Link href="/dashboard/faq/create" className="btn btn-secondary">
                                        Add first FAQ
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
