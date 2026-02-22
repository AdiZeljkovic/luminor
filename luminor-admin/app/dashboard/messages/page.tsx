"use client";

import { apiClient } from "@/lib/apiClient";

import { useEffect, useState } from "react";
import { Search, Filter, Trash2, Mail, CheckCircle, Clock, Archive } from "lucide-react";

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    notes?: string;
    created_at: string;
}

const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'proposal_sent', label: 'Proposal Sent', color: 'bg-purple-100 text-purple-800' },
    { value: 'closed_won', label: 'Closed (Won)', color: 'bg-green-100 text-green-800' },
    { value: 'closed_lost', label: 'Closed (Lost)', color: 'bg-red-100 text-red-800' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
];

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await apiClient.get('/api/contact');
            if (response.success) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number, updates: any) => {
        try {
            await apiClient.put(`/api/contact/${id}`, updates);

            setMessages(messages.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, ...updates });
            }
        } catch (error) {
            console.error("Error updating message", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this message?")) return;

        try {
            await apiClient.delete(`/api/contact/${id}`);

            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error("Error deleting message", error);
        }
    }

    const unreadCount = messages.filter(m => m.status === 'new').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-up">
            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Inbox</h1>
                    <p className="text-gray-500 font-medium">
                        {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn bg-white shadow-sm hover:shadow-md border border-gray-200">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            {/* Split View Container */}
            <div className="flex-1 flex gap-6 overflow-hidden">

                {/* Message List */}
                <div className="w-[400px] flex flex-col card-bento p-0 overflow-hidden">
                    <div className="p-4 border-b-2 border-[#0F172A] bg-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-bold focus:border-[#0F172A] outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (msg.status === 'new') handleUpdate(msg.id, { status: 'in_progress' });
                                }}
                                className={`
                                    p-5 cursor-pointer border-b border-gray-100 transition-all hover:bg-gray-50
                                    ${selectedMessage?.id === msg.id ? "bg-[#FFF9F0] border-l-4 border-l-[#FF9F1C]" : "border-l-4 border-l-transparent"}
                                    ${msg.status === 'new' ? "bg-blue-50/30" : ""}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold text-[#0F172A] ${msg.status === 'new' ? 'text-base' : ''}`}>
                                        {msg.name}
                                    </h3>
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                                        {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <p className={`text-sm mb-2 line-clamp-1 ${msg.status === 'new' ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                    {msg.subject}
                                </p>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                                        ${statusOptions.find(o => o.value === msg.status)?.color || 'bg-gray-200 text-gray-600'}
                                    `}>
                                        {statusOptions.find(o => o.value === msg.status)?.label || msg.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <div className="p-10 text-center text-gray-400">
                                <Mail size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No messages found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail View */}
                <div className="flex-1 card-bento p-0 overflow-hidden flex flex-col relative">
                    {selectedMessage ? (
                        <>
                            {/* Toolbar */}
                            <div className="px-8 py-5 border-b-2 border-[#0F172A] bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <select
                                        value={selectedMessage.status}
                                        onChange={(e) => handleUpdate(selectedMessage.id, { status: e.target.value })}
                                        className="bg-white border-2 border-gray-200 rounded-lg py-1.5 px-3 text-sm font-bold text-[#0F172A] outline-none focus:border-[#0F172A] transition-all min-w-[140px]"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="mb-8 pb-8 border-b border-gray-100">
                                    <h1 className="text-3xl font-bold font-display text-[#0F172A] mb-6">{selectedMessage.subject}</h1>

                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center text-2xl font-bold font-display shadow-[4px_4px_0px_#94A3B8]">
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0F172A] text-xl leading-tight mb-1">{selectedMessage.name}</p>
                                            <p className="text-gray-500 font-medium text-lg mb-1">{selectedMessage.email}</p>
                                            <div className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                                <Clock size={14} />
                                                {new Date(selectedMessage.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none text-[#334155] whitespace-pre-wrap leading-relaxed font-medium text-lg">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-gray-50 border-t-2 border-[#0F172A]">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Internal Notes</label>
                                    <textarea
                                        className="input-field min-h-[80px]"
                                        placeholder="Add private notes regarding this lead..."
                                        value={selectedMessage?.notes || ''}
                                        onChange={(e) => setSelectedMessage({ ...selectedMessage, notes: e.target.value })}
                                        onBlur={(e) => handleUpdate(selectedMessage.id, { notes: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="btn btn-primary"
                                    >
                                        <Mail size={16} /> Reply via Email
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Mail size={48} className="opacity-20 text-[#0F172A]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-1">Select a message</h3>
                            <p className="text-sm font-medium">Choose a message from the list to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

