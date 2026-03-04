"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

const CATEGORIES = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'seo', label: 'SEO' },
    { value: 'hosting', label: 'Hosting' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'ai-automation', label: 'AI Automation' },
    { value: 'general', label: 'General' },
];

export default function EditPricingPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        apiClient.get('/api/pricing/all').then(res => {
            if (res.success) {
                const plan = res.data.find((p: any) => p.id === parseInt(id as string));
                if (plan) {
                    setForm({ ...plan, features: plan.features?.length ? plan.features : [''], price: String(plan.price) });
                }
            }
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading || !form) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

    const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));
    const updateFeature = (i: number, val: string) => { const arr = [...form.features]; arr[i] = val; set('features', arr); };
    const addFeature = () => set('features', [...form.features, '']);
    const removeFeature = (i: number) => set('features', form.features.filter((_: any, idx: number) => idx !== i));

    const handleSave = async () => {
        if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
        setSaving(true);
        try {
            await apiClient.put(`/api/pricing/${id}`, { ...form, price: parseFloat(form.price), features: form.features.filter((f: string) => f.trim()) });
            toast.success('Plan updated!');
            router.push('/dashboard/pricing');
        } catch { toast.error('Failed to save'); }
        finally { setSaving(false); }
    };

    return (
        <div className="max-w-2xl animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/pricing" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
                <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Edit Plan: {form.name}</h1>
            </div>

            <div className="card-bento space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Plan Name *</label>
                        <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                        <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price *</label>
                        <input className="input-field" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Currency</label>
                        <input className="input-field" value={form.currency} onChange={e => set('currency', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Billing Cycle</label>
                        <input className="input-field" value={form.billing_cycle} onChange={e => set('billing_cycle', e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (EN)</label>
                    <textarea className="input-field" rows={2} value={form.description_en || ''} onChange={e => set('description_en', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (BS)</label>
                    <textarea className="input-field" rows={2} value={form.description_bs || ''} onChange={e => set('description_bs', e.target.value)} />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Features</label>
                        <button onClick={addFeature} className="text-xs font-bold text-[#FF9F1C] hover:underline flex items-center gap-1"><Plus size={14} /> Add</button>
                    </div>
                    <div className="space-y-2">
                        {form.features.map((f: string, i: number) => (
                            <div key={i} className="flex gap-2">
                                <input className="input-field flex-1" value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                                {form.features.length > 1 && <button onClick={() => removeFeature(i)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={16} /></button>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">CTA Text</label>
                        <input className="input-field" value={form.cta_text || ''} onChange={e => set('cta_text', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">CTA URL</label>
                        <input className="input-field" value={form.cta_url || ''} onChange={e => set('cta_url', e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Order</label>
                        <input className="input-field" type="number" value={form.order_num} onChange={e => set('order_num', parseInt(e.target.value) || 0)} />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.is_recommended} onChange={e => set('is_recommended', e.target.checked)} className="w-5 h-5 rounded" />
                        <span className="font-bold text-sm">Recommended</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-5 h-5 rounded" />
                        <span className="font-bold text-sm">Active</span>
                    </label>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Link href="/dashboard/pricing" className="btn bg-white border border-gray-200">Cancel</Link>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
}
