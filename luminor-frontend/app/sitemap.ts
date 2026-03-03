import { MetadataRoute } from 'next';

const BASE_URL = 'https://luminor.solutions';
import { API_URL } from '@/lib/api';



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

    // 2. Dynamic Blog Posts (with image metadata)
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
                    images: post.featured_image ? [post.featured_image] : undefined,
                }))
            );
        }
    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    // 3. Dynamic Portfolio Projects (with image metadata)
    let portfolioUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/portfolio`);
        const data = await res.json();

        if (data.success && data.data) {
            portfolioUrls = data.data.flatMap((project: any) => {
                // Collect all project images (featured image + screenshots)
                const images: string[] = [];
                if (project.featured_image) images.push(project.featured_image);
                if (project.screenshots && Array.isArray(project.screenshots)) {
                    images.push(...project.screenshots);
                }

                return locales.map(locale => ({
                    url: `${BASE_URL}/${locale}/portfolio/${project.slug || project.id}`, // Fallback to ID if slug missing
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

    // 4. Blog Category Archive Pages
    let categoryUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/blog?limit=1000`);
        const data = await res.json();

        if (data.success && data.data) {
            // Extract unique categories from blog posts
            const categories = [...new Set<string>(data.data.map((post: any) => post.category).filter(Boolean))];

            categoryUrls = categories.flatMap((category: string) =>
                locales.map(locale => ({
                    url: `${BASE_URL}/${locale}/blog/category/${encodeURIComponent(category)}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }))
            );
        }
    } catch (error) {
        console.error("Category sitemap generation error:", error);
    }

    // 5. Blog Tag Archive Pages
    let tagUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/blog?limit=1000`);
        const data = await res.json();

        if (data.success && data.data) {
            // Extract unique tags from all blog posts
            const allTags = new Set<string>();
            data.data.forEach((post: any) => {
                if (post.tags && Array.isArray(post.tags)) {
                    post.tags.forEach((tag: string) => allTags.add(tag));
                }
            });

            tagUrls = Array.from(allTags).flatMap((tag: string) =>
                locales.map(locale => ({
                    url: `${BASE_URL}/${locale}/blog/tag/${encodeURIComponent(tag)}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }))
            );
        }
    } catch (error) {
        console.error("Tag sitemap generation error:", error);
    }

    return [...staticUrls, ...blogUrls, ...portfolioUrls, ...categoryUrls, ...tagUrls];
}
