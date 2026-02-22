'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Blog error:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load blog content</h2>
                    <p className="text-gray-600">
                        We couldn't load this blog post. Please try again or browse other articles.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-[#0F172A] text-white rounded-lg font-bold hover:bg-[#1E293B]"
                    >
                        Try again
                    </button>
                    <Link
                        href="/blog"
                        className="px-4 py-2 bg-white text-[#0F172A] border-2 border-[#0F172A] rounded-lg font-bold"
                    >
                        All posts
                    </Link>
                </div>
            </div>
        </div>
    );
}
