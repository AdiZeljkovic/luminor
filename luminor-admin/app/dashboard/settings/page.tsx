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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name: string) => {
        setSettings(prev => ({ ...prev, [name]: !prev[name as keyof SiteSettings] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

    const handleChange = (field: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!settings) return <div className="p-8">Error loading settings.</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-dark">Site Settings</h1>
                    <p className="text-gray-500">Manage global website configuration and SEO.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                >
                    {saving ? "Saving..." : "💾 Save Changes"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* System Control & Announcements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Maintenance Mode */}
                    <div className={`border-2 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] transition-colors ${settings.maintenance_mode ? 'bg-red-50 border-red-500' : 'bg-white border-[#0F172A]'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold font-display text-dark">🚧 Maintenance</h2>
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
                        <p className="text-sm text-gray-600 mb-2">
                            When active, the public site will show a "Under Construction" page.
                            <br /><span className="font-bold text-red-600">Only Admins can access the dashboard.</span>
                        </p>
                    </div>

                    {/* Announcement Banner */}
                    <div className={`border-2 rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(255,159,28,1)] transition-colors ${settings.announcement_active ? 'bg-yellow-50 border-[#FF9F1C]' : 'bg-white border-[#0F172A]'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold font-display text-dark">📢 Announcement</h2>
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
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Message (e.g. 20% OFF SEO Services)"
                                className="input"
                                value={settings.announcement_message || ""}
                                onChange={(e) => handleChange("announcement_message", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Link (Optional)"
                                className="input"
                                value={settings.announcement_link || ""}
                                onChange={(e) => handleChange("announcement_link", e.target.value)}
                            />
                        </div>
                    </div>
                </div>


                {/* Contact Info */}
                <div className="bg-white border-2 border-[#0F172A] rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <h2 className="text-xl font-bold font-display text-dark mb-4 border-b pb-2">Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Contact Email</label>
                            <input
                                type="email"
                                className="input"
                                value={settings.contact_email || ""}
                                onChange={(e) => handleChange("contact_email", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">Phone Number</label>
                            <input
                                type="text"
                                className="input"
                                value={settings.contact_phone || ""}
                                onChange={(e) => handleChange("contact_phone", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Address</label>
                            <input
                                type="text"
                                className="input"
                                value={settings.contact_address || ""}
                                onChange={(e) => handleChange("contact_address", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white border-2 border-[#0F172A] rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <h2 className="text-xl font-bold font-display text-dark mb-4 border-b pb-2">Social Media</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Facebook URL</label>
                            <input
                                type="url"
                                className="input"
                                value={settings.social_facebook || ""}
                                onChange={(e) => handleChange("social_facebook", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">Instagram URL</label>
                            <input
                                type="url"
                                className="input"
                                value={settings.social_instagram || ""}
                                onChange={(e) => handleChange("social_instagram", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">LinkedIn URL</label>
                            <input
                                type="url"
                                className="input"
                                value={settings.social_linkedin || ""}
                                onChange={(e) => handleChange("social_linkedin", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">Twitter/X URL</label>
                            <input
                                type="url"
                                className="input"
                                value={settings.social_twitter || ""}
                                onChange={(e) => handleChange("social_twitter", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
