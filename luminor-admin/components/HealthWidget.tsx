"use client";

import { useEffect, useState } from "react";
import { Database, Server, HardDrive, RefreshCw, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

type Status = 'connected' | 'disconnected' | 'error' | 'unknown';

interface SystemHealth {
    database: { status: Status; latency: number };
    redis: { status: Status; latency: number; hit_rate: string };
    system: {
        disk: { total: string; used: string; free: string; percent: string };
    };
}

export default function HealthWidget() {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchHealth = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/system/health`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setHealth(data.data);
                setError(false);
            }
        } catch (error) {
            console.error("Health check failed:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        // Poll every 30s
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const StatusIndicator = ({ status }: { status: Status }) => {
        const colors = {
            connected: "bg-green-500",
            disconnected: "bg-gray-400",
            error: "bg-red-500",
            unknown: "bg-yellow-500"
        };
        return <div className={`w-3 h-3 rounded-full ${colors[status] || colors.unknown} animate-pulse`} />;
    };

    if (loading) return <div className="card-brutal p-6 animate-pulse bg-gray-50 h-[200px]" />;

    return (
        <div className="card-brutal p-6 border-b-4 border-r-4 border-[#0F172A]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold font-display text-lg text-[#0F172A] flex items-center gap-2">
                    <Server size={20} /> System Status
                </h3>
                <button onClick={fetchHealth} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Refresh">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Database */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
                            <Database size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Database</p>
                            <p className="font-bold text-[#0F172A]">{health?.database.status === 'connected' ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                        <span className="text-xs font-mono text-gray-400">{health?.database.latency}ms</span>
                        <StatusIndicator status={health?.database.status || 'unknown'} />
                    </div>
                </div>

                {/* Redis */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-700 rounded-md">
                            <Server size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Redis Cache</p>
                            <p className="font-bold text-[#0F172A]">{health?.redis.status === 'connected' ? 'Active' : 'Disabled'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-500 font-medium">Hit Rate: {health?.redis.hit_rate || 'N/A'}</span>
                        </div>
                        <StatusIndicator status={health?.redis.status || 'unknown'} />
                    </div>
                </div>

                {/* Disk Space */}
                {health?.system?.disk && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-700 rounded-md">
                                <HardDrive size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Disk Storage</p>
                                <p className="font-bold text-[#0F172A]">{health.system.disk.free} Free</p>
                            </div>
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#0F172A]"
                                style={{ width: health.system.disk.percent }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
