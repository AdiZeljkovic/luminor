"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, MessageSquare, Mail, Layers, ArrowUpRight, Plus, ExternalLink } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import HealthWidget from "@/components/HealthWidget";

interface DashboardStats {
    counts: {
        posts: number;
        projects: number;
        messages: number;
        newMessages: number;
        subscribers: number;
        visits: number;
    };
    traffic: {
        date: string;
        total_views: number;
        total_unique: number;
    }[];
    recents?: {
        messages: any[];
        subscribers: any[];
    }
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/analytics/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
    }

    const { counts } = stats || { counts: { posts: 0, projects: 0, messages: 0, newMessages: 0, subscribers: 0, visits: 0 } };

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{currentDate}</h4>
                    <h1 className="text-3xl md:text-4xl font-extrabold font-display text-[#0F172A]">
                        Good Morning! ☀️
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/blog/create" className="btn btn-secondary shadow-[4px_4px_0px_#0F172A]">
                        <Plus size={18} /> New Post
                    </Link>
                    <Link href="/dashboard/portfolio/create" className="btn btn-primary">
                        <Plus size={18} /> New Project
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Visits"
                    value={counts.visits?.toLocaleString() || '0'}
                    icon={Eye}
                    trend="12%"
                    trendType="up"
                />
                <StatCard
                    title="Total Leads"
                    value={counts.messages?.toString() || '0'}
                    icon={MessageSquare}
                    trend={counts.newMessages > 0 ? `${counts.newMessages} new` : undefined}
                    trendType={counts.newMessages > 0 ? "up" : "neutral"}
                    color="#10B981"
                />
                <StatCard
                    title="Subscribers"
                    value={counts.subscribers?.toString() || '0'}
                    icon={Mail}
                    trend="Active"
                    trendType="neutral"
                    color="#3B82F6"
                />
                <StatCard
                    title="Total Content"
                    value={(counts.posts + counts.projects).toString()}
                    icon={Layers}
                    color="#FF9F1C"
                />
            </div>

            {/* Main Content Area: Chart + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Traffic Chart Placeholder (Redesigned) */}
                <div className="lg:col-span-2 card-brutal p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-display text-[#0F172A]">Traffic Overview</h2>
                        <select className="bg-gray-50 border-2 border-gray-200 rounded-md text-sm px-3 py-1 font-bold text-gray-600 outline-none focus:border-[#0F172A]">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end gap-2 pt-4 border-b border-gray-100">
                        {stats?.traffic?.length ? (
                            stats.traffic.map((day, i) => {
                                const maxViews = Math.max(...stats.traffic.map(t => parseInt(t.total_views as any)));
                                const heightPercentage = Math.max(10, (parseInt(day.total_views as any) / (maxViews || 1)) * 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                                        <div
                                            className="w-full bg-[#0F172A] rounded-t-sm opacity-80 group-hover:opacity-100 group-hover:bg-[#FF9F1C] transition-all relative"
                                            style={{ height: `${heightPercentage}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 pointer-events-none shadow-lg">
                                                {day.total_views} views
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No traffic data available</div>
                        )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <span>{stats?.traffic?.[0]?.date}</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Quick Actions / Recents Column */}
                <div className="space-y-6">
                    {/* System Status */}
                    <HealthWidget />

                    {/* Recent Messages Widget */}
                    <div className="card-brutal p-0 overflow-hidden">
                        <div className="p-4 border-b-2 border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold font-display text-[#0F172A]">Recent Messages</h3>
                            <Link href="/dashboard/messages" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                View All <ArrowUpRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {stats?.recents?.messages?.length ? (
                                stats.recents.messages.slice(0, 4).map((msg: any) => (
                                    <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-sm text-[#0F172A]">{msg.name}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${msg.status === 'new' ? 'bg-[#FF9F1C] text-[#0F172A]' : 'bg-gray-200 text-gray-500'}`}>
                                                {msg.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">{msg.subject}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-sm">No new messages</div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="card-brutal p-5 bg-[#0F172A] text-white border-none">
                        <h3 className="font-bold font-display text-lg mb-2 text-[#FF9F1C]">Quick Access</h3>
                        <p className="text-sm text-gray-400 mb-4">Jump straight to your most used tools.</p>
                        <div className="flex flex-col gap-2">
                            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                                <span className="text-[#FF9F1C]">⚙️</span> Settings
                            </Link>
                            <Link href="https://luminor.solutions" target="_blank" className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                                <span className="text-[#FF9F1C]">🌐</span> View Live Site <ExternalLink size={12} className="ml-auto opacity-50" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

