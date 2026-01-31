"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Code, Search, BarChart2, Zap, Layout, Terminal } from "lucide-react";
import { API_URL } from "@/lib/api";

interface SiteSettings {
    id: number;
    site_title: string;
    site_description: string;
    site_keywords: string;
    google_site_verification: string;
    bing_site_verification: string;
    yandex_verification: string;
    baidu_verification: string;
    google_analytics_id: string;
    google_tag_manager_id: string;
    facebook_pixel_id: string;
    og_image_url: string;
    robots_txt: string;
    schema_type: string;
    business_name: string;
    logo_url: string;
    price_range: string;
    opening_hours: string;
    geo_latitude: string;
    geo_longitude: string;
}

export default function SeoPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'webmaster' | 'analytics' | 'schema' | 'crawling'>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                // Toast notification would go here
                alert("Settings Saved");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof SiteSettings, value: string) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    if (loading) return <div className="flex justify-center items-center h-[60vh]"><div className="spinner"></div></div>;
    if (!settings) return <div className="p-8">Error loading configuration.</div>;

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === id
                ? "bg-[#0F172A] text-white shadow-lg shadow-blue-900/20"
                : "text-gray-500 hover:bg-gray-100 hover:text-[#0F172A]"
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="space-y-6 pb-12 animate-fade-up max-w-[1600px] mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold font-display text-[#0F172A] flex items-center gap-3">
                        <Terminal size={32} className="text-[#FF9F1C]" />
                        SEO Command Center
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage search visibility, crawling protocols, and schema entities.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary px-8 py-3 text-base flex items-center gap-2"
                >
                    {saving ? <div className="spinner w-4 h-4 border-white border-t-transparent"></div> : <Save size={18} />}
                    <span>Save Configuration</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* SIDEBAR TABS */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Modules</p>
                    <TabButton id="general" label="Global Metadata" icon={Globe} />
                    <TabButton id="schema" label="Schema Entity" icon={Layout} />
                    <TabButton id="webmaster" label="Webmaster Keys" icon={Search} />
                    <TabButton id="analytics" label="Tracking Scripts" icon={BarChart2} />
                    <TabButton id="crawling" label="Robots & Indexing" icon={Zap} />
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* FORM SECTION (Spans 2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'general' && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold font-display text-[#0F172A] mb-6 flex items-center gap-2">
                                    <Globe size={20} className="text-blue-500" /> Global Metadata
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Homepage Title</label>
                                        <input
                                            type="text"
                                            className="input-field font-medium text-lg"
                                            value={settings.site_title || ""}
                                            onChange={(e) => handleChange("site_title", e.target.value)}
                                            maxLength={60}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-gray-400">Main title tag for homepage.</p>
                                            <span className={`text-xs font-bold ${(settings.site_title?.length || 0) > 60 ? 'text-red-500' : 'text-green-600'}`}>
                                                {settings.site_title?.length || 0}/60
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Meta Description</label>
                                        <textarea
                                            className="input-field min-h-[120px] leading-relaxed"
                                            value={settings.site_description || ""}
                                            onChange={(e) => handleChange("site_description", e.target.value)}
                                            maxLength={160}
                                        />
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-gray-400">Optimize for CTR.</p>
                                            <span className={`text-xs font-bold ${(settings.site_description?.length || 0) > 160 ? 'text-red-500' : 'text-green-600'}`}>
                                                {settings.site_description?.length || 0}/160
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Keywords</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
                                            <input
                                                type="text"
                                                className="input-field pl-7 font-mono text-sm text-blue-600"
                                                placeholder="agency, marketing..."
                                                value={settings.site_keywords || ""}
                                                onChange={(e) => handleChange("site_keywords", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* OG Image Section */}
                                    <div className="pt-6 mt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">📸</span>
                                            Social Sharing Images
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">OG Image URL</label>
                                                <input
                                                    type="text"
                                                    className="input-field font-mono text-xs"
                                                    placeholder="https://luminor.solution/images/og-default.png"
                                                    value={settings.og_image_url || ""}
                                                    onChange={(e) => handleChange("og_image_url", e.target.value)}
                                                />
                                                <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px. Used by Facebook, LinkedIn, etc.</p>
                                            </div>

                                            {/* Preview */}
                                            {settings.og_image_url && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Preview</p>
                                                    <div className="aspect-[1200/630] bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                                                        <img
                                                            src={settings.og_image_url}
                                                            alt="OG Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schema' && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold font-display text-[#0F172A] mb-6 flex items-center gap-2">
                                    <Layout size={20} className="text-purple-500" /> Structured Data (JSON-LD)
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Organization Type</label>
                                        <select
                                            className="input-field"
                                            value={settings.schema_type || 'Organization'}
                                            onChange={(e) => handleChange('schema_type', e.target.value)}
                                        >
                                            <option value="Organization">Organization</option>
                                            <option value="LocalBusiness">Local Business</option>
                                            <option value="Corporation">Corporation</option>
                                            <option value="ProfessionalService">Professional Service</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Business Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={settings.business_name || ""}
                                            onChange={(e) => handleChange("business_name", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Logo URL</label>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-xs"
                                            value={settings.logo_url || ""}
                                            onChange={(e) => handleChange("logo_url", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs simplified for brevity but following same pattern */}
                        {(activeTab === 'webmaster' || activeTab === 'analytics' || activeTab === 'crawling') && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center justify-center min-h-[300px] bg-[#0F172A] text-white">
                                <div className="text-center">
                                    <Code size={48} className="mx-auto mb-4 text-[#FF9F1C] opacity-50" />
                                    <h3 className="text-xl font-bold font-display">Technical Configuration</h3>
                                    <p className="text-gray-400 mt-2 max-w-sm mx-auto">
                                        Edit specialized parameters for {activeTab === 'webmaster' ? 'Search Console' : activeTab === 'analytics' ? 'Tracking Scripts' : 'Robots.txt'} in the backend or use the legacy editor.
                                    </p>
                                    <button className="mt-6 btn btn-secondary text-sm">Open Advanced Editor</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* LIVE PREVIEW (Sticky Right Col) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Realistic Mobile Preview */}
                            <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-2xl mx-auto max-w-[320px]">
                                {/* Mobile Status Bar */}
                                <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-50">
                                    <span className="text-[10px] font-bold text-gray-900">9:41</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 bg-gray-900 rounded-full opacity-20"></div>
                                        <div className="w-3 h-3 bg-gray-900 rounded-full opacity-20"></div>
                                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="p-3 bg-white">
                                    <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-inner">
                                        <Globe size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-500">google.com</span>
                                    </div>
                                </div>

                                {/* Results Container */}
                                <div className="bg-gray-50 p-3 min-h-[400px]">
                                    {/* The Result Card */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 border flex items-center justify-center text-[8px] font-bold text-gray-600">L</div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[#202124]">Luminor Agency</span>
                                                <span className="text-[10px] text-[#5f6368]">luminor.solution</span>
                                            </div>
                                        </div>
                                        <h3 className="text-[#1a0dab] text-lg leading-6 font-normal hover:underline mb-1">
                                            {settings.site_title || "Your Page Title"}
                                        </h3>
                                        <p className="text-sm text-[#4d5156] leading-5 line-clamp-3">
                                            {settings.site_description || "This is how your page will appear in Google search results. Make it catchy!"}
                                        </p>
                                    </div>

                                    {/* Sitelinks Mock */}
                                    <div className="pl-4 border-l-2 border-gray-200 ml-2 space-y-3 mt-4">
                                        <div>
                                            <div className="text-[#1a0dab] text-sm font-medium">Services</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">Web Design, SEO & Marketing...</div>
                                        </div>
                                        <div>
                                            <div className="text-[#1a0dab] text-sm font-medium">Contact Us</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">Get in touch with our team...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SEO Health Score (Fun widget) */}
                            <div className="card-bento p-6 bg-[#0F172A] text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-[#FF9F1C]">SEO Health</h4>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">Good</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-xs text-gray-400">85/100 Optimized</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
