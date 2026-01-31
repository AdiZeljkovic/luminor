import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/getSettings';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const settings = await getSiteSettings();
    const rules = settings?.robots_txt || "User-agent: *\nAllow: /";

    // Simple parser for standard robots.txt content if needed, 
    // but Next.js expects an object.

    // For now, let's just return a standard object based on our "Maintenance Mode" or default.
    // Ideally we'd parse the string, but that's complex.
    // Let's just allow all unless we specificly want to disallow admin.

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/'],
        },
        sitemap: 'https://luminor.solutions/sitemap.xml',
    };
}
