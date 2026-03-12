"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import styles from "./ChatWidget.module.css";
import { API_URL } from "@/lib/api";

interface Message {
    id: number;
    content: string;
    sender_type: "visitor" | "agent";
    sender_name: string;
    createdAt: string;
}

interface SocketClient {
    on: (event: string, cb: (...args: any[]) => void) => void;
    off: (event: string, cb: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
    disconnect: () => void;
    connected: boolean;
}

type Status = "idle" | "connecting" | "waiting" | "active" | "ended" | "error";

export default function ChatWidget() {
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [agentTyping, setAgentTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const socketRef = useRef<SocketClient | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const t = {
        title: locale === "bs" ? "Podrška" : "Support Chat",
        subtitle: locale === "bs" ? "Obično odgovaramo za par minuta" : "We typically reply in a few minutes",
        placeholder: locale === "bs" ? "Vaša poruka..." : "Your message...",
        namePlaceholder: locale === "bs" ? "Vaše ime" : "Your name",
        emailPlaceholder: locale === "bs" ? "Email (opciono)" : "Email (optional)",
        start: locale === "bs" ? "Započni Chat" : "Start Chat",
        send: locale === "bs" ? "Pošalji" : "Send",
        waiting: locale === "bs" ? "Čekamo dostupnog agenta..." : "Waiting for an agent...",
        ended: locale === "bs" ? "Chat završen." : "Chat ended.",
        connected: locale === "bs" ? "Ste spojeni sa agentom!" : "Connected to an agent!",
        typing: locale === "bs" ? "Kuca..." : "typing...",
    };

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, agentTyping, scrollToBottom]);

    // Open clears unread
    useEffect(() => {
        if (open) setUnread(0);
    }, [open]);

    const initSocket = useCallback(async () => {
        try {
            const { io } = await import("socket.io-client");
            const socket = io(API_URL, {
                transports: ["websocket", "polling"],
            }) as unknown as SocketClient;

            socketRef.current = socket;

            socket.on("session:created", ({ message }: { message: string }) => {
                setStatus("waiting");
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        content: message,
                        sender_type: "agent",
                        sender_name: "System",
                        createdAt: new Date().toISOString(),
                    },
                ]);
            });

            socket.on("message:new", (msg: Message) => {
                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                if (msg.sender_type === "agent") {
                    setStatus("active");
                    if (!open) setUnread((n) => n + 1);
                }
            });

            socket.on("agent:typing", ({ isTyping }: { isTyping: boolean }) => {
                setAgentTyping(isTyping);
            });

            socket.on("session:ended", ({ message }: { message: string }) => {
                setStatus("ended");
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        content: message,
                        sender_type: "agent",
                        sender_name: "System",
                        createdAt: new Date().toISOString(),
                    },
                ]);
            });

            return socket;
        } catch {
            setStatus("error");
            return null;
        }
    }, [open]);

    const handleStart = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!name.trim()) return;

            setStatus("connecting");
            const socket = await initSocket();
            if (!socket) return;

            // Wait for connection then emit join
            const tryJoin = () => {
                if (socket.connected) {
                    socket.emit("visitor:join", {
                        name: name.trim(),
                        email: email.trim() || null,
                        pageUrl: window.location.href,
                    });
                } else {
                    setTimeout(tryJoin, 100);
                }
            };
            setTimeout(tryJoin, 200);
        },
        [name, email, initSocket]
    );

    const handleSend = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || !socketRef.current || status === "ended") return;

            socketRef.current.emit("visitor:message", { content: input.trim() });
            setInput("");
        },
        [input, status]
    );

    const handleTyping = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit("visitor:typing", { isTyping: true });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("visitor:typing", { isTyping: false });
        }, 1500);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <div className={styles.container}>
            {/* Chat Window */}
            {open && (
                <div className={styles.window}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerInfo}>
                            <div className={styles.avatar}>L</div>
                            <div>
                                <div className={styles.headerTitle}>{t.title}</div>
                                <div className={styles.headerStatus}>
                                    {status === "active" ? (
                                        <><span className={styles.onlineDot} />{t.connected}</>
                                    ) : status === "waiting" ? (
                                        <><span className={styles.waitingDot} />{t.waiting}</>
                                    ) : (
                                        t.subtitle
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close chat">×</button>
                    </div>

                    {/* Body */}
                    <div className={styles.body}>
                        {status === "idle" || status === "connecting" ? (
                            <form onSubmit={handleStart} className={styles.startForm}>
                                <p className={styles.startText}>
                                    {locale === "bs"
                                        ? "Unesite vaše ime da biste started chat"
                                        : "Enter your name to start chatting"}
                                </p>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t.namePlaceholder}
                                    className={styles.startInput}
                                    autoFocus
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.emailPlaceholder}
                                    className={styles.startInput}
                                />
                                <button
                                    type="submit"
                                    disabled={status === "connecting"}
                                    className={styles.startBtn}
                                >
                                    {status === "connecting" ? "..." : t.start}
                                </button>
                            </form>
                        ) : (
                            <>
                                <div className={styles.messages}>
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`${styles.message} ${msg.sender_type === "visitor" ? styles.visitor : styles.agent}`}
                                        >
                                            {msg.sender_type === "agent" && (
                                                <div className={styles.senderName}>{msg.sender_name}</div>
                                            )}
                                            <div className={styles.bubble}>{msg.content}</div>
                                            <div className={styles.time}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    ))}
                                    {agentTyping && (
                                        <div className={`${styles.message} ${styles.agent}`}>
                                            <div className={styles.typingBubble}>
                                                <span /><span /><span />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {status !== "ended" && (
                                    <form onSubmit={handleSend} className={styles.inputRow}>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                                            placeholder={t.placeholder}
                                            className={styles.input}
                                            autoFocus
                                        />
                                        <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                            </svg>
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                className={styles.fab}
                onClick={() => setOpen(!open)}
                aria-label="Open chat"
            >
                {open ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                ) : (
                    <>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span className={styles.fabLabel}>
                            {locale === "bs" ? "Podrška" : "Chat with us"}
                        </span>
                        <span className={styles.fabDot} />
                    </>
                )}
                {unread > 0 && !open && (
                    <span className={styles.badge}>{unread > 9 ? "9+" : unread}</span>
                )}
            </button>
        </div>
    );
}
