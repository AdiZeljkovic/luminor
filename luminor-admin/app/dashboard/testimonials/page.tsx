"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Testimonial {
    id: number;
    client_name: string;
    company_name: string;
    content: string;
    rating: number;
    is_featured: boolean;
    display_order: number;
    client_position?: string;
}

export default function TestimonialsListPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/testimonials/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setTestimonials(testimonials.filter((t) => t.id !== id));
            } else {
                alert("Failed to delete testimonial");
            }
        } catch (error) {
            console.error("Error deleting testimonial", error);
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
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Client Testimonials</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">Manage what your clients say about you.</p>
                </div>
                <Link href="/dashboard/testimonials/create" className="btn btn-primary group">
                    <span className="mr-2 text-lg">+</span>
                    New Testimonial
                </Link>
            </div>

            {/* Table */}
            <div className="card-bento p-0 overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] border-b-2 border-[#0F172A]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#0F172A] group-hover:text-[#FF9F1C] transition-colors">{testimonial.client_name}</div>
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[300px] font-medium">
                                            "{testimonial.content.substring(0, 60)}..."
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-700">{testimonial.company_name}</div>
                                        {testimonial.client_position && (
                                            <div className="text-xs text-gray-400">{testimonial.client_position}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[#FFB703] text-lg">{"★".repeat(testimonial.rating)}</span>
                                            <span className="text-gray-200 text-lg">{"★".repeat(5 - testimonial.rating)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {testimonial.is_featured ? (
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-[#DCFCE7] text-[#166534] rounded-lg border border-[#86EFAC]">
                                                FEATURED
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg">Regular</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/dashboard/testimonials/edit/${testimonial.id}`}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                                                title="Edit"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {testimonials.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-gray-100">
                                            💬
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0F172A]">No testimonials yet</h3>
                                        <p className="text-gray-500 font-medium mb-6 mt-1">Start collecting reviews from your happy clients.</p>
                                        <Link href="/dashboard/testimonials/create" className="btn btn-secondary inline-flex">
                                            Add First Testimonial
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
