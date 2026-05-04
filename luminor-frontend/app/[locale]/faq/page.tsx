import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import FaqContent from './FaqContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.faq' });
    const canonicalPath = locale === 'en' ? 'faq' : `${locale}/faq`;

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://www.luminor.solutions/${canonicalPath}`,
            images: [{ url: 'https://www.luminor.solutions/rocket-hero.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': 'https://www.luminor.solutions/faq',
                'bs': 'https://www.luminor.solutions/bs/faq',
                'x-default': 'https://www.luminor.solutions/faq',
            },
        },
    };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <FaqContent />;
}
