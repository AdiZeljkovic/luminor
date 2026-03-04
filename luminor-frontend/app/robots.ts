import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/getSettings';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const settings = await getSiteSettings();

    // If admin has configured custom robots.txt rules, parse and use them
    if (settings?.robots_txt) {
        try {
            const lines = settings.robots_txt.split('\n').map((l: string) => l.trim()).filter(Boolean);
            const disallowLines = lines
                .filter((l: string) => l.toLowerCase().startsWith('disallow:'))
                .map((l: string) => l.replace(/^disallow:\s*/i, '').trim())
                .filter((l: string) => l.length > 0); // only valid non-empty paths

            if (disallowLines.length > 0) {
                return {
                    rules: { userAgent: '*', allow: '/', disallow: disallowLines },
                    sitemap: 'https://www.luminor.solutions/sitemap.xml',
                };
            }
        } catch {
            // Fall through to defaults on any parsing error
        }
    }

    // Default: allow all public pages, block admin/api/portal
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/portal/'],
        },
        sitemap: 'https://www.luminor.solutions/sitemap.xml',
    };
}
