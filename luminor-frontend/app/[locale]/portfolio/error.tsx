'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Portfolio error:', error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load portfolio</h2>
                    <p className="text-gray-600">
                        We couldn't load this project. Please try again or explore other work.
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
                        href="/portfolio"
                        className="px-4 py-2 bg-white text-[#0F172A] border-2 border-[#0F172A] rounded-lg font-bold"
                    >
                        All projects
                    </Link>
                </div>
            </div>
        </div>
    );
}
