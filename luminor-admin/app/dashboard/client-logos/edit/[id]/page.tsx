"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { ChevronLeft, Save, Trash } from "lucide-react";

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
                const res = await fetch(`http://localhost:5000/api/client-logos/${params.id}`, {
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
            const res = await fetch(`http://localhost:5000/api/client-logos/${params.id}`, {
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
            const res = await fetch(`http://localhost:5000/api/client-logos/${params.id}`, {
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
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/client-logos"
                        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-dark"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold font-display text-dark">Edit Client Logo</h1>
                        <p className="text-gray-500 text-sm mt-1">Update partner details</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Delete Logo"
                >
                    <Trash size={20} />
                </button>
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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Client Name *</label>
                                <input
                                    type="text"
                                    name="client_name"
                                    required
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 marginBottom-1">Website URL</label>
                                <input
                                    type="url"
                                    name="website_url"
                                    value={formData.website_url}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {/* Logo Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Logo Image *
                            </h2>
                            <ImageUpload
                                value={formData.logo_url}
                                onChange={handleImageChange}
                                label="Upload Logo"
                            />
                            <p className="text-xs text-gray-500 mt-2">Recommended: Transparent PNG/SVG, max height 100px</p>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        {/* Settings Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="font-bold text-dark text-sm uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Settings
                            </h2>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#FF9F1C] rounded focus:ring-[#FF9F1C] border-gray-300"
                                />
                                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                                    Active (Visible)
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
                            disabled={loading || !formData.logo_url}
                            className="w-full py-3 px-4 bg-[#0F172A] text-white font-bold rounded-xl shadow-lg hover:bg-[#1E293B] hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Logo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
