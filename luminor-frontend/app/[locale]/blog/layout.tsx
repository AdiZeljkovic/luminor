import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.blog' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}blog`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}blog`,
            languages: {
                'en': 'https://luminor.solutions/blog',
                'bs': 'https://luminor.solutions/bs/blog',
                'hr': 'https://luminor.solutions/bs/blog',
                'sr': 'https://luminor.solutions/bs/blog',
            },
        },
    };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
