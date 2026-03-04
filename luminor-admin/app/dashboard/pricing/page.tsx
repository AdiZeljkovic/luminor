"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface PricingPlan {
    id: number;
    name: string;
    price: number;
    currency: string;
    billing_cycle: string;
    category: string;
    is_recommended: boolean;
    is_active: boolean;
    order_num: number;
}

const CATEGORIES: Record<string, string> = {
    'web-development': 'Web Dev',
    'seo': 'SEO',
    'hosting': 'Hosting',
    'digital-marketing': 'Marketing',
    'ai-automation': 'AI',
    'general': 'General',
};

export default function PricingPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        try {
            const res = await apiClient.get('/api/pricing/all');
            if (res.success) setPlans(res.data);
        } catch { toast.error('Failed to load plans'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this pricing plan?')) return;
        try {
            await apiClient.delete(`/api/pricing/${id}`);
            setPlans(plans.filter(p => p.id !== id));
            toast.success('Plan deleted');
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

    return (
        <div className="animate-fade-up">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Pricing Plans</h1>
                    <p className="text-gray-500 font-medium">{plans.length} total plans</p>
                </div>
                <Link href="/dashboard/pricing/create" className="btn btn-primary">
                    <Plus size={18} /> New Plan
                </Link>
            </div>

            <div className="card-bento p-0 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-[#0F172A] bg-gray-50">
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
                            <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                            <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
                            <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#0F172A]">{plan.name}</span>
                                        {plan.is_recommended && <Star size={14} className="text-[#FF9F1C]" fill="currentColor" />}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-xs px-2 py-1 bg-[#0F172A]/5 rounded-full font-bold text-[#0F172A]">
                                        {CATEGORIES[plan.category] || plan.category}
                                    </span>
                                </td>
                                <td className="px-4 py-4 font-bold text-[#0F172A]">
                                    {plan.currency} {Number(plan.price).toFixed(2)}
                                    <span className="text-xs text-gray-400 font-normal ml-1">{plan.billing_cycle}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link href={`/dashboard/pricing/edit/${plan.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Pencil size={16} className="text-gray-500" />
                                        </Link>
                                        <button onClick={() => handleDelete(plan.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {plans.length === 0 && (
                    <div className="py-16 text-center text-gray-400">
                        <p className="text-lg font-bold">No pricing plans yet</p>
                        <p className="text-sm mt-1">Create your first plan to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
