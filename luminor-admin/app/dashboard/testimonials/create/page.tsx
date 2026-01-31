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
        <div className="max-w-[1200px] mx-auto pb-12 animate-fade-up">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/testimonials"
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all"
                >
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Add New Testimonial</h1>
                    <p className="text-gray-500 font-medium text-sm">Share a success story.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Client Info Card */}
                        <div className="card-bento p-8 bg-white">
                            <h2 className="flex items-center gap-2 font-bold text-[#0F172A] text-lg mb-6">
                                <span className="text-xl">👤</span> Client Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Client Name *</label>
                                    <input
                                        type="text"
                                        name="client_name"
                                        required
                                        value={formData.client_name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Company Name *</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        required
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Position / Job Title</label>
                                <input
                                    type="text"
                                    name="client_position"
                                    value={formData.client_position}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. CEO, Marketing Director"
                                />
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="card-bento p-8 bg-white">
                            <h2 className="flex items-center gap-2 font-bold text-[#0F172A] text-lg mb-6">
                                <span className="text-xl">💬</span> Review Content
                            </h2>

                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Testimonial Text *</label>
                                <textarea
                                    name="content"
                                    required
                                    rows={5}
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="input-field text-base leading-relaxed"
                                    placeholder="What did the client say about us?"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Media */}
                    <div className="space-y-6">
                        {/* Rating Card */}
                        <div className="card-bento p-6 bg-white">
                            <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider mb-4">
                                Rating
                            </h2>
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            className={`text-2xl transition-all hover:scale-110 ${star <= formData.rating ? "text-[#FFB703]" : "text-gray-300"
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <span className="font-bold text-[#0F172A] text-lg">{formData.rating}.0</span>
                            </div>
                            <input type="hidden" name="rating" value={formData.rating} />
                        </div>

                        {/* Avatar Card */}
                        <div className="card-bento p-6 bg-white">
                            <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider mb-4">
                                Client Avatar
                            </h2>
                            <div className="p-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0F172A] transition-colors">
                                <ImageUpload
                                    value={formData.avatar_url}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase text-center">Recommended: Square 150x150</p>
                        </div>

                        {/* Settings Card */}
                        <div className="card-bento p-6 bg-white">
                            <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider mb-4">
                                Settings
                            </h2>

                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-100 hover:border-[#0F172A] transition-colors mb-4 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.is_featured ? 'bg-[#FF9F1C] border-[#FF9F1C]' : 'border-gray-300 bg-white'}`}>
                                    {formData.is_featured && <span className="text-white text-xs">✓</span>}
                                </div>
                                <label className="text-sm font-bold text-[#0F172A] cursor-pointer select-none">
                                    Feature on Homepage
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Display Order</label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">Lower numbers appear first</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-4 text-base justify-center group"
                        >
                            {loading ? (
                                <span className="spinner w-6 h-6 border-white border-t-transparent"></span>
                            ) : (
                                <>
                                    <Save size={20} className="mr-2" />
                                    <span>Save Testimonial</span>
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
