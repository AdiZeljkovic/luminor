'use client';

import { useEffect } from 'react';

export default function GlobalAdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin global error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white border-4 border-[#0F172A] rounded-2xl p-8 shadow-[8px_8px_0px_0px_#0F172A]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-3xl font-extrabold font-display text-[#0F172A] mb-2">
                            System Error
                        </h1>
                        <p className="text-gray-600 font-medium">
                            The admin panel encountered an unexpected error.
                        </p>
                    </div>

                    {error.message && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm font-mono text-red-800">{error.message}</p>
                            {error.digest && (
                                <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => reset()}
                            className="flex-1 btn btn-primary py-3 justify-center"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="flex-1 btn btn-secondary py-3 justify-center"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
