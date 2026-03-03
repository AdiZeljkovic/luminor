"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

interface ChatSession {
    id: number;
    visitor_name: string;
    visitor_email: string | null;
    page_url: string | null;
    status: "active" | "closed" | "waiting";
    unread_count: number;
    createdAt: string;
    updatedAt: string;
    messages?: Array<{ content: string; sender_type: string; createdAt: string }>;
}

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700 border-green-200",
    waiting: "bg-yellow-100 text-yellow-700 border-yellow-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ChatInboxPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("active,waiting");

    const fetchSessions = useCallback(async () => {
        try {
            const params = filter ? `?status=${filter}` : "";
            const response = await apiClient.get(`/api/chat/sessions${params}`);
            if (response.success) {
                setSessions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchSessions();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchSessions, 10000);
        return () => clearInterval(interval);
    }, [fetchSessions]);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this chat session?")) return;
        try {
            await apiClient.delete(`/api/chat/sessions/${id}`);
            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting session", err);
        }
    };

    const totalUnread = sessions.reduce((sum, s) => sum + (s.unread_count || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-up max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Live Chat Inbox</h1>
                        {totalUnread > 0 && (
                            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                {totalUnread} unread
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 font-medium mt-1">Real-time chat sessions with website visitors.</p>
                </div>
                <div className="flex gap-2">
                    {[
                        { label: "Active / Waiting", value: "active,waiting" },
                        { label: "All", value: "" },
                        { label: "Closed", value: "closed" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg border-2 transition-colors ${
                                filter === opt.value
                                    ? "bg-[#0F172A] text-white border-[#0F172A]"
                                    : "bg-white text-[#0F172A] border-gray-200 hover:border-[#0F172A]"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sessions List */}
            {sessions.length === 0 ? (
                <div className="card-bento text-center py-20">
                    <div className="text-6xl mb-6 opacity-20">💬</div>
                    <h3 className="text-xl font-bold text-[#0F172A]">No active chat sessions</h3>
                    <p className="text-gray-500 font-medium">Visitors will appear here when they start a chat.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-[#FF9F1C] transition-colors shadow-sm group"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {session.visitor_name.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-[#0F172A] truncate">{session.visitor_name}</span>
                                        {session.unread_count > 0 && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full flex-shrink-0">
                                                {session.unread_count} new
                                            </span>
                                        )}
                                    </div>
                                    {session.visitor_email && (
                                        <div className="text-xs text-gray-400 mb-1">{session.visitor_email}</div>
                                    )}
                                    {session.messages?.[0] && (
                                        <div className="text-sm text-gray-500 truncate">
                                            <span className="text-gray-400">{session.messages[0].sender_type === "visitor" ? "Visitor: " : "Agent: "}</span>
                                            {session.messages[0].content}
                                        </div>
                                    )}
                                </div>

                                {/* Status + Time */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${STATUS_COLORS[session.status]}`}>
                                        {session.status === "waiting" ? "⏳ Waiting" : session.status === "active" ? "● Active" : "Closed"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(session.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                                <Link
                                    href={`/dashboard/chat/${session.id}`}
                                    className="px-4 py-2 text-sm font-bold bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors"
                                >
                                    {session.status === "closed" ? "View" : "Reply"}
                                </Link>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium">
                    <strong>Live Chat</strong> requires socket.io to be installed.
                    Run <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">npm install socket.io</code> in the backend
                    and <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">npm install socket.io-client</code> in frontend & admin.
                    Sessions refresh every 10 seconds automatically.
                </p>
            </div>
        </div>
    );
}
