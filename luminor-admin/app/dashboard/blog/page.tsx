"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface BlogPost {
    id: number;
    title: string;
    category: string;
    status: string;
    created_at: string;
    views: number;
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/blog`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/blog/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setPosts(posts.filter((post) => post.id !== id));
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-up max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Blog Posts</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your blog content and SEO metadata.</p>
                </div>
                <Link href="/dashboard/blog/create" className="btn btn-primary px-6 flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Create New Post
                </Link>
            </div>

            {/* Table */}
            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Views</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-[#0F172A] text-base group-hover:text-[#FF9F1C] transition-colors">{post.title}</div>
                                    <div className="text-xs text-gray-400 font-medium mt-1">
                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full border border-gray-200 uppercase tracking-wide">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wide ${post.status === "published"
                                            ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]"
                                            : "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]"
                                            }`}
                                    >
                                        {post.status === "published" ? "✓ Public" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[#0F172A] font-bold">{post.views.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/blog/edit/${post.id}`}
                                            className="px-3 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors border-2 border-[#0F172A] rounded-lg uppercase tracking-wide"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-100 rounded-lg uppercase tracking-wide"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="text-6xl mb-6 opacity-20">📝</div>
                                    <h3 className="text-xl font-bold text-[#0F172A]">No posts found</h3>
                                    <p className="text-gray-500 font-medium mb-6">Get started by creating your first blog post.</p>
                                    <Link href="/dashboard/blog/create" className="btn btn-secondary">
                                        Create your first post
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
