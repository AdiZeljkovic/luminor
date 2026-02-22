"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
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
                const response = await apiClient.get('/api/analytics/stats');
                if (response.success) {
                    setStats(response);
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
                <div className="lg:col-span-2 card-bento p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold font-display text-[#0F172A]">Traffic Overview</h2>
                            <p className="text-sm text-gray-400 font-medium">Unique visitors vs total page views</p>
                        </div>
                        <select className="bg-white border-2 border-gray-200 rounded-lg text-sm px-4 py-2 font-bold text-gray-600 outline-none focus:border-[#0F172A] focus:shadow-[4px_4px_0px_#0F172A] transition-all cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end gap-3 pt-4 border-b border-gray-100">
                        {stats?.traffic?.length ? (
                            stats.traffic.map((day, i) => {
                                const maxViews = Math.max(...stats.traffic.map(t => parseInt(t.total_views as any)));
                                const heightPercentage = Math.max(10, (parseInt(day.total_views as any) / (maxViews || 1)) * 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                                        <div
                                            className="w-full bg-[#E2E8F0] rounded-t-sm group-hover:bg-[#FF9F1C] transition-all relative"
                                            style={{ height: `${heightPercentage}%` }}
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 pointer-events-none shadow-xl transform translate-y-2 group-hover:translate-y-0">
                                                {day.total_views} views
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0F172A]"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-medium animate-pulse">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-4"></div>
                                <div className="h-4 bg-gray-100 w-32 rounded mb-2"></div>
                                <div className="h-3 bg-gray-100 w-24 rounded"></div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>{stats?.traffic?.[0]?.date || 'Start Date'}</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Quick Actions / Recents Column */}
                <div className="space-y-6">
                    {/* System Status */}
                    <HealthWidget />

                    {/* Recent Messages Widget */}
                    <div className="card-bento p-0 overflow-hidden">
                        <div className="p-5 border-b-2 border-[#0F172A] bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold font-display text-[#0F172A] flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-500" /> Recent Messages
                            </h3>
                            <Link href="/dashboard/messages" className="text-xs font-bold text-[#0F172A] hover:text-[#FF9F1C] flex items-center gap-1 transition-colors uppercase tracking-wide">
                                View All <ArrowUpRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {stats?.recents?.messages?.length ? (
                                stats.recents.messages.slice(0, 4).map((msg: any) => (
                                    <div key={msg.id} className="p-4 hover:bg-[#FFF9F0] transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-sm text-[#0F172A] group-hover:text-blue-600 transition-colors">{msg.name}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${msg.status === 'new'
                                                ? 'bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/20'
                                                : 'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}>
                                                {msg.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-700">{msg.subject}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                                    <MessageSquare size={32} className="mb-2 opacity-20" />
                                    No new messages
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="card-bento p-6 bg-[#0F172A] text-white border-[#0F172A]">
                        <h3 className="font-bold font-display text-lg mb-2 text-[#FF9F1C] flex items-center gap-2">
                            <Layers size={20} /> Quick Access
                        </h3>
                        <p className="text-sm text-gray-400 mb-5 leading-relaxed">Jump straight to your most used tools to speed up your workflow.</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:translate-x-1 text-sm font-bold">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-[#FF9F1C] text-[#0F172A] text-xs">⚙️</span>
                                Settings
                            </Link>
                            <Link href="https://luminor.solutions" target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:translate-x-1 text-sm font-bold">
                                <span className="w-6 h-6 rounded flex items-center justify-center bg-blue-500 text-white text-xs">🌐</span>
                                View Live Site <ExternalLink size={12} className="ml-auto opacity-50" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

