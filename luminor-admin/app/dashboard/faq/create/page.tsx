"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

const CATEGORIES = [
    { value: "general", label: "General" },
    { value: "web-development", label: "Web Development" },
    { value: "seo", label: "SEO" },
    { value: "hosting", label: "Hosting" },
    { value: "pricing", label: "Pricing" },
    { value: "process", label: "Process" },
];

export default function FAQCreatePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        question_en: "",
        question_bs: "",
        answer_en: "",
        answer_bs: "",
        category: "general",
        order_num: 0,
        is_active: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await apiClient.post("/api/faq", form);
            if (response.success) {
                router.push("/dashboard/faq");
            } else {
                setError(response.error || "Failed to create FAQ");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create FAQ");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-up max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Add FAQ</h1>
                    <p className="text-gray-500 font-medium mt-1">Create a new frequently asked question.</p>
                </div>
                <Link href="/dashboard/faq" className="btn btn-secondary">
                    ← Back to FAQs
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card-bento space-y-6">
                {/* Category & Order */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Display Order</label>
                        <input
                            type="number"
                            name="order_num"
                            value={form.order_num}
                            onChange={handleChange}
                            min={0}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium"
                        />
                    </div>
                </div>

                {/* Question EN */}
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Question (English) *</label>
                    <input
                        type="text"
                        name="question_en"
                        value={form.question_en}
                        onChange={handleChange}
                        required
                        placeholder="e.g. How long does it take to build a website?"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium"
                    />
                </div>

                {/* Question BS */}
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Question (Bosnian) *</label>
                    <input
                        type="text"
                        name="question_bs"
                        value={form.question_bs}
                        onChange={handleChange}
                        required
                        placeholder="npr. Koliko dugo traje izrada web stranice?"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium"
                    />
                </div>

                {/* Answer EN */}
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Answer (English) *</label>
                    <textarea
                        name="answer_en"
                        value={form.answer_en}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Detailed answer in English..."
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium resize-none"
                    />
                </div>

                {/* Answer BS */}
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Answer (Bosnian) *</label>
                    <textarea
                        name="answer_bs"
                        value={form.answer_bs}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Detaljan odgovor na bosanskom..."
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9F1C] font-medium resize-none"
                    />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="is_active"
                        id="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="w-5 h-5 accent-[#FF9F1C]"
                    />
                    <label htmlFor="is_active" className="text-sm font-bold text-[#0F172A]">
                        Published (visible on website)
                    </label>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link href="/dashboard/faq" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" disabled={saving} className="btn btn-primary px-8">
                        {saving ? "Saving..." : "Create FAQ"}
                    </button>
                </div>
            </form>
        </div>
    );
}
