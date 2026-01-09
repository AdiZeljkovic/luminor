"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || "Login failed");
            }

            localStorage.setItem("token", responseData.data.accessToken);
            localStorage.setItem("user", JSON.stringify(responseData.data.user));

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background bg-grid p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight mb-2">
                        <span className="text-[#FF9F1C]">Luminor</span>
                        <span className="text-dark">.</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Sign in to your admin account</p>
                </div>

                {/* Login Card */}
                <div className="card">
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border-2 border-[#EF4444] text-[#991B1B] px-4 py-3 rounded-lg mb-6 text-sm font-medium">
                            <span className="text-lg">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@luminor.com"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="spinner"></span>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In →"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Luminor Solutions. All rights reserved.
                </p>
            </div>
        </div>
    );
}
