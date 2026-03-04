"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface TeamMember {
    id: number;
    name: string;
    role_en: string;
    role_bs: string;
    photo_url: string | null;
    linkedin_url: string | null;
    is_active: boolean;
    order_num: number;
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            const res = await apiClient.get('/api/team/all');
            if (res.success) setMembers(res.data);
        } catch { toast.error('Failed to load team'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this team member?')) return;
        try {
            await apiClient.delete(`/api/team/${id}`);
            setMembers(members.filter(m => m.id !== id));
            toast.success('Member deleted');
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Team</h1>
                    <p className="text-gray-500 font-medium">{members.length} members</p>
                </div>
                <Link href="/dashboard/team/create" className="btn btn-primary">
                    <Plus size={18} /> Add Member
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m) => (
                    <div key={m.id} className="card-bento flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0F172A] flex items-center justify-center text-white text-xl font-bold font-display flex-shrink-0 overflow-hidden border-2 border-[#0F172A]">
                            {m.photo_url ? (
                                <Image src={m.photo_url} alt={m.name} width={56} height={56} className="object-cover w-full h-full" />
                            ) : (
                                m.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-[#0F172A] truncate">{m.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{m.role_en}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {m.is_active ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Link href={`/dashboard/team/edit/${m.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Pencil size={14} className="text-gray-500" />
                                </Link>
                                <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {members.length === 0 && (
                <div className="card-bento py-16 text-center text-gray-400">
                    <p className="text-lg font-bold">No team members yet</p>
                    <p className="text-sm mt-1">Add your first team member</p>
                </div>
            )}
        </div>
    );
}
