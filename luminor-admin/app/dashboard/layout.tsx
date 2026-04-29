"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Home, PieChart, MessageSquare, Briefcase, FileText, Search, Mail, Settings, Menu, X, ChevronRight, Star, HelpCircle, Activity, MessageCircle, Users, Tag, Image } from "lucide-react";
import { Toaster, toast } from "sonner";

function playNotificationSound(type: "chat" | "message") {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = type === "chat" ? [880, 1100] : [660, 880];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.value = freq;
            const t = ctx.currentTime + i * 0.18;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);
        });
    } catch { /* ignore */ }
}

// NOTE: We're using standard Lucide React icons for the sidebar
// This requires installation: npm install lucide-react (Already done in package.json)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [chatUnread, setChatUnread] = useState(0);
    const [messagesUnread, setMessagesUnread] = useState(0);
    const notifSocketRef = useRef<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (!userData || userData === "undefined") {
            router.push("/login");
            return;
        }

        try {
            setUser(JSON.parse(userData));
            setLoading(false);
        } catch (error) {
            router.push("/login");
        }
    }, [router]);

    // Global notification socket — active on all dashboard pages
    useEffect(() => {
        if (!user) return;

        let socket: any = null;

        const connect = async () => {
            try {
                const { io } = await import("socket.io-client");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                socket = io(`${apiUrl}/admin`, { transports: ["websocket", "polling"] });
                notifSocketRef.current = socket;

                socket.on("session:new", (data: any) => {
                    playNotificationSound("chat");
                    setChatUnread((n) => n + 1);
                    toast(`New chat from ${data.visitor_name}`, {
                        description: data.page_url || "Website visitor",
                        action: { label: "Open", onClick: () => router.push("/dashboard/chat") },
                    });
                });

                socket.on("contact:new", (data: any) => {
                    playNotificationSound("message");
                    setMessagesUnread((n) => n + 1);
                    toast(`New message from ${data.name}`, {
                        description: data.subject,
                        action: { label: "View", onClick: () => router.push("/dashboard/messages") },
                    });
                });
            } catch {
                /* socket unavailable, ignore */
            }
        };

        connect();

        return () => {
            if (socket) socket.disconnect();
            notifSocketRef.current = null;
        };
    }, [user, router]);

    // Clear badge when admin navigates to that page
    useEffect(() => {
        if (pathname.startsWith("/dashboard/chat")) setChatUnread(0);
        if (pathname.startsWith("/dashboard/messages")) setMessagesUnread(0);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            // SECURITY: Call backend to clear httpOnly cookies
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include' // Send cookies
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear user data from localStorage
            localStorage.removeItem("user");
            router.push("/login");
        }
    };

    if (loading) return null;

    // Navigation Structure
    const navSections = [
        {
            title: "Main",
            items: [
                { name: "Dashboard", href: "/dashboard", icon: Home },
                { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
            ]
        },
        {
            title: "Content",
            items: [
                { name: "Blog Posts", href: "/dashboard/blog", icon: FileText },
                { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
                { name: "Pricing Plans", href: "/dashboard/pricing", icon: Tag },
                { name: "Team", href: "/dashboard/team", icon: Users },
                { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
                { name: "Client Logos", href: "/dashboard/client-logos", icon: Star },
                { name: "SEO Tools", href: "/dashboard/seo", icon: Search },
            ]
        },
        {
            title: "Communication",
            items: [
                { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
                { name: "Live Chat", href: "/dashboard/chat", icon: MessageCircle },
                { name: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
            ]
        },
        {
            title: "Tools",
            items: [
                { name: "Client Portal", href: "/dashboard/clients", icon: Users },
                { name: "Media Library", href: "/dashboard/media", icon: Image },
                { name: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
                { name: "Status Page", href: "/dashboard/status", icon: Activity },
            ]
        },
        {
            title: "System",
            items: [
                { name: "Settings", href: "/dashboard/settings", icon: Settings },
            ]
        }
    ];

    const getCurrentPageName = () => {
        // Flatten nav items to find match
        const allItems = navSections.flatMap(s => s.items);
        const current = allItems.find(item =>
            item.href === pathname ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
        );
        return current?.name || "Dashboard";
    };

    return (
        <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

            {/* MOBILE SIDEBAR BACKDROP */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR NAVIGATION - FIXED LEFT */}
            <aside className={`
                fixed md:relative z-50 h-full w-[280px] bg-[#0F172A] text-white
                flex flex-col border-r-2 border-[#1E293B] shadow-2xl transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* 1. Brand Logo */}
                <div className="h-[70px] flex items-center px-6 border-b border-[#1E293B] bg-[#0F172A]/50 backdrop-blur-sm">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded bg-[#FF9F1C] flex items-center justify-center text-[#0F172A] font-bold font-display text-xl transition-transform group-hover:rotate-12">
                            L
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-[#FF9F1C] transition-colors">
                            Luminor<span className="text-[#FF9F1C]">.</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto md:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* 2. Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                    {navSections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-display">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`
                                                group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                                ${isActive
                                                    ? 'bg-[#FF9F1C] text-[#0F172A] shadow-[4px_4px_0px_#000]'
                                                    : 'text-gray-300 hover:bg-[#1E293B] hover:text-white hover:translate-x-1'
                                                }
                                            `}
                                        >
                                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                            <span>{item.name}</span>
                                            {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
                                            {!isActive && item.href === "/dashboard/chat" && chatUnread > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                                                    {chatUnread > 9 ? "9+" : chatUnread}
                                                </span>
                                            )}
                                            {!isActive && item.href === "/dashboard/messages" && messagesUnread > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                                                    {messagesUnread > 9 ? "9+" : messagesUnread}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. User Profile Footer */}
                <div className="p-4 border-t border-[#1E293B] bg-[#020617]">
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[#1E293B]/50 border border-[#1E293B]">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-[#FF9F1C] to-[#F59E0B] flex items-center justify-center text-[#0F172A] font-bold text-lg shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 rounded-lg transition-colors border border-[#EF4444]/20"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* TOP HEADER */}
                <header className="h-[70px] bg-white/80 backdrop-blur-md border-b-2 border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Luminor Admin</p>
                            <h1 className="text-xl font-bold font-display text-[#0F172A] leading-none">{getCurrentPageName()}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3002"}
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide bg-white border border-gray-200 rounded-full hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors shadow-sm"
                        >
                            View Live Site ↗
                        </Link>
                    </div>
                </header>

                {/* SCROLLABLE PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
                    <div className="max-w-[1600px] mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
        </>
    );
}
