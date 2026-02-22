import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { API_URL } from '@/lib/api';
import { getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ category: string; locale: string }>;
};

// Fetch posts by category
async function getPostsByCategory(category: string, locale: string) {
    try {
        const res = await fetch(`${API_URL}/api/blog?category=${encodeURIComponent(category)}&locale=${locale}&limit=50`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, locale } = await params;
    const decodedCategory = decodeURIComponent(category);

    return {
        title: `${decodedCategory} | Luminor Blog`,
        description: `Discover expert insights and practical guides about ${decodedCategory}. Professional articles from Luminor Solutions.`,
        keywords: `${decodedCategory}, blog, articles, ${decodedCategory} tips, ${decodedCategory} guide, ${decodedCategory} best practices`,
        alternates: {
            canonical: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}blog/category/${category}`,
            languages: {
                'en': `https://luminor.solutions/blog/category/${category}`,
                'bs': `https://luminor.solutions/bs/blog/category/${category}`,
                'hr': `https://luminor.solutions/bs/blog/category/${category}`,
                'sr': `https://luminor.solutions/bs/blog/category/${category}`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${decodedCategory} | Luminor Blog`,
            description: `Discover expert insights and practical guides about ${decodedCategory}. Professional articles from Luminor Solutions.`,
            type: 'website',
            url: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}blog/category/${category}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${decodedCategory} | Luminor Blog`,
            description: `Discover expert insights and practical guides about ${decodedCategory}. Professional articles from Luminor Solutions.`,
        },
    };
}

export default async function CategoryArchivePage({ params }: Props) {
    const { category, locale } = await params;
    const decodedCategory = decodeURIComponent(category);
    const t = await getTranslations({ locale, namespace: 'blog' });

    const posts = await getPostsByCategory(category, locale);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Blog', href: '/blog' },
                        { label: decodedCategory }
                    ]}
                />

                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-yellow-500">{decodedCategory}</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <BlogCard
                                key={post.id}
                                title={post[`title_${locale}`] || post.title_en}
                                excerpt={post[`excerpt_${locale}`] || post.excerpt_en || ''}
                                slug={post.slug}
                                date={post.published_at}
                                author={{
                                    name: post.author?.name || 'Luminor Team',
                                    avatar: post.author?.avatar
                                }}
                                image={post.featured_image}
                                category={post.category}
                                readTime={post.read_time || 5}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
