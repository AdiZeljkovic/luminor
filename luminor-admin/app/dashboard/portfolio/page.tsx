"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface PortfolioProject {
    id: number;
    title: string;
    category: string;
    client_name: string;
    status: string;
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
            const response = await apiClient.get('/api/portfolio/admin/all');
            if (response.success) {
                setProjects(response.data);
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
            await apiClient.delete(`/api/portfolio/${id}`);
            setProjects(projects.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting project", error);
            alert("Failed to delete project");
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
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Portfolio Projects</h1>
                    <p className="text-gray-500 font-medium mt-1">Showcase your best work and case studies.</p>
                </div>
                <Link href="/dashboard/portfolio/create" className="btn btn-primary px-6 flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Add New Project
                </Link>
            </div>

            {/* Table */}
            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#0F172A] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-[#FFF9F0] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-[#0F172A] text-base group-hover:text-[#FF9F1C] transition-colors">{project.title}</div>
                                    <div className="text-xs text-gray-400 font-medium mt-1">
                                        {new Date(project.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-[#DBEAFE] text-[#1E40AF] rounded-full border border-[#3B82F6] uppercase tracking-wide">
                                        {project.category}
                                    </span>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide ${project.status === 'published' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[#0F172A] font-bold">{project.client_name}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/dashboard/portfolio/edit/${project.id}`}
                                            className="px-3 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors border-2 border-[#0F172A] rounded-lg uppercase tracking-wide"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-100 rounded-lg uppercase tracking-wide"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="text-6xl mb-6 opacity-20">💼</div>
                                    <h3 className="text-xl font-bold text-[#0F172A]">No projects found</h3>
                                    <p className="text-gray-500 font-medium mb-6">Start building your portfolio by adding a project.</p>
                                    <Link href="/dashboard/portfolio/create" className="btn btn-secondary">
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
