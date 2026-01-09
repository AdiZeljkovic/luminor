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
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/settings");
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/settings", {
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
