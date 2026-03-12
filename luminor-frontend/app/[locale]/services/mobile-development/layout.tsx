import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.mobileDevelopment' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/mobile-development`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/mobile-development`,
            languages: {
                'en': 'https://www.luminor.solutions/services/mobile-development',
                'bs': 'https://www.luminor.solutions/bs/services/mobile-development',
                'hr': 'https://www.luminor.solutions/bs/services/mobile-development',
                'sr': 'https://www.luminor.solutions/bs/services/mobile-development',
            },
        },
    };
}

export default function MobileDevelopmentLayout({ children }: Props) {
    return <>{children}</>;
}
