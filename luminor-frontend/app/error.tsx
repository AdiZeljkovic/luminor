'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Root error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    backgroundColor: '#f9fafb',
                    padding: '1rem'
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0' }}>500</h1>
                        <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Something went wrong</h2>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                            An unexpected error occurred. Please try again.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Try again
                            </button>
                            <Link
                                href="/"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    border: '1px solid #000',
                                    borderRadius: '0.375rem',
                                    textDecoration: 'none'
                                }}
                            >
                                Go home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
