import { MetadataRoute } from 'next';
import { API_URL } from '@/lib/api';

export const revalidate = 3600; // Refresh sitemap every hour

const BASE_URL = 'https://www.luminor.solutions';
const locales = ['en', 'bs'] as const;

// Helper: build one entry per locale with hreflang alternates
function multiLocaleEntry(
    path: string,
    opts: {
        lastModified?: Date;
        changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
        priority?: number;
        images?: string[];
    } = {}
): MetadataRoute.Sitemap {
    return locales.map(locale => ({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: opts.lastModified ?? new Date('2025-01-01'),
        changeFrequency: opts.changeFrequency ?? 'monthly',
        priority: opts.priority ?? 0.8,
        alternates: {
            languages: {
                en: `${BASE_URL}/en${path}`,
                bs: `${BASE_URL}/bs${path}`,
            },
        },
        ...(opts.images ? { images: opts.images } : {}),
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // ─── 1. Static pages ────────────────────────────────────────────────────
    const staticEntries: MetadataRoute.Sitemap = [
        // Homepage — highest priority, changes more often
        ...multiLocaleEntry('', { changeFrequency: 'weekly', priority: 1.0 }),

        // Core pages
        ...multiLocaleEntry('/about',   { priority: 0.8 }),
        ...multiLocaleEntry('/process', { priority: 0.7 }),
        ...multiLocaleEntry('/contact', { priority: 0.9 }),
        ...multiLocaleEntry('/faq',     { priority: 0.7 }),
        ...multiLocaleEntry('/hosting', { priority: 0.8 }),

        // Portfolio & Blog index
        ...multiLocaleEntry('/portfolio', { changeFrequency: 'weekly', priority: 0.8 }),
        ...multiLocaleEntry('/blog',      { changeFrequency: 'weekly', priority: 0.8 }),

        // Services
        ...multiLocaleEntry('/services',                     { priority: 0.8 }),
        ...multiLocaleEntry('/services/web-development',     { priority: 0.8 }),
        ...multiLocaleEntry('/services/graphic-design',      { priority: 0.8 }),
        ...multiLocaleEntry('/services/digital-marketing',   { priority: 0.8 }),
        ...multiLocaleEntry('/services/seo',                 { priority: 0.8 }),
        ...multiLocaleEntry('/services/ai-automation',       { priority: 0.8 }),
        ...multiLocaleEntry('/services/mobile-development',  { priority: 0.8 }),

        // Legal (low priority, rarely change)
        ...multiLocaleEntry('/privacy', { changeFrequency: 'yearly', priority: 0.3 }),
        ...multiLocaleEntry('/terms',   { changeFrequency: 'yearly', priority: 0.3 }),
    ];

    // ─── 2. Offer pages ─────────────────────────────────────────────────────
    const offerServices = [
        'web-development',
        'graphic-design',
        'digital-marketing',
        'seo',
        'ai-automation',
        'mobile-development',
        'hosting',
    ];

    const offerEntries: MetadataRoute.Sitemap = offerServices.flatMap(service =>
        multiLocaleEntry(`/offers/${service}`, {
            changeFrequency: 'monthly',
            priority: 0.7,
        })
    );

    // ─── 3. Fetch blog & portfolio data ─────────────────────────────────────
    let allBlogPosts: any[] = [];
    try {
        const res = await fetch(`${API_URL}/api/blog?limit=1000`, { next: { revalidate: 3600 } });
        const data = await res.json();
        if (data.success && data.data) allBlogPosts = data.data;
    } catch {
        // Non-fatal — sitemap still works for static pages
    }

    const blogEntries: MetadataRoute.Sitemap = allBlogPosts.flatMap((post: any) =>
        multiLocaleEntry(`/blog/${post.slug}`, {
            lastModified: new Date(post.updatedAt || post.published_at),
            changeFrequency: 'weekly',
            priority: 0.7,
            images: post.featured_image ? [post.featured_image] : undefined,
        })
    );

    // ─── 4. Portfolio projects ───────────────────────────────────────────────
    let portfolioEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/portfolio`, { next: { revalidate: 3600 } });
        const data = await res.json();

        if (data.success && data.data) {
            portfolioEntries = data.data.flatMap((project: any) => {
                const images: string[] = [];
                if (project.featured_image) images.push(project.featured_image);
                if (Array.isArray(project.screenshots)) images.push(...project.screenshots);

                return multiLocaleEntry(`/portfolio/${project.slug || project.id}`, {
                    lastModified: new Date(project.updated_at || project.created_at || new Date()),
                    changeFrequency: 'monthly',
                    priority: 0.8,
                    images: images.length > 0 ? images : undefined,
                });
            });
        }
    } catch {
        // Non-fatal
    }

    // ─── 5. Blog category & tag archives ────────────────────────────────────
    const categories = [...new Set<string>(allBlogPosts.map((p: any) => p.category).filter(Boolean))];
    const categoryEntries: MetadataRoute.Sitemap = categories.flatMap(category =>
        multiLocaleEntry(`/blog/category/${encodeURIComponent(category)}`, {
            changeFrequency: 'weekly',
            priority: 0.6,
        })
    );

    const allTags = new Set<string>();
    allBlogPosts.forEach((p: any) => {
        if (Array.isArray(p.tags)) p.tags.forEach((t: string) => allTags.add(t));
    });
    const tagEntries: MetadataRoute.Sitemap = Array.from(allTags).flatMap(tag =>
        multiLocaleEntry(`/blog/tag/${encodeURIComponent(tag)}`, {
            changeFrequency: 'weekly',
            priority: 0.6,
        })
    );

    return [
        ...staticEntries,
        ...offerEntries,
        ...blogEntries,
        ...portfolioEntries,
        ...categoryEntries,
        ...tagEntries,
    ];
}
