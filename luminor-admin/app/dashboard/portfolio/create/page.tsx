"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

export default function CreateProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'bs'>('en');
    const [formData, setFormData] = useState({
        // Multilingual fields
        title_en: "",
        title_bs: "",
        description_en: "",
        description_bs: "",
        challenge_en: "",
        challenge_bs: "",
        solution_en: "",
        solution_bs: "",
        // Shared fields
        category: "",
        client: "",
        website: "",
        date: "",
        image: "",
        images: "",
        technologies: "",
        testimonialQuote: "",
        testimonialAuthor: "",
        testimonialRole: "",
    });

    // New state for key results
    const [results, setResults] = useState<{ metric: string; label: string }[]>([
        { metric: "", label: "" }
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Results Handlers
    const handleResultChange = (index: number, field: 'metric' | 'label', value: string) => {
        const newResults = [...results];
        newResults[index][field] = value;
        setResults(newResults);
    };

    const addResult = () => {
        setResults([...results, { metric: "", label: "" }]);
    };

    const removeResult = (index: number) => {
        const newResults = results.filter((_, i) => i !== index);
        setResults(newResults);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            // Process array fields
            const technologiesArray = formData.technologies.split(",").map(t => t.trim()).filter(Boolean);
            const imagesArray = formData.images ? formData.images.split(",").map(i => i.trim()).filter(Boolean) : [];
            if (formData.image) imagesArray.unshift(formData.image);

            // Filter out empty results
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
                technologies: technologiesArray,
                results: validResults,
                images: imagesArray,
                testimonial: {
                    quote: formData.testimonialQuote,
                    author: formData.testimonialAuthor,
                    role: formData.testimonialRole
                },
                projectUrl: formData.website,
                date: formData.date
            };

            const res = await fetch(`${API_URL}/api/portfolio`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create project");
            }

            toast.success("Project created successfully");
            router.push("/dashboard/portfolio");
        } catch (error: any) {
            console.error("Error creating project", error);
            toast.error(error.message || "Error creating project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/portfolio" className="text-gray-500 hover:text-gray-900 transition-colors">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Project</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Language Tabs */}
                    <div className="flex gap-2 border-b border-gray-200 pb-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab('en')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === 'en'
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            🇬🇧 English
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('bs')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${activeTab === 'bs'
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            🇧🇦 Bosanski
                        </button>
                    </div>

                    {/* English Content */}
                    <div className={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title (English)</label>
                            <input
                                type="text"
                                name="title_en"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.title_en}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                            <RichTextEditor
                                value={formData.description_en}
                                onChange={(html) => setFormData(prev => ({ ...prev, description_en: html }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Challenge (English)</label>
                            <RichTextEditor
                                value={formData.challenge_en}
                                onChange={(html) => setFormData(prev => ({ ...prev, challenge_en: html }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solution (English)</label>
                            <RichTextEditor
                                value={formData.solution_en}
                                onChange={(html) => setFormData(prev => ({ ...prev, solution_en: html }))}
                            />
                        </div>
                    </div>

                    {/* Bosnian Content */}
                    <div className={activeTab === 'bs' ? 'block space-y-4' : 'hidden'}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov Projekta (Bosanski)</label>
                            <input
                                type="text"
                                name="title_bs"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                value={formData.title_bs}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opis (Bosanski)</label>
                            <RichTextEditor
                                value={formData.description_bs}
                                onChange={(html) => setFormData(prev => ({ ...prev, description_bs: html }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Izazov (Bosanski)</label>
                            <RichTextEditor
                                value={formData.challenge_bs}
                                onChange={(html) => setFormData(prev => ({ ...prev, challenge_bs: html }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rješenje (Bosanski)</label>
                            <RichTextEditor
                                value={formData.solution_bs}
                                onChange={(html) => setFormData(prev => ({ ...prev, solution_bs: html }))}
                            />
                        </div>
                    </div>

                    {/* Shared Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
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

                        {/* Enhanced Results Builder */}
                        <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Key Results / Metrics</label>
                            <p className="text-xs text-gray-500 mb-4">Add quantifiable results achieved (e.g., +40% Sales, 2.5x ROI).</p>

                            <div className="space-y-3">
                                {results.map((result, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Metric (e.g. +45%)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                value={result.metric}
                                                onChange={(e) => handleResultChange(index, 'metric', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-[2]">
                                            <input
                                                type="text"
                                                placeholder="Label (e.g. Increase in Sales)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                value={result.label}
                                                onChange={(e) => handleResultChange(index, 'label', e.target.value)}
                                            />
                                        </div>
                                        {results.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeResult(index)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addResult}
                                className="mt-4 text-sm font-semibold text-[#FF9F1C] hover:text-[#d37f0c] transition-colors flex items-center gap-1"
                            >
                                + Add Another Result
                            </button>
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
                            disabled={loading}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
