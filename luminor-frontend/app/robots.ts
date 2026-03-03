import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/getSettings';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const settings = await getSiteSettings();

    // If admin has configured custom robots.txt rules, parse and use them
    if (settings?.robots_txt) {
        const lines = settings.robots_txt.split('\n').map((l: string) => l.trim()).filter(Boolean);
        const disallowLines = lines
            .filter((l: string) => l.toLowerCase().startsWith('disallow:'))
            .map((l: string) => l.replace(/^disallow:\s*/i, ''));

        if (disallowLines.length > 0) {
            return {
                rules: { userAgent: '*', allow: '/', disallow: disallowLines },
                sitemap: 'https://luminor.solutions/sitemap.xml',
            };
        }
    }

    // Default: allow all public pages, block admin/api
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/portal/'],
        },
        sitemap: 'https://luminor.solutions/sitemap.xml',
    };
}
