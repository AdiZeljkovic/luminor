"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ImageUpload from "@/components/ui/ImageUpload";
import SeoHelper from "@/components/SeoHelper";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'bs'>('en');

    // UI State for SEO Helper
    const [focusKeyword, setFocusKeyword] = useState("");

    const [formData, setFormData] = useState({
        title_en: "",
        title_bs: "",
        content_en: "",
        content_bs: "",
        excerpt_en: "",
        excerpt_bs: "",
        category: "news",
        status: "draft",
        featuredImage: "",
        tags: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

            const res = await fetch(`${API_URL}/api/blog`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title_en: formData.title_en,
                    title_bs: formData.title_bs,
                    content_en: formData.content_en,
                    content_bs: formData.content_bs,
                    excerpt_en: formData.excerpt_en,
                    excerpt_bs: formData.excerpt_bs,
                    category: formData.category,
                    status: formData.status,
                    featuredImage: formData.featuredImage,
                    tags: tagsArray,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create post");
            }

            toast.success("Blog post created successfully!");
            router.push("/dashboard/blog");
        } catch (error) {
            console.error("Error creating post", error);
            toast.error("Error creating post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
    return (
        <div className="max-w-[1600px] mx-auto pb-12 animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/blog" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all">
                    ←
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Create New Post</h1>
                    <p className="text-gray-500 font-medium text-sm">Draft a new article for your blog.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-bento p-8 bg-white">
                        <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                            {/* Language Tabs */}
                            <div className="flex gap-2 border-b-2 border-gray-100 pb-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('en')}
                                    className={`px-6 py-3 font-bold rounded-t-lg transition-all text-sm uppercase tracking-wide ${activeTab === 'en'
                                        ? 'bg-[#0F172A] text-white'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                        }`}
                                >
                                    🇬🇧 English
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('bs')}
                                    className={`px-6 py-3 font-bold rounded-t-lg transition-all text-sm uppercase tracking-wide ${activeTab === 'bs'
                                        ? 'bg-[#0F172A] text-white'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                        }`}
                                >
                                    🇧🇦 Bosanski
                                </button>
                            </div>

                            {/* English Content */}
                            <div className={`pt-6 ${activeTab === 'en' ? 'block' : 'hidden'}`}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Title (English)</label>
                                        <input
                                            type="text"
                                            name="title_en"
                                            className="input-field text-lg font-bold"
                                            placeholder="Enter post title..."
                                            value={formData.title_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Excerpt (English)</label>
                                        <textarea
                                            name="excerpt_en"
                                            rows={2}
                                            className="input-field py-3 text-sm font-medium"
                                            placeholder="Brief summary for SEO and previews..."
                                            value={formData.excerpt_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Content (English)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                            <RichTextEditor
                                                value={formData.content_en}
                                                onChange={(html) => setFormData(prev => ({ ...prev, content_en: html }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bosnian Content */}
                            <div className={`pt-6 ${activeTab === 'bs' ? 'block' : 'hidden'}`}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Naslov (Bosanski)</label>
                                        <input
                                            type="text"
                                            name="title_bs"
                                            className="input-field text-lg font-bold"
                                            placeholder="Unesite naslov..."
                                            value={formData.title_bs}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Izvod (Bosanski)</label>
                                        <textarea
                                            name="excerpt_bs"
                                            rows={2}
                                            className="input-field py-3 text-sm font-medium"
                                            placeholder="Kratki sažetak..."
                                            value={formData.excerpt_bs}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Sadržaj (Bosanski)</label>
                                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                            <RichTextEditor
                                                value={formData.content_bs}
                                                onChange={(html) => setFormData(prev => ({ ...prev, content_bs: html }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t-2 border-gray-100">
                                <label className="block text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wide">Featured Image</label>
                                <div className="p-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0F172A] transition-colors">
                                    <ImageUpload
                                        value={formData.featuredImage}
                                        onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN - Sidebar Settings & SEO */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="card-bento p-6 bg-white">
                        <h3 className="font-bold font-display text-xl text-[#0F172A] mb-6 flex items-center gap-2">
                            🚀 Publish Settings
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Status</label>
                                <select
                                    name="status"
                                    className="input-field"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="draft">📝 Draft</option>
                                    <option value="published">✅ Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Category</label>
                                <select
                                    name="category"
                                    className="input-field"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="news">News</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="graphic-design">Graphic Design</option>
                                    <option value="digital-marketing">Digital Marketing</option>
                                    <option value="seo">SEO</option>
                                    <option value="ai-automation">AI Automation</option>
                                    <option value="tutorials">Tutorials</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    placeholder="tech, news, branding"
                                    className="input-field"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wide">Separate with commas</p>
                            </div>

                            <button
                                type="submit"
                                form="blogForm"
                                disabled={loading}
                                className="w-full btn btn-primary py-3 text-base justify-center mt-2 group"
                            >
                                {loading ? <span className="spinner w-5 h-5 border-white border-t-transparent"></span> : (
                                    <>
                                        <span>Create Post</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* SEO Helper */}
                    <div className="space-y-2">
                        <div className="card-bento p-5 border-b-0 rounded-b-none bg-[#0F172A] text-white border-[#0F172A]">
                            <label className="block text-xs font-bold uppercase text-[#FF9F1C] tracking-widest mb-2">Focus Keyword</label>
                            <input
                                type="text"
                                placeholder="e.g. web design"
                                className="w-full px-4 py-2 border-2 border-white/20 bg-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF9F1C] focus:bg-white/20 transition-colors font-bold placeholder:text-gray-500"
                                value={focusKeyword}
                                onChange={(e) => setFocusKeyword(e.target.value)}
                            />
                        </div>
                        <div className="card-bento p-0 border-t-0 rounded-t-none overflow-hidden">
                            <SeoHelper
                                title={activeTab === 'en' ? formData.title_en : formData.title_bs}
                                content={activeTab === 'en' ? formData.content_en : formData.content_bs}
                                keyword={focusKeyword}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
