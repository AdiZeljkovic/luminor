"use client";

import Link from "next/link";
import { X, Megaphone } from "lucide-react";
import { useState } from "react";

interface BannerProps {
    message: string;
    link?: string;
}

export default function AnnouncementBanner({ message, link }: BannerProps) {
    const [visible, setVisible] = useState(true);

    if (!visible || !message) return null;

    const Content = () => (
        <div className="flex items-center gap-2 text-sm font-medium">
            <Megaphone size={16} className="animate-bounce" />
            <span>{message}</span>
        </div>
    );

    return (
        <div className="bg-[#FF9F1C] text-[#0F172A] px-4 py-2 relative z-50">
            <div className="container mx-auto flex items-center justify-center relative">
                {link ? (
                    <Link href={link} className="hover:underline opacity-90 hover:opacity-100 flex items-center gap-2">
                        <Content /> <span className="text-xs bg-[#0F172A] text-white px-2 py-0.5 rounded-full">Explore</span>
                    </Link>
                ) : (
                    <Content />
                )}

                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-[#0F172A]/10 rounded-full transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
