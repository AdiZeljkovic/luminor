"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Code, Search, BarChart2, Zap, Layout, Terminal } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

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
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_facebook: string;
    social_instagram: string;
    social_linkedin: string;
    social_twitter: string;
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
            const response = await apiClient.get('/api/settings');
            if (response.success) {
                setSettings(response.data);
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
            const response = await apiClient.put('/api/settings', settings);
            if (response.success) {
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

                                    {/* Contact Info */}
                                    <div className="col-span-2 pt-4 mt-2 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Info</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Email</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="info@luminor.solutions"
                                            value={settings.contact_email || ""}
                                            onChange={(e) => handleChange("contact_email", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Phone</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="+387 62 574 783"
                                            value={settings.contact_phone || ""}
                                            onChange={(e) => handleChange("contact_phone", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Address</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Porodice Ribar 39, 71000 Sarajevo"
                                            value={settings.contact_address || ""}
                                            onChange={(e) => handleChange("contact_address", e.target.value)}
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="col-span-2 pt-4 mt-2 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Social Links (for Schema sameAs)</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Facebook URL</label>
                                        <input
                                            type="url"
                                            className="input-field font-mono text-xs"
                                            placeholder="https://facebook.com/luminor"
                                            value={settings.social_facebook || ""}
                                            onChange={(e) => handleChange("social_facebook", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Instagram URL</label>
                                        <input
                                            type="url"
                                            className="input-field font-mono text-xs"
                                            placeholder="https://instagram.com/luminor"
                                            value={settings.social_instagram || ""}
                                            onChange={(e) => handleChange("social_instagram", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            className="input-field font-mono text-xs"
                                            placeholder="https://linkedin.com/company/luminor"
                                            value={settings.social_linkedin || ""}
                                            onChange={(e) => handleChange("social_linkedin", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Twitter / X URL</label>
                                        <input
                                            type="url"
                                            className="input-field font-mono text-xs"
                                            placeholder="https://x.com/luminor"
                                            value={settings.social_twitter || ""}
                                            onChange={(e) => handleChange("social_twitter", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'webmaster' && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold font-display text-[#0F172A] mb-2 flex items-center gap-2">
                                    <Search size={20} className="text-green-500" /> Webmaster Verification Keys
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">Enter verification codes from each search console. These are injected as meta tags in the &lt;head&gt;.</p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block flex items-center gap-2">
                                            <span className="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                            </span>
                                            Google Search Console
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="e.g. google-site-verification=abc123..."
                                            value={settings.google_site_verification || ""}
                                            onChange={(e) => handleChange("google_site_verification", e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">From Search Console → Settings → Ownership verification → HTML tag. Copy only the content value.</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Bing Webmaster Tools</label>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="e.g. XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                                            value={settings.bing_site_verification || ""}
                                            onChange={(e) => handleChange("bing_site_verification", e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">From Bing Webmaster → Add Site → XML file or meta tag content value.</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Yandex Webmaster</label>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="e.g. XXXXXXXXXXXXXXXX"
                                            value={settings.yandex_verification || ""}
                                            onChange={(e) => handleChange("yandex_verification", e.target.value)}
                                        />
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <p className="text-xs font-bold text-blue-700 mb-1">💡 How it works</p>
                                        <p className="text-xs text-blue-600">These codes are automatically injected as <code className="bg-blue-100 px-1 rounded">&lt;meta name="google-site-verification" content="..."&gt;</code> tags in the &lt;head&gt; of every page. After saving, go to Search Console and click Verify.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold font-display text-[#0F172A] mb-2 flex items-center gap-2">
                                    <BarChart2 size={20} className="text-orange-500" /> Tracking Scripts
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">IDs are injected automatically into every page. No manual code needed.</p>

                                <div className="space-y-6">
                                    <div className="p-5 border-2 border-gray-100 rounded-xl hover:border-[#FF9F1C] transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="#E37400"><path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zm2.471 7.485a.855.855 0 0 0-.593.25l-4.453 4.453-1.62-1.62a.855.855 0 1 0-1.208 1.207l2.223 2.223a.855.855 0 0 0 1.208 0l5.057-5.056a.855.855 0 0 0-.614-1.457z"/></svg>
                                            <div>
                                                <p className="font-bold text-[#0F172A] text-sm">Google Analytics 4</p>
                                                <p className="text-xs text-gray-400">Measurement ID format: G-XXXXXXXXXX</p>
                                            </div>
                                            {settings.google_analytics_id && (
                                                <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="G-XXXXXXXXXX"
                                            value={settings.google_analytics_id || ""}
                                            onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                                        />
                                    </div>

                                    <div className="p-5 border-2 border-gray-100 rounded-xl hover:border-[#FF9F1C] transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="#246FDB"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 4.8l3.6 7.2H8.4L12 4.8zm-7.2 9.6h14.4l-3.6 3.6H8.4l-3.6-3.6z"/></svg>
                                            <div>
                                                <p className="font-bold text-[#0F172A] text-sm">Google Tag Manager</p>
                                                <p className="text-xs text-gray-400">Container ID format: GTM-XXXXXXX</p>
                                            </div>
                                            {settings.google_tag_manager_id && (
                                                <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="GTM-XXXXXXX"
                                            value={settings.google_tag_manager_id || ""}
                                            onChange={(e) => handleChange("google_tag_manager_id", e.target.value)}
                                        />
                                    </div>

                                    <div className="p-5 border-2 border-gray-100 rounded-xl hover:border-[#FF9F1C] transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                            <div>
                                                <p className="font-bold text-[#0F172A] text-sm">Facebook Pixel</p>
                                                <p className="text-xs text-gray-400">Pixel ID (numeric)</p>
                                            </div>
                                            {settings.facebook_pixel_id && (
                                                <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            className="input-field font-mono text-sm"
                                            placeholder="123456789012345"
                                            value={settings.facebook_pixel_id || ""}
                                            onChange={(e) => handleChange("facebook_pixel_id", e.target.value)}
                                        />
                                    </div>

                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                        <p className="text-xs font-bold text-orange-700 mb-1">💡 How it works</p>
                                        <p className="text-xs text-orange-600">Scripts are injected automatically using Next.js Script strategy. GA4 and GTM load after interaction, Facebook Pixel loads after page load. GDPR consent is checked before firing.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'crawling' && (
                            <div className="card-bento p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xl font-bold font-display text-[#0F172A] mb-2 flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-500" /> Robots & Indexing
                                </h2>
                                <p className="text-sm text-gray-400 mb-6">Configure how search engines crawl your site. Rules are served at <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/robots.txt</code></p>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-xs">
                                            <p className="font-bold text-[#0F172A] mb-1">Always blocked (system)</p>
                                            <code className="text-gray-500 block">Disallow: /api/</code>
                                            <code className="text-gray-500 block">Disallow: /dashboard/</code>
                                            <code className="text-gray-500 block">Disallow: /portal/</code>
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold text-[#0F172A] mb-1">Always allowed</p>
                                            <code className="text-gray-500 block">Allow: /</code>
                                            <code className="text-gray-500 block">Sitemap: /sitemap.xml</code>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-[#0F172A] mb-1.5 block">Custom Robots.txt Rules</label>
                                        <textarea
                                            className="input-field font-mono text-sm min-h-[180px] leading-relaxed"
                                            placeholder={"# Add custom rules\nDisallow: /thank-you\nDisallow: /tmp/"}
                                            value={settings.robots_txt || ""}
                                            onChange={(e) => handleChange("robots_txt", e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">These rules are appended to the default rules above. One rule per line.</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <a
                                            href="https://www.luminor.solutions/robots.txt"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-2.5 border-2 border-[#0F172A] rounded-xl text-sm font-bold hover:bg-[#0F172A] hover:text-white transition-colors"
                                        >
                                            View robots.txt ↗
                                        </a>
                                        <a
                                            href="https://www.luminor.solutions/sitemap.xml"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-2.5 border-2 border-[#0F172A] rounded-xl text-sm font-bold hover:bg-[#0F172A] hover:text-white transition-colors"
                                        >
                                            View sitemap.xml ↗
                                        </a>
                                    </div>
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
