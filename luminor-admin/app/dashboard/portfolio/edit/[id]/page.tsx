"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

export default function EditProjectPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        client: "",
        website: "",
        image: "",
        images: "",
        technologies: "",
        challenge: "",
        solution: "",
        results: "",
        date: "",
        testimonialQuote: "",
        testimonialAuthor: "",
        testimonialRole: "",
    });

    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            const res = await fetch(`${API_URL}/api/portfolio/${params.id}`);
            const data = await res.json();
            if (data.success) {
                const project = data.data;
                setFormData({
                    title: project.title,
                    description: project.description,
                    category: project.category,
                    client: project.client_name || "",
                    website: project.client_website || project.project_url || "",
                    image: project.featured_image || "",
                    images: project.images && project.images.length > 0 ? project.images.join(", ") : "",
                    technologies: project.technologies ? project.technologies.join(", ") : "",
                    challenge: project.challenge || "",
                    solution: project.solution || "",
                    results: project.results && Array.isArray(project.results)
                        ? project.results.map((r: any) => `${r.metric}: ${r.label}`).join(", ")
                        : "",
                    date: project.completed_at || "",
                    testimonialQuote: project.testimonial?.quote || "",
                    testimonialAuthor: project.testimonial?.author || "",
                    testimonialRole: project.testimonial?.role || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch project", error);
            toast.error("Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const technologiesArray = formData.technologies.split(",").map(t => t.trim()).filter(Boolean);

            // Parse Results
            let resultsData: { metric: string; label: string }[] = [];
            if (formData.results) {
                resultsData = formData.results.split(",").map(r => {
                    const parts = r.trim().split(":");
                    if (parts.length >= 2) {
                        const metric = parts[0].trim();
                        const label = parts.slice(1).join(":").trim();
                        return { metric, label };
                    }
                    return null;
                }).filter(Boolean);
            }

            const imagesArray = formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [];

            // Construct payload to match backend expectation
            const payload = {
                ...formData,
                featuredImage: formData.image, // Map back to what backend expects in body
                shortDescription: "", // Optional, or derive from description
                projectUrl: formData.website,
                client: {
                    name: formData.client,
                    website: formData.website
                },
                technologies: technologiesArray,
                results: resultsData,
                images: imagesArray,
                testimonial: {
                    quote: formData.testimonialQuote,
                    author: formData.testimonialAuthor,
                    role: formData.testimonialRole
                },
                date: formData.date
            };

            const res = await fetch(`${API_URL}/api/portfolio/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to update project");
            }

            toast.success("Project updated successfully");
            router.push("/dashboard/portfolio");
        } catch (error) {
            console.error("Error updating project", error);
            toast.error("Failed to update project");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/portfolio" className="text-gray-500 hover:text-gray-900 transition-colors">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit Project</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="web-development">Web Development</option>
                                <option value="graphic-design">Graphic Design</option>
                                <option value="digital-marketing">Digital Marketing</option>
                                <option value="seo">SEO</option>
                                <option value="ai-automation">AI & Automation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                            <input
                                type="text"
                                name="client"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.client}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                            <input
                                type="url"
                                name="website"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
                            <RichTextEditor
                                value={formData.challenge}
                                onChange={(html) => setFormData(prev => ({ ...prev, challenge: html }))}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                            <RichTextEditor
                                value={formData.solution}
                                onChange={(html) => setFormData(prev => ({ ...prev, solution: html }))}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Image URLs (comma separated)</label>
                            <textarea
                                name="images"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.images}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                            <input
                                type="text"
                                name="technologies"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.technologies}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                            <input
                                type="text"
                                name="date"
                                placeholder="e.g. Decembar 2023"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Results (Format: "Metric: Label, Metric: Label")</label>
                            <input
                                type="text"
                                name="results"
                                placeholder="e.g. 45%: Sales Increase, 2x: Traffic"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.results}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Testimonial</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                                    <textarea
                                        name="testimonialQuote"
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                        value={formData.testimonialQuote}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                    <input
                                        type="text"
                                        name="testimonialAuthor"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                        value={formData.testimonialAuthor}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
                                    <input
                                        type="text"
                                        name="testimonialRole"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                        value={formData.testimonialRole}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
