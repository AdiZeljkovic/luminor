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
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/blog" className="text-gray-500 hover:text-gray-900 transition-colors">
                    ← Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Create New Post</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
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
                            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                                        <input
                                            type="text"
                                            name="title_en"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                            value={formData.title_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (English)</label>
                                        <textarea
                                            name="excerpt_en"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                            value={formData.excerpt_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                                        <RichTextEditor
                                            value={formData.content_en}
                                            onChange={(html) => setFormData(prev => ({ ...prev, content_en: html }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bosnian Content */}
                            <div className={activeTab === 'bs' ? 'block' : 'hidden'}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Naslov (Bosanski)</label>
                                        <input
                                            type="text"
                                            name="title_bs"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                            value={formData.title_bs}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Izvod (Bosanski)</label>
                                        <textarea
                                            name="excerpt_bs"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                            value={formData.excerpt_bs}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sadržaj (Bosanski)</label>
                                        <RichTextEditor
                                            value={formData.content_bs}
                                            onChange={(html) => setFormData(prev => ({ ...prev, content_bs: html }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                                <ImageUpload
                                    value={formData.featuredImage}
                                    onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN - Sidebar Settings & SEO */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="card-brutal p-5 bg-white">
                        <h3 className="font-bold font-display text-[#0F172A] mb-4">Publish Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    placeholder="tech, news"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                form="blogForm"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? "Creating..." : "Create Post"}
                            </button>
                        </div>
                    </div>

                    {/* SEO Helper */}
                    <div className="space-y-2">
                        <div className="card-brutal p-4 border-b-0 rounded-b-none bg-blue-50 border-blue-100">
                            <label className="block text-xs font-bold uppercase text-blue-800 mb-1">Focus Keyword</label>
                            <input
                                type="text"
                                placeholder="e.g. web design"
                                className="w-full px-3 py-1.5 border border-blue-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                value={focusKeyword}
                                onChange={(e) => setFocusKeyword(e.target.value)}
                            />
                        </div>
                        <SeoHelper
                            title={activeTab === 'en' ? formData.title_en : formData.title_bs}
                            content={activeTab === 'en' ? formData.content_en : formData.content_bs}
                            keyword={focusKeyword}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
