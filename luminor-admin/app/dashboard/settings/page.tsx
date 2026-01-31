"use client";

import { useState, useEffect } from "react";

interface SiteSettings {
    id: number;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_facebook: string;
    social_instagram: string;
    social_linkedin: string;
    social_twitter: string;
    maintenance_mode: boolean;
    announcement_active: boolean;
    announcement_message: string;
    announcement_link: string;
}

import { API_URL } from "@/lib/api";

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings`);
                const data = await res.json();
                if (data.success) setSettings(data.data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                alert("Settings saved successfully! ✅");
            } else {
                alert("Failed to save settings. ❌");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Error saving settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!settings) return <div className="p-8">Error loading settings.</div>;

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12 animate-fade-up">
            {/* Header */}
            <div className="flex justify-between items-center bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A]">Site Settings</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage global website configuration and SEO branding.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary px-8 py-3 text-base flex items-center gap-2"
                >
                    {saving ? <div className="spinner w-4 h-4 border-white border-t-transparent"></div> : "💾 Save Changes"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* System Control & Announcements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Maintenance Mode */}
                    <div className={`card-bento p-8 transition-colors ${settings.maintenance_mode ? 'bg-red-50 border-red-500 shadow-[4px_4px_0px_0px_#EF4444]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold font-display text-[#0F172A] flex items-center gap-2">
                                🚧 Maintenance Mode
                            </h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.maintenance_mode || false}
                                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            When active, the public site will be hidden behind a "Under Construction" page.
                            <br /><span className="font-bold text-red-600">Admins can still access the dashboard.</span>
                        </p>
                    </div>

                    {/* Announcement Banner */}
                    <div className={`card-bento p-8 transition-colors ${settings.announcement_active ? 'bg-yellow-50 border-[#FF9F1C] shadow-[4px_4px_0px_0px_#FF9F1C]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold font-display text-[#0F172A] flex items-center gap-2">
                                📢 Announcement Bar
                            </h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.announcement_active || false}
                                    onChange={(e) => setSettings({ ...settings, announcement_active: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF9F1C]"></div>
                            </label>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Message</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 20% OFF SEO Services - Limited Time!"
                                    className="input-field"
                                    value={settings.announcement_message || ""}
                                    onChange={(e) => handleChange("announcement_message", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Action Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="/services"
                                    className="input-field"
                                    value={settings.announcement_link || ""}
                                    onChange={(e) => handleChange("announcement_link", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="card-bento p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">@</div>
                            <div>
                                <h2 className="text-xl font-bold font-display text-[#0F172A]">Contact Details</h2>
                                <p className="text-xs text-gray-400">Publicly visible contact information</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Official Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={settings.contact_email || ""}
                                    onChange={(e) => handleChange("contact_email", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Phone Number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={settings.contact_phone || ""}
                                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Physical Address</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={settings.contact_address || ""}
                                    onChange={(e) => handleChange("contact_address", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="card-bento p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">#</div>
                            <div>
                                <h2 className="text-xl font-bold font-display text-[#0F172A]">Social Connections</h2>
                                <p className="text-xs text-gray-400">Links for footer and contact page</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Facebook URL</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={settings.social_facebook || ""}
                                    onChange={(e) => handleChange("social_facebook", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Instagram URL</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={settings.social_instagram || ""}
                                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">LinkedIn URL</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={settings.social_linkedin || ""}
                                    onChange={(e) => handleChange("social_linkedin", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Twitter/X URL</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={settings.social_twitter || ""}
                                    onChange={(e) => handleChange("social_twitter", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
