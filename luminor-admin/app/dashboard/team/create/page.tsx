"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function CreateTeamMemberPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState<'en' | 'bs'>('en');
    const [form, setForm] = useState({
        name: '',
        role_en: '',
        role_bs: '',
        bio_en: '',
        bio_bs: '',
        photo_url: '',
        linkedin_url: '',
        order_num: 0,
        is_active: true,
    });

    const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

    const handleSave = async () => {
        if (!form.name) { toast.error('Name is required'); return; }
        setSaving(true);
        try {
            await apiClient.post('/api/team', form);
            toast.success('Member added!');
            router.push('/dashboard/team');
        } catch { toast.error('Failed to save'); }
        finally { setSaving(false); }
    };

    return (
        <div className="max-w-2xl animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/team" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
                <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Add Team Member</h1>
            </div>

            <div className="card-bento space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name *</label>
                    <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ana Kovačević" />
                </div>

                {/* Language tabs */}
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
                                <input className="input-field" value={form.role_en} onChange={e => set('role_en', e.target.value)} placeholder="Senior Developer" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bio (EN)</label>
                                <textarea className="input-field" rows={4} value={form.bio_en} onChange={e => set('bio_en', e.target.value)} placeholder="Short bio..." />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pozicija (BS)</label>
                                <input className="input-field" value={form.role_bs} onChange={e => set('role_bs', e.target.value)} placeholder="Senior Developer" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Biografija (BS)</label>
                                <textarea className="input-field" rows={4} value={form.bio_bs} onChange={e => set('bio_bs', e.target.value)} placeholder="Kratka biografija..." />
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Photo URL</label>
                    <input className="input-field" value={form.photo_url} onChange={e => set('photo_url', e.target.value)} placeholder="https://..." />
                    <p className="text-xs text-gray-400 mt-1">Upload image in Media Library first, then paste URL</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">LinkedIn URL</label>
                    <input className="input-field" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
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
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Add Member'}</button>
                </div>
            </div>
        </div>
    );
}
