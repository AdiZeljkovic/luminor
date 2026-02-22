'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full">
                <div className="card-bento p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-[#0F172A] mb-2">
                        Failed to Load
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Something went wrong while loading the dashboard.
                    </p>
                    {error.message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
                            <p className="text-xs font-mono text-red-800">{error.message}</p>
                        </div>
                    )}
                    <button
                        onClick={() => reset()}
                        className="btn btn-primary w-full justify-center"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
