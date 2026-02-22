"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";

export default function EditBlogPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        status: "",
        featuredImage: "",
        tags: "",
    });

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await apiClient.get(`/api/blog/${params.id}`);
            if (response.success) {
                const post = response.data;
                setFormData({
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    category: post.category,
                    status: post.status,
                    featuredImage: post.featured_image || "",
                    tags: post.tags ? post.tags.join(", ") : "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch post", error);
            toast.error("Failed to fetch post details");
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
            const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

            await apiClient.put(`/api/blog/${params.id}`, {
                ...formData,
                tags: tagsArray,
            });

            toast.success("Blog post updated successfully");
            router.push("/dashboard/blog");
        } catch (error) {
            console.error("Error updating post", error);
            toast.error("Error updating post");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    return (<div className="max-w-[1600px] mx-auto pb-12 animate-fade-up">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/blog" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:border-[#0F172A] transition-all">
                ←
            </Link>
            <div>
                <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit Post</h1>
                <p className="text-gray-500 font-medium text-sm">Update your blog article content.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Main Form */}
            <div className="lg:col-span-2 space-y-8">
                <div className="card-bento p-8 bg-white">
                    <form id="editBlogForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Language Tabs - Assuming the Edit page needs them too if the Create page has them, 
                                though the original file didn't verify if API returns en/bs. 
                                Keeping single language for now to avoid breaking if API schema differs, 
                                BUT applying the Bento styling. 
                                If multi-lang is verified, we can add tabs back. 
                                For now, I'll stick to the fields present in the original file but styled nicely, 
                                unless I can infer multi-lang support. 
                                UPDATE: The user didn't ask for schema changes, just redesign. 
                                I will stick to existing fields but style them beautifully.
                            */}

                        {/* Standard Fields (No Tabs unless verified) - actually, if Create has it, Edit should likely have it. 
                                But to be safe and avoid logic errors without seeing API response, I will style the EXISTING fields.
                            */}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Title</label>
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
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    rows={2}
                                    className="input-field py-3 text-sm font-medium"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">Content</label>
                                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0F172A] transition-colors">
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                    />
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

            {/* RIGHT COLUMN - Sidebar Settings */}
            <div className="space-y-6">
                <div className="card-bento p-6 bg-white">
                    <h3 className="font-bold font-display text-xl text-[#0F172A] mb-6 flex items-center gap-2">
                        🚀 Update Settings
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
                            <input
                                type="text"
                                name="category"
                                required
                                className="input-field"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-1.5">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                className="input-field"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wide">Comma separated</p>
                        </div>

                        <button
                            type="submit"
                            form="editBlogForm"
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
            </div>
        </div>
    </div>
    );
}
