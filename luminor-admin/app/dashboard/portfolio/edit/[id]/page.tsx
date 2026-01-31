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
                }).filter((item): item is { metric: string; label: string } => item !== null);
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
        <div className="max-w-[1600px] mx-auto pb-12 animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/portfolio" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all">
                    ←
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit Project</h1>
                    <p className="text-gray-500 font-medium text-sm">Update project details and case study.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-bento p-8 bg-white">
                        <form id="editPortfolioForm" onSubmit={handleSubmit} className="space-y-6">

                            {/* Standard Fields (Since Edit might not have lang tabs if backend doesn't support them fully yet on GET, 
                                but based on Create page I should probably keep it consistent. 
                                However, the current fetchProject only maps flat fields. 
                                I will stick to the fields present in the state but styled beautifully.
                            */}

                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="input-field text-lg font-bold"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Short Description</label>
                                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                    <RichTextEditor
                                        value={formData.description}
                                        onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Challenge</label>
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                        <RichTextEditor
                                            value={formData.challenge}
                                            onChange={(html) => setFormData(prev => ({ ...prev, challenge: html }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Solution</label>
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                        <RichTextEditor
                                            value={formData.solution}
                                            onChange={(html) => setFormData(prev => ({ ...prev, solution: html }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t font-bold border-gray-100">
                                <label className="block text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wide">Results</label>
                                <input
                                    type="text"
                                    name="results"
                                    placeholder="e.g. 45%: Sales Increase, 2x: Traffic"
                                    className="input-field"
                                    value={formData.results}
                                    onChange={handleChange}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wide">Format: "Metric: Label, Metric: Label"</p>
                            </div>
                        </form>
                    </div>

                    {/* Testimonial Section */}
                    <div className="card-bento p-8 bg-white">
                        <h3 className="text-xl font-bold font-display text-[#0F172A] mb-6 flex items-center gap-2">Testimonial</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Quote</label>
                                <textarea
                                    name="testimonialQuote"
                                    rows={3}
                                    className="input-field"
                                    value={formData.testimonialQuote}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Author Name</label>
                                    <input
                                        type="text"
                                        name="testimonialAuthor"
                                        className="input-field"
                                        value={formData.testimonialAuthor}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Author Role</label>
                                    <input
                                        type="text"
                                        name="testimonialRole"
                                        className="input-field"
                                        value={formData.testimonialRole}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Sidebar Settings */}
                <div className="space-y-6">
                    <div className="card-bento p-6 bg-white">
                        <h3 className="font-bold font-display text-xl text-[#0F172A] mb-6 flex items-center gap-2">
                            🚀 Project Details
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Category</label>
                                <select
                                    name="category"
                                    required
                                    className="input-field"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select...</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="graphic-design">Graphic Design</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                    <option value="seo">SEO</option>
                                    <option value="ai-automation">AI & Automation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Client Name</label>
                                <input
                                    type="text"
                                    name="client"
                                    className="input-field"
                                    value={formData.client}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Project URL</label>
                                <input
                                    type="url"
                                    name="website"
                                    className="input-field"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Completion Date</label>
                                <input
                                    type="text"
                                    name="date"
                                    className="input-field"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Technologies</label>
                                <input
                                    type="text"
                                    name="technologies"
                                    className="input-field"
                                    value={formData.technologies}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                form="editPortfolioForm"
                                disabled={submitting}
                                className="w-full btn btn-primary py-3 text-base justify-center mt-2 group"
                            >
                                {submitting ? <span className="spinner w-5 h-5 border-white border-t-transparent"></span> : (
                                    <>
                                        <span>Save Changes</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="card-bento p-6 bg-white">
                        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-3">Main Image</label>
                        <div className="p-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0F172A] transition-colors">
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            />
                        </div>

                        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-3 mt-6">Gallery Images</label>
                        <textarea
                            name="images"
                            rows={3}
                            className="input-field text-xs font-mono"
                            value={formData.images}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
