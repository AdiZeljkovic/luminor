"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { ChevronLeft, Save, Trash } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function EditClientLogoPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        client_name: "",
        logo_url: "",
        website_url: "",
        is_active: true,
        display_order: 0
    });

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/client-logos/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (data.success) {
                    setFormData({
                        client_name: data.data.client_name,
                        logo_url: data.data.logo_url,
                        website_url: data.data.website_url || "",
                        is_active: data.data.is_active,
                        display_order: data.data.display_order
                    });
                } else {
                    toast.error("Client logo not found");
                    router.push("/dashboard/client-logos");
                }
            } catch (error) {
                console.error("Error fetching client logo", error);
                toast.error("Failed to load client logo");
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchLogo();
        }
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, logo_url: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/client-logos/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Client logo updated successfully!");
                router.push("/dashboard/client-logos");
            } else {
                toast.error("Failed to update client logo");
            }
        } catch (error) {
            console.error("Error updating client logo", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this logo?")) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/client-logos/${params.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success("Client logo deleted successfully");
                router.push("/dashboard/client-logos");
            } else {
                toast.error("Failed to delete client logo");
            }
        } catch (error) {
            console.error("Error deleting client logo", error);
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
                        href="/dashboard/client-logos"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit Client Logo</h1>
                        <p className="text-gray-500 font-medium text-sm">Update partner details.</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="btn bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                    title="Delete Logo"
                >
                    <Trash size={20} className="mr-2" />
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Client Info Card */}
                        <div className="card-bento p-8 bg-white">
                            <h2 className="flex items-center gap-2 font-bold text-[#0F172A] text-lg mb-6">
                                <span className="text-xl">🏢</span> Client Details
                            </h2>

                            <div className="space-y-6">
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
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Website URL</label>
                                    <input
                                        type="url"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo Card */}
                        <div className="card-bento p-8 bg-white">
                            <h2 className="flex items-center gap-2 font-bold text-[#0F172A] text-lg mb-6">
                                <span className="text-xl">🖼️</span> Logo Image
                            </h2>
                            <div className="p-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0F172A] transition-colors">
                                <ImageUpload
                                    value={formData.logo_url}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2 font-medium">Recommended: Transparent PNG/SVG, max height 100px</p>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        {/* Settings Card */}
                        <div className="card-bento p-6 bg-white">
                            <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider mb-4">
                                Settings
                            </h2>

                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-100 hover:border-[#0F172A] transition-colors mb-4 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.is_active ? 'bg-[#FF9F1C] border-[#FF9F1C]' : 'border-gray-300 bg-white'}`}>
                                    {formData.is_active && <span className="text-white text-xs">✓</span>}
                                </div>
                                <label className="text-sm font-bold text-[#0F172A] cursor-pointer select-none">
                                    Active (Visible)
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
                                    <span>Update Logo</span>
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
