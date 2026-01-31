"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Testimonial {
    id: number;
    client_name: string;
    company_name: string;
    content: string;
    rating: number;
    is_featured: boolean;
    display_order: number;
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-dark">Client Testimonials</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage what your clients say about you</p>
                </div>
                <Link href="/dashboard/testimonials/create" className="btn btn-primary">
                    + Add New Testimonial
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-[#0F172A] rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {testimonials.map((testimonial) => (
                            <tr key={testimonial.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-dark group-hover:text-[#FF9F1C] transition-colors">{testimonial.client_name}</div>
                                    <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                                        "{testimonial.content.substring(0, 50)}..."
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600 font-medium">{testimonial.company_name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[#FFB703] font-bold">
                                        {"★".repeat(testimonial.rating)}
                                        <span className="text-gray-300">{"★".repeat(5 - testimonial.rating)}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {testimonial.is_featured ? (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-[#DCFCE7] text-[#166534] rounded-full border border-[#86EFAC]">
                                            FEATURED
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Regular</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/testimonials/edit/${testimonial.id}`}
                                            className="px-3 py-2 text-sm font-semibold text-[#3B82F6] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            className="px-3 py-2 text-sm font-semibold text-[#EF4444] bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {testimonials.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-4">💬</div>
                                    <p className="text-gray-500 font-medium mb-4">No testimonials found</p>
                                    <Link href="/dashboard/testimonials/create" className="btn btn-secondary btn-sm">
                                        Add your first testimonial
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
