"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { ChevronLeft, Save, Trash } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function EditTestimonialPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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

    useEffect(() => {
        const fetchTestimonial = async () => {
            try {
                const response = await apiClient.get(`/api/testimonials/${params.id}`);

                if (response.success) {
                    setFormData({
                        client_name: response.data.client_name,
                        client_position: response.data.client_position || "",
                        company_name: response.data.company_name,
                        content: response.data.content,
                        rating: response.data.rating,
                        avatar_url: response.data.avatar_url || "",
                        is_featured: response.data.is_featured,
                        display_order: response.data.display_order
                    });
                } else {
                    toast.error("Testimonial not found");
                    router.push("/dashboard/testimonials");
                }
            } catch (error) {
                console.error("Error fetching testimonial", error);
                toast.error("Failed to load testimonial");
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchTestimonial();
        }
    }, [params.id, router]);

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
            await apiClient.put(`/api/testimonials/${params.id}`, formData);
            toast.success("Testimonial updated successfully!");
            router.push("/dashboard/testimonials");
        } catch (error) {
            console.error("Error updating testimonial", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        setLoading(true);
        try {
            await apiClient.delete(`/api/testimonials/${params.id}`);
            toast.success("Testimonial deleted successfully");
            router.push("/dashboard/testimonials");
        } catch (error) {
            console.error("Error deleting testimonial", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto pb-12 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/testimonials"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit Testimonial</h1>
                        <p className="text-gray-500 font-medium text-sm">Update client review details.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                        title="Delete Testimonial"
                    >
                        <Trash size={20} className="mr-2" />
                        Delete
                    </button>
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
                                    <span>Update Testimonial</span>
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
