"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { ChevronLeft, Save, Star } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function CreateTestimonialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        client_name: "",
        client_position: "",
        company_name: "",
        content: "",
        rating: 5,
        avatar_url: "",
        is_featured: false,
        display_order: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, avatar_url: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/testimonials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Testimonial created successfully!");
                router.push("/dashboard/testimonials");
            } else {
                toast.error("Failed to create testimonial");
            }
        } catch (error) {
            console.error("Error creating testimonial", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/testimonials"
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-dark"
                >
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-display text-dark">Add New Testimonial</h1>
                    <p className="text-gray-500 text-sm mt-1">Share a success story</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Info Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Client Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Client Name *</label>
                                    <input
                                        type="text"
                                        name="client_name"
                                        required
                                        value={formData.client_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Company Name *</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        required
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Position / Job Title</label>
                                <input
                                    type="text"
                                    name="client_position"
                                    value={formData.client_position}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                    placeholder="e.g. CEO, Marketing Director"
                                />
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Review Content
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Testimonial Text *</label>
                                <textarea
                                    name="content"
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent font-primary"
                                    placeholder="What did the client say about us?"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Media */}
                    <div className="space-y-6">
                        {/* Rating Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Rating
                            </h2>
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                        className={`text-2xl transition-colors ${star <= formData.rating ? "text-[#FFB703]" : "text-gray-300"
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" name="rating" value={formData.rating} />
                            <p className="text-xs text-gray-500">Click stars to rate</p>
                        </div>

                        {/* Avatar Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Client Avatar
                            </h2>
                            <ImageUpload
                                value={formData.avatar_url}
                                onChange={handleImageChange}
                            />
                            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 150x150px</p>
                        </div>

                        {/* Settings Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Settings
                            </h2>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#FF9F1C] rounded focus:ring-[#FF9F1C] border-gray-300"
                                />
                                <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                                    Feature on Homepage
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Display Order</label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg hover:bg-[#1E293B] hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
