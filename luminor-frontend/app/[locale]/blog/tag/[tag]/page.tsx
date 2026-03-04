import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { API_URL } from '@/lib/api';
import { getTranslations } from 'next-intl/server';

type Props = {
    params: Promise<{ tag: string; locale: string }>;
};

// Fetch posts by tag
async function getPostsByTag(tag: string, locale: string) {
    try {
        const res = await fetch(`${API_URL}/api/blog?tag=${encodeURIComponent(tag)}&locale=${locale}&limit=50`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tag, locale } = await params;
    const decodedTag = decodeURIComponent(tag);

    return {
        title: `${decodedTag} Articles | Luminor Blog`,
        description: `Explore all our articles tagged with "${decodedTag}". Expert insights and practical tips from Luminor Solutions.`,
        keywords: `${decodedTag}, blog, articles, ${decodedTag} tips, ${decodedTag} guide`,
        alternates: {
            canonical: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}blog/tag/${tag}`,
            languages: {
                'en': `https://www.luminor.solutions/blog/tag/${tag}`,
                'bs': `https://www.luminor.solutions/bs/blog/tag/${tag}`,
                'hr': `https://www.luminor.solutions/bs/blog/tag/${tag}`,
                'sr': `https://www.luminor.solutions/bs/blog/tag/${tag}`,
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TagArchivePage({ params }: Props) {
    const { tag, locale } = await params;
    const decodedTag = decodeURIComponent(tag);
    const t = await getTranslations({ locale, namespace: 'blog' });

    const posts = await getPostsByTag(tag, locale);

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
                        { label: `Tag: ${decodedTag}` }
                    ]}
                />

                <div className="max-w-6xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Articles tagged: <span className="text-yellow-500">#{decodedTag}</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            {posts.length} {posts.length === 1 ? 'article' : 'articles'} found
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
