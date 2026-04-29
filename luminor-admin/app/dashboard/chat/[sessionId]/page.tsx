"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

interface Message {
    id: number;
    session_id: number;
    content: string;
    sender_type: "visitor" | "agent";
    sender_name: string;
    createdAt: string;
}

interface Session {
    id: number;
    visitor_name: string;
    visitor_email: string | null;
    page_url: string | null;
    status: string;
    createdAt: string;
}

interface SocketClient {
    on: (event: string, cb: (...args: any[]) => void) => void;
    off: (event: string, cb: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
    disconnect: () => void;
    connected: boolean;
}

export default function ChatSessionPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [visitorTyping, setVisitorTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<SocketClient | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const agentName = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}").name || "Agent"
        : "Agent";

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, visitorTyping, scrollToBottom]);

    // Load session and messages via REST
    useEffect(() => {
        const load = async () => {
            try {
                const response = await apiClient.get(`/api/chat/sessions/${sessionId}/messages`);
                if (response.success) {
                    setSession(response.session);
                    // Merge with any socket messages already received to avoid race condition
                    setMessages((prev) => {
                        const merged: Message[] = [...response.data];
                        const ids = new Set(merged.map((m) => m.id));
                        prev.forEach((m) => { if (!ids.has(m.id)) merged.push(m); });
                        return merged.sort((a, b) =>
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        );
                    });
                }
            } catch (err) {
                console.error("Failed to load session", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [sessionId]);

    // Connect to socket.io admin namespace
    useEffect(() => {
        const initSocket = async () => {
            try {
                const { io } = await import("socket.io-client");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const socket = io(`${apiUrl}/admin`, {
                    transports: ["websocket", "polling"],
                }) as unknown as SocketClient;

                socketRef.current = socket;

                socket.on("connect" as any, () => {
                    setConnected(true);
                    // Join this specific session room
                    socket.emit("admin:join_session", parseInt(sessionId));
                });

                socket.on("disconnect" as any, () => {
                    setConnected(false);
                });

                socket.on("message:new", (msg: Message) => {
                    if (String(msg.session_id) === sessionId) {
                        setMessages((prev) => {
                            if (prev.some((m) => m.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }
                });

                socket.on("visitor:typing", ({ isTyping, sessionId: sid }: { isTyping: boolean; sessionId: number }) => {
                    if (String(sid) === sessionId) {
                        setVisitorTyping(isTyping);
                    }
                });

                socket.on("session:closed", ({ sessionId: sid }: { sessionId: number }) => {
                    if (String(sid) === sessionId) {
                        setSession((prev) => prev ? { ...prev, status: "closed" } : prev);
                    }
                });

                socket.on("visitor:disconnected", ({ sessionId: sid }: { sessionId: number }) => {
                    if (String(sid) === sessionId) {
                        // Visitor lost connection but session stays open — just show status
                        setVisitorTyping(false);
                    }
                });

                return socket;
            } catch {
                console.warn("Socket.io not available");
                return null;
            }
        };

        const socketPromise = initSocket();

        return () => {
            socketPromise.then((socket) => {
                if (socket) socket.disconnect();
            });
        };
    }, [sessionId]);

    const handleSend = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || !socketRef.current) return;

            socketRef.current.emit("agent:message", {
                sessionId: parseInt(sessionId),
                content: input.trim(),
                agentName,
            });
            setInput("");
        },
        [input, sessionId, agentName]
    );

    const handleTyping = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit("agent:typing", { sessionId: parseInt(sessionId), isTyping: true, agentName });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("agent:typing", { sessionId: parseInt(sessionId), isTyping: false, agentName });
        }, 1500);
    }, [sessionId, agentName]);

    const handleCloseSession = async () => {
        if (!confirm("Close this chat session?")) return;
        try {
            await apiClient.put(`/api/chat/sessions/${sessionId}/close`);
            socketRef.current?.emit("session:close", parseInt(sessionId));
            setSession((prev) => prev ? { ...prev, status: "closed" } : prev);
        } catch (err) {
            console.error("Error closing session", err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
    }

    if (!session) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Session not found.</p>
                <Link href="/dashboard/chat" className="btn btn-secondary mt-4">← Back to Inbox</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-up h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/chat" className="text-gray-400 hover:text-[#0F172A] transition-colors">
                        ←
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold">
                        {session.visitor_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-[#0F172A]">{session.visitor_name}</div>
                        {session.visitor_email && <div className="text-xs text-gray-400">{session.visitor_email}</div>}
                        {session.page_url && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">{session.page_url}</div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${
                        session.status === "active" ? "bg-green-100 text-green-700 border-green-200" :
                        session.status === "waiting" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                        "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`} />
                        {session.status}
                    </span>
                    {session.status !== "closed" && (
                        <button onClick={handleCloseSession} className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 border border-red-200 rounded-lg transition-colors">
                            End Chat
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ height: "clamp(320px, calc(100vh - 280px), 600px)" }}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender_type === "agent" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] ${msg.sender_type === "agent" ? "" : ""}`}>
                                <div className="text-xs text-gray-400 mb-1 font-medium">
                                    {msg.sender_name}
                                    {" · "}
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                                    msg.sender_type === "agent"
                                        ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-br-sm"
                                        : "bg-gray-100 text-[#0F172A] rounded-bl-sm"
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {visitorTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-gray-400 italic">
                                {session.visitor_name} is typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {session.status !== "closed" ? (
                    <form onSubmit={handleSend} className="border-t border-gray-100 p-4 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                            placeholder="Type a message..."
                            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366f1]"
                            disabled={!connected}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || !connected}
                            className="px-6 py-2.5 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-xl text-sm font-bold disabled:opacity-40 transition-opacity"
                        >
                            Send
                        </button>
                    </form>
                ) : (
                    <div className="border-t border-gray-100 p-4 text-center text-sm text-gray-400">
                        This chat session has ended.
                    </div>
                )}
            </div>

            {!connected && session.status !== "closed" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                    ⚠️ Real-time connection unavailable. Install socket.io for live chat.
                    Messages will still be saved via REST API.
                </div>
            )}
        </div>
    );
}
