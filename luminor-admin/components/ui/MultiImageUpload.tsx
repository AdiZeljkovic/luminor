"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

interface MultiImageUploadProps {
    values: string[];
    onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ values, onChange }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setUploading(true);
        const uploaded: string[] = [];

        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append("image", file);
                const res = await axios.post(`${API_URL}/api/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                uploaded.push(res.data.url);
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        if (uploaded.length) {
            onChange([...values, ...uploaded]);
            toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemove = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Image Grid */}
            {values.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {values.map((url, i) => (
                        <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                            <img
                                src={url}
                                alt={`Gallery ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(i)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                {i + 1}/{values.length}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-500 hover:border-[#0F172A] hover:text-[#0F172A] transition-colors disabled:opacity-50"
            >
                {uploading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        <ImagePlus size={16} />
                        <span>{values.length > 0 ? "Add More Images" : "Upload Gallery Images"}</span>
                    </>
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
            />
        </div>
    );
}
