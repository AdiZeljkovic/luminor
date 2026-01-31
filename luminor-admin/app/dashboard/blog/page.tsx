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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-dark">Blog Posts</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your blog content</p>
                </div>
                <Link href="/dashboard/blog/create" className="btn btn-primary">
                    + Create New Post
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-[#0F172A] rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-dark group-hover:text-[#FF9F1C] transition-colors">{post.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${post.status === "published"
                                            ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]"
                                            : "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]"
                                            }`}
                                    >
                                        {post.status === "published" ? "✓ Published" : "📝 Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600 font-medium">{post.views.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/blog/edit/${post.id}`}
                                            className="px-3 py-2 text-sm font-semibold text-[#3B82F6] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="px-3 py-2 text-sm font-semibold text-[#EF4444] bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-gray-500 font-medium mb-4">No posts found</p>
                                    <Link href="/dashboard/blog/create" className="btn btn-secondary btn-sm">
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
