import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.graphicDesign' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/graphic-design`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/graphic-design`,
            languages: {
                'en': 'https://luminor.solutions/services/graphic-design',
                'bs': 'https://luminor.solutions/bs/services/graphic-design',
                'hr': 'https://luminor.solutions/bs/services/graphic-design',
                'sr': 'https://luminor.solutions/bs/services/graphic-design',
            },
        },
    };
}

export default function GraphicDesignLayout({ children }: Props) {
    return <>{children}</>;
}
