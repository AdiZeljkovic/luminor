"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
    endpoint?: string;
}

export default function ImageUpload({ value, onChange, className, endpoint = 'http://localhost:5000/api/upload' }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadedUrl = response.data.url;
            onChange(uploadedUrl);
            setPreview(uploadedUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload image');
            // Revert preview on error
            setPreview(value);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
        setPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 h-48 bg-white shadow-sm",
                    preview ? "border-[#FF9F1C] bg-orange-50/10" : "border-dark hover:bg-gray-50 hover:border-gray-800"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium">Uploading...</span>
                    </div>
                ) : preview ? (
                    <div className="relative w-full h-full flex items-center justify-center group">
                        <img
                            src={preview}
                            alt="Upload preview"
                            className="max-h-full max-w-full object-contain rounded"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</span>
                    </div>
                )}
            </div>
        </div>
    );
}
