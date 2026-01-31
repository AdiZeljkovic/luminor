"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

interface PortfolioProject {
    id: number;
    title: string;
    category: string;
    client_name: string;
    created_at: string;
}

export default function PortfolioListPage() {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_URL}/api/portfolio`);
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/portfolio/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== id));
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project", error);
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
                    <h1 className="text-2xl font-bold font-display text-dark">Portfolio Projects</h1>
                    <p className="text-gray-500 text-sm mt-1">Showcase your best work</p>
                </div>
                <Link href="/dashboard/portfolio/create" className="btn btn-primary">
                    + Add New Project
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border-2 border-[#0F172A] rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-dark group-hover:text-[#FF9F1C] transition-colors">{project.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(project.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF] rounded-full border border-[#3B82F6]">
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600 font-medium">{project.client_name}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/portfolio/edit/${project.id}`}
                                            className="px-3 py-2 text-sm font-semibold text-[#3B82F6] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="px-3 py-2 text-sm font-semibold text-[#EF4444] bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="text-4xl mb-4">💼</div>
                                    <p className="text-gray-500 font-medium mb-4">No projects found</p>
                                    <Link href="/dashboard/portfolio/create" className="btn btn-secondary btn-sm">
                                        Add your first project
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
