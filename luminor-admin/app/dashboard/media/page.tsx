"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { API_URL } from "@/lib/api";
import { Trash2, Copy, Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FileItem {
    name: string;
    url: string;
    size: number;
    createdAt: string;
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchFiles = async () => {
        try {
            const response = await apiClient.get('/api/media');
            if (response.success) {
                setFiles(response.data.map((f: any) => ({ name: f.filename, url: f.url, size: f.size, createdAt: f.created_at })));
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            toast.error("Failed to load media library");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Image uploaded successfully");
                fetchFiles(); // Refresh list
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;

        try {
            await apiClient.delete(`/api/media/${encodeURIComponent(filename)}`);
            toast.success("File deleted");
            setFiles(files.filter(f => f.name !== filename));
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard!");
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Media Library</h1>
                    <p className="text-gray-500">Manage all your uploaded images.</p>
                </div>
                <div>
                    <label className={`btn btn-primary cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : 'Upload New'}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="spinner"></div></div>
            ) : files.length === 0 ? (
                <div className="card-brutal p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ImageIcon size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">No images found</h3>
                    <p className="text-gray-500 mb-6">Upload your first image to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map((file) => (
                        <div key={file.name} className="group relative card-brutal p-2 hover:shadow-lg transition-all">
                            <div className="aspect-square relative bg-gray-100 rounded-sm overflow-hidden mb-2 border border-gray-100">
                                <Image
                                    src={file.url}
                                    alt={file.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="p-2 bg-white text-gray-900 rounded hover:bg-[#FF9F1C] hover:text-[#0F172A] transition-colors"
                                        title="Copy URL"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        className="p-2 bg-white text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="px-1">
                                <p className="text-xs font-bold text-[#0F172A] truncate" title={file.name}>{file.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{formatSize(file.size)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
