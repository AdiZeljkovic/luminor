"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditTeamMemberPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState<'en' | 'bs'>('en');
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        apiClient.get('/api/team/all').then(res => {
            if (res.success) {
                const m = res.data.find((x: any) => x.id === parseInt(id as string));
                if (m) setForm(m);
            }
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading || !form) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

    const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

    const handleSave = async () => {
        if (!form.name) { toast.error('Name is required'); return; }
        setSaving(true);
        try {
            await apiClient.put(`/api/team/${id}`, form);
            toast.success('Member updated!');
            router.push('/dashboard/team');
        } catch { toast.error('Failed to save'); }
        finally { setSaving(false); }
    };

    return (
        <div className="max-w-2xl animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/team" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
                <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit: {form.name}</h1>
            </div>

            <div className="card-bento space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name *</label>
                    <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>

                <div>
                    <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
                        {(['en', 'bs'] as const).map(l => (
                            <button key={l} onClick={() => setTab(l)} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${tab === l ? 'bg-white shadow text-[#0F172A]' : 'text-gray-500'}`}>
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    {tab === 'en' ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role (EN)</label>
                                <input className="input-field" value={form.role_en || ''} onChange={e => set('role_en', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bio (EN)</label>
                                <textarea className="input-field" rows={4} value={form.bio_en || ''} onChange={e => set('bio_en', e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pozicija (BS)</label>
                                <input className="input-field" value={form.role_bs || ''} onChange={e => set('role_bs', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Biografija (BS)</label>
                                <textarea className="input-field" rows={4} value={form.bio_bs || ''} onChange={e => set('bio_bs', e.target.value)} />
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Photo URL</label>
                    <input className="input-field" value={form.photo_url || ''} onChange={e => set('photo_url', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">LinkedIn URL</label>
                    <input className="input-field" value={form.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order</label>
                        <input className="input-field" type="number" value={form.order_num} onChange={e => set('order_num', parseInt(e.target.value) || 0)} />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-5 h-5 rounded" />
                        <span className="font-bold text-sm">Visible on site</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Link href="/dashboard/team" className="btn bg-white border border-gray-200">Cancel</Link>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
}
