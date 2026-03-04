"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Clock, Globe, ArrowUpRight, BarChart2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface AnalyticsStats {
    counts: {
        visits: number;
        unique_visitors: number;
    };
    traffic: {
        date: string;
        total_views: number;
        total_unique: number;
    }[];
    topPages: {
        page: string;
        total_views: number;
        total_unique: number;
    }[];
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/api/analytics/stats');
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="spinner"></div></div>;

    const totalViews = stats?.traffic?.reduce((acc, curr) => acc + (parseInt(curr.total_views as any) || 0), 0) || 0;
    const totalUnique = stats?.traffic?.reduce((acc, curr) => acc + (parseInt(curr.total_unique as any) || 0), 0) || 0;
    const maxViews = Math.max(...(stats?.traffic?.map(t => parseInt(t.total_views as any)) || [0]));

    return (
        <div className="space-y-8 pb-12 animate-fade-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold font-display text-[#0F172A] tracking-tight">Analytics <span className="text-gray-300">Hub</span></h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time frontend performance intelligence.</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm text-sm font-bold text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Data
                </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(160px,auto)]">

                {/* 1. Traffic Intelligence (Large Chart) */}
                <div className="col-span-1 md:col-span-2 md:row-span-2 card-bento p-8 bg-[#0F172A] text-white border-[#0F172A]">
                    <div className="flex justify-between items-start mb-8 z-10 relative">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-white mb-1">Traffic Intelligence</h2>
                            <p className="text-gray-400 text-sm">Last 30 Days Performance</p>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg text-[#FF9F1C]">
                            <BarChart2 size={24} />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-2 z-10 relative">
                        {stats?.traffic?.length ? (
                            stats.traffic.map((day, i) => {
                                const height = Math.max(10, (parseInt(day.total_views as any) / (maxViews || 1)) * 100);
                                return (
                                    <div key={i} className="flex-1 group relative">
                                        <div
                                            className="w-full bg-[#334155] rounded-t-sm group-hover:bg-[#FF9F1C] transition-all duration-300 relative overflow-hidden"
                                            style={{ height: `${height}%` }}
                                        >

                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#0F172A] text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 pointer-events-none shadow-lg transform translate-y-2 group-hover:translate-y-0">
                                            {day.total_views} Views<br />
                                            <span className="text-gray-400">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="w-full text-center text-gray-500">No Data</div>
                        )}
                    </div>
                </div>

                {/* 2. Total Views Card */}
                <div className="card-bento p-6 justify-between group hover:border-[#FF9F1C] transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                        </span>
                    </div>
                    <div className="z-10 relative">
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Total Page Views</p>
                        <h3 className="text-4xl font-extrabold font-display text-[#0F172A]">{totalViews.toLocaleString()}</h3>
                    </div>
                </div>

                {/* 3. Unique Visitors Card */}
                <div className="card-bento p-6 justify-between group hover:border-[#FF9F1C] transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Globe size={24} />
                        </div>
                    </div>
                    <div className="z-10 relative">
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Unique Visitors</p>
                        <h3 className="text-4xl font-extrabold font-display text-[#0F172A]">{totalUnique.toLocaleString()}</h3>
                    </div>
                </div>

                {/* 4. Engagement (Avg Views) */}
                <div className="card-bento p-6 justify-between group hover:border-[#FF9F1C] transition-colors">
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="z-10 relative">
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Avg. Views/User</p>
                        <h3 className="text-4xl font-extrabold font-display text-[#0F172A]">
                            {totalUnique > 0 ? (totalViews / totalUnique).toFixed(1) : "0"}
                        </h3>
                    </div>
                </div>

                {/* 5. Placeholder for specialized metric */}
                <div className="card-bento p-6 justify-center items-center text-center group hover:bg-gray-50">
                    <div className="z-10 relative">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Bounce Rate (Est)</p>
                        <h3 className="text-3xl font-extrabold font-display text-gray-300">--</h3>
                        <p className="text-[10px] text-gray-400 mt-1">Coming Soon</p>
                    </div>
                </div>

                {/* 6. Content Leaderboard (Spans 2 cols) */}
                <div className="col-span-1 md:col-span-2 row-span-2 card-bento p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center z-10 relative">
                        <div>
                            <h3 className="text-lg font-bold font-display text-[#0F172A]">Content Leaderboard</h3>
                            <p className="text-xs text-gray-500 font-medium">Top performing pages by unique views.</p>
                        </div>
                        <button className="text-xs font-bold text-[#0F172A] border border-gray-300 px-3 py-1 rounded hover:bg-[#0F172A] hover:text-white transition-colors">
                            View Full Report
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-[300px] z-10 relative no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white sticky top-0 z-20 shadow-sm">
                                <tr>
                                    <th className="py-3 px-6 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Page</th>
                                    <th className="py-3 px-6 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right">Visits</th>
                                    <th className="py-3 px-6 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right w-24">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.topPages?.length ? (
                                    stats.topPages.map((page, i) => {
                                        const percentage = Math.min(100, (parseInt(page.total_views as any) / (maxViews || 1)) * 100);
                                        return (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="py-3 px-6 font-bold text-[#0F172A] text-sm flex items-center gap-3">
                                                    <span className="text-gray-300 font-mono text-xs w-4">0{i + 1}</span>
                                                    <span className="truncate max-w-[150px] group-hover:text-blue-600 transition-colors" title={page.page}>{page.page}</span>
                                                </td>
                                                <td className="py-3 px-6 text-right relative">
                                                    <span className="font-bold text-[#0F172A] text-sm relative z-10">{page.total_views}</span>
                                                    {/* Background progress bar */}
                                                    <div
                                                        className="absolute top-1/2 -translate-y-1/2 right-6 h-6 bg-blue-100 rounded-sm z-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        style={{ width: `${percentage}%`, maxWidth: '60px' }}
                                                    ></div>
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex justify-end">
                                                        <ArrowUpRight size={14} className="text-green-500" />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr><td colSpan={3} className="text-center py-8 text-gray-400">No data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
