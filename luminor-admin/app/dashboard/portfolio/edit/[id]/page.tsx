"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";

const parseJson = (val: any, fallback: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "object" && val !== null) return val;
    if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return fallback; }
    }
    return fallback;
};

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<"en" | "bs">("en");
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [results, setResults] = useState<{ metric: string; label: string }[]>([{ metric: "", label: "" }]);

    const [formData, setFormData] = useState({
        title_en: "", title_bs: "",
        description_en: "", description_bs: "",
        challenge_en: "", challenge_bs: "",
        solution_en: "", solution_bs: "",
        category: "",
        client: "",
        website: "",
        image: "",
        technologies: "",
        date: "",
        testimonialQuote: "",
        testimonialAuthor: "",
        testimonialRole: "",
        status: "draft",
    });

    useEffect(() => { fetchProject(); }, []);

    const fetchProject = async () => {
        try {
            const response = await apiClient.get(`/api/portfolio/admin/${id}`);
            if (response.success) {
                const p = response.data;
                const technologies = parseJson(p.technologies, []);
                const images = parseJson(p.images, []);
                const parsedResults = parseJson(p.results, []);
                const testimonial = parseJson(p.testimonial, {});

                const featured = p.featured_image || "";
                setGalleryImages(images.filter((img: string) => img !== featured));

                if (Array.isArray(parsedResults) && parsedResults.length > 0) {
                    setResults(parsedResults);
                }

                setFormData({
                    title_en: p.title_en || "",
                    title_bs: p.title_bs || "",
                    description_en: p.description_en || "",
                    description_bs: p.description_bs || "",
                    challenge_en: p.challenge_en || "",
                    challenge_bs: p.challenge_bs || "",
                    solution_en: p.solution_en || "",
                    solution_bs: p.solution_bs || "",
                    category: p.category || "",
                    client: p.client_name || "",
                    website: p.client_website || p.project_url || "",
                    image: featured,
                    technologies: technologies.join(", "),
                    date: p.completed_at || "",
                    testimonialQuote: testimonial?.quote || "",
                    testimonialAuthor: testimonial?.author || "",
                    testimonialRole: testimonial?.role || "",
                    status: p.status || "draft",
                });
            }
        } catch (error) {
            toast.error("Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResultChange = (index: number, field: "metric" | "label", value: string) => {
        const updated = [...results];
        updated[index][field] = value;
        setResults(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const technologiesArray = formData.technologies.split(",").map(t => t.trim()).filter(Boolean);
            const imagesArray = formData.image ? [formData.image, ...galleryImages] : [...galleryImages];
            const validResults = results.filter(r => r.metric && r.label);

            const payload = {
                title_en: formData.title_en,
                title_bs: formData.title_bs,
                description_en: formData.description_en,
                description_bs: formData.description_bs,
                challenge_en: formData.challenge_en,
                challenge_bs: formData.challenge_bs,
                solution_en: formData.solution_en,
                solution_bs: formData.solution_bs,
                category: formData.category,
                client: formData.client,
                featuredImage: formData.image,
                projectUrl: formData.website,
                technologies: technologiesArray,
                results: validResults,
                images: imagesArray,
                testimonial: {
                    quote: formData.testimonialQuote,
                    author: formData.testimonialAuthor,
                    role: formData.testimonialRole,
                },
                date: formData.date,
                status: formData.status,
            };

            await apiClient.put(`/api/portfolio/${id}`, payload);
            toast.success("Project updated successfully");
            router.push("/dashboard/portfolio");
        } catch (error) {
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
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-bento p-8 bg-white">
                        <form id="editPortfolioForm" onSubmit={handleSubmit} className="space-y-6">

                            {/* Language Tabs */}
                            <div className="flex gap-2 border-b-2 border-gray-100 pb-0">
                                <button type="button" onClick={() => setActiveTab("en")}
                                    className={`px-6 py-3 font-bold rounded-t-lg transition-all text-sm uppercase tracking-wide ${activeTab === "en" ? "bg-[#0F172A] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
                                    🇬🇧 English
                                </button>
                                <button type="button" onClick={() => setActiveTab("bs")}
                                    className={`px-6 py-3 font-bold rounded-t-lg transition-all text-sm uppercase tracking-wide ${activeTab === "bs" ? "bg-[#0F172A] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
                                    🇧🇦 Bosanski
                                </button>
                            </div>

                            {/* English */}
                            <div className={`pt-6 ${activeTab === "en" ? "block space-y-6" : "hidden"}`}>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Project Title (English)</label>
                                    <input type="text" name="title_en" className="input-field text-lg font-bold" value={formData.title_en} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Description (English)</label>
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                        <RichTextEditor value={formData.description_en} onChange={html => setFormData(p => ({ ...p, description_en: html }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Challenge (English)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <RichTextEditor value={formData.challenge_en} onChange={html => setFormData(p => ({ ...p, challenge_en: html }))} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Solution (English)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <RichTextEditor value={formData.solution_en} onChange={html => setFormData(p => ({ ...p, solution_en: html }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bosnian */}
                            <div className={`pt-6 ${activeTab === "bs" ? "block space-y-6" : "hidden"}`}>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Naslov Projekta (Bosanski)</label>
                                    <input type="text" name="title_bs" className="input-field text-lg font-bold" value={formData.title_bs} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Opis (Bosanski)</label>
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                        <RichTextEditor value={formData.description_bs} onChange={html => setFormData(p => ({ ...p, description_bs: html }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Izazov (Bosanski)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <RichTextEditor value={formData.challenge_bs} onChange={html => setFormData(p => ({ ...p, challenge_bs: html }))} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Rješenje (Bosanski)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <RichTextEditor value={formData.solution_bs} onChange={html => setFormData(p => ({ ...p, solution_bs: html }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Testimonial */}
                    <div className="card-bento p-8 bg-white">
                        <h3 className="text-xl font-bold font-display text-[#0F172A] mb-6">Testimonial</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Quote</label>
                                <textarea name="testimonialQuote" rows={3} className="input-field" value={formData.testimonialQuote} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Author Name</label>
                                    <input type="text" name="testimonialAuthor" className="input-field" value={formData.testimonialAuthor} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Author Role</label>
                                    <input type="text" name="testimonialRole" className="input-field" value={formData.testimonialRole} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    <div className="card-bento p-6 bg-white">
                        <h3 className="font-bold font-display text-xl text-[#0F172A] mb-6">🚀 Project Details</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Category</label>
                                <select name="category" required className="input-field" value={formData.category} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="graphic-design">Graphic Design</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                    <option value="seo">SEO</option>
                                    <option value="ai-automation">AI & Automation</option>
                                    <option value="mobile-development">Mobile Development</option>
                                    <option value="hosting">Hosting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Status</label>
                                <select name="status" className="input-field" value={formData.status} onChange={handleChange}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Client Name</label>
                                <input type="text" name="client" className="input-field" value={formData.client} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Project URL</label>
                                <input type="url" name="website" className="input-field" value={formData.website} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Completion Date</label>
                                <input type="text" name="date" className="input-field" value={formData.date} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Technologies</label>
                                <input type="text" name="technologies" className="input-field" placeholder="React, Next.js..." value={formData.technologies} onChange={handleChange} />
                            </div>
                            <button type="submit" form="editPortfolioForm" disabled={submitting}
                                className="w-full btn btn-primary py-3 text-base justify-center mt-2 group">
                                {submitting ? <span className="spinner w-5 h-5 border-white border-t-transparent"></span> : (
                                    <><span>Save Changes</span><span className="group-hover:translate-x-1 transition-transform">→</span></>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="card-bento p-6 bg-white">
                        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-3">Main Image</label>
                        <div className="p-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0F172A] transition-colors">
                            <ImageUpload value={formData.image} onChange={url => setFormData(p => ({ ...p, image: url }))} />
                        </div>
                        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-3 mt-6">Gallery Images</label>
                        <MultiImageUpload values={galleryImages} onChange={setGalleryImages} />
                    </div>

                    {/* Key Results */}
                    <div className="card-bento p-6 bg-[#0F172A] text-white border-[#0F172A]">
                        <h3 className="text-lg font-bold font-display text-white mb-4">Key Results</h3>
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <div key={index} className="flex gap-2 items-start p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="space-y-2 flex-1">
                                        <input type="text" placeholder="Metric (+45%)"
                                            className="w-full px-2 py-1 bg-transparent border-b border-white/20 text-sm font-bold text-[#FF9F1C] placeholder:text-gray-500 focus:outline-none focus:border-[#FF9F1C]"
                                            value={result.metric} onChange={e => handleResultChange(index, "metric", e.target.value)} />
                                        <input type="text" placeholder="Label (Sales)"
                                            className="w-full px-2 py-1 bg-transparent border-b border-white/20 text-xs font-medium text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-white"
                                            value={result.label} onChange={e => handleResultChange(index, "label", e.target.value)} />
                                    </div>
                                    {results.length > 1 && (
                                        <button type="button" onClick={() => setResults(results.filter((_, i) => i !== index))}
                                            className="text-gray-500 hover:text-red-400 p-1">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => setResults([...results, { metric: "", label: "" }])}
                            className="mt-4 w-full py-2 border border-dashed border-white/20 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-white transition-colors">
                            + Add Metric
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
