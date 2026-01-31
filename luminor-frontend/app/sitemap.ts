import { MetadataRoute } from 'next';

const BASE_URL = 'https://luminor.solutions';
import { API_URL } from '@/lib/api';

const BASE_URL = 'https://luminor.solutions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/services',
        '/portfolio',
        '/blog',
        '/contact'
    ];

    const locales = ['en', 'bs'];

    // Generate static URLs for all locales
    const staticUrls = locales.flatMap(locale =>
        staticRoutes.map(route => ({
            url: `${BASE_URL}/${locale}${route === '' ? '' : route}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    // 2. Dynamic Blog Posts
    let blogUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/blog?limit=1000`); // Fetch many
        const data = await res.json();

        if (data.success && data.data) {
            blogUrls = data.data.flatMap((post: any) =>
                locales.map(locale => ({
                    url: `${BASE_URL}/${locale}/blog/${post.slug}`,
                    lastModified: new Date(post.updatedAt || post.published_at),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }))
            );
        }
    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    // 3. Dynamic Portfolio Projects (Optional, if endpoint exists)
    // ...

    return [...staticUrls, ...blogUrls];
}
