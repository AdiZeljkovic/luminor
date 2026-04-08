import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.luminor.solutions';
import { API_URL } from '@/lib/api';



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/services',
        '/services/web-development',
        '/services/graphic-design',
        '/services/digital-marketing',
        '/services/seo',
        '/services/ai-automation',
        '/services/mobile-development',
        '/process',
        '/portfolio',
        '/blog',
        '/contact',
        '/hosting',
        '/faq',
        '/status',
    ];

    const locales = ['en', 'bs'];

    const offerServices = [
        'web-development',
        'graphic-design',
        'digital-marketing',
        'seo',
        'ai-automation',
        'mobile-development',
        'hosting',
    ];

    const offerUrls: MetadataRoute.Sitemap = locales.flatMap(locale =>
        offerServices.map(service => ({
            url: `${BASE_URL}/${locale}/offers/${service}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }))
    );

    // Generate static URLs for all locales
    const staticUrls = locales.flatMap(locale =>
        staticRoutes.map(route => ({
            url: `${BASE_URL}/${locale}${route === '' ? '' : route}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    // 2. Fetch blog data once — reused for posts, categories and tags
    let allBlogPosts: any[] = [];
    try {
        const res = await fetch(`${API_URL}/api/blog?limit=1000`);
        const data = await res.json();
        if (data.success && data.data) allBlogPosts = data.data;
    } catch (error) {
        console.error("Sitemap blog fetch error:", error);
    }

    const blogUrls: MetadataRoute.Sitemap = allBlogPosts.flatMap((post: any) =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.published_at),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
            images: post.featured_image ? [post.featured_image] : undefined,
        }))
    );

    // 3. Dynamic Portfolio Projects (with image metadata)
    let portfolioUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/portfolio`);
        const data = await res.json();

        if (data.success && data.data) {
            portfolioUrls = data.data.flatMap((project: any) => {
                const images: string[] = [];
                if (project.featured_image) images.push(project.featured_image);
                if (project.screenshots && Array.isArray(project.screenshots)) {
                    images.push(...project.screenshots);
                }
                return locales.map(locale => ({
                    url: `${BASE_URL}/${locale}/portfolio/${project.slug || project.id}`,
                    lastModified: new Date(project.updated_at || project.created_at || new Date()),
                    changeFrequency: 'monthly' as const,
                    priority: 0.8,
                    images: images.length > 0 ? images : undefined,
                }));
            });
        }
    } catch (error) {
        console.error("Portfolio sitemap generation error:", error);
    }

    // 4. Blog Category Archive Pages (derived from already-fetched blog data)
    const categories = [...new Set<string>(allBlogPosts.map((post: any) => post.category).filter(Boolean))];
    const categoryUrls: MetadataRoute.Sitemap = categories.flatMap((category: string) =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/blog/category/${encodeURIComponent(category)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    );

    // 5. Blog Tag Archive Pages (derived from already-fetched blog data)
    const allTags = new Set<string>();
    allBlogPosts.forEach((post: any) => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => allTags.add(tag));
        }
    });
    const tagUrls: MetadataRoute.Sitemap = Array.from(allTags).flatMap((tag: string) =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/blog/tag/${encodeURIComponent(tag)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    );

    return [...staticUrls, ...offerUrls, ...blogUrls, ...portfolioUrls, ...categoryUrls, ...tagUrls];
}
