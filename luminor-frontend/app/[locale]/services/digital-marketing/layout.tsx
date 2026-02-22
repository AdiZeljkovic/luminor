import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.digitalMarketing' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/digital-marketing`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/digital-marketing`,
            languages: {
                'en': 'https://luminor.solutions/services/digital-marketing',
                'bs': 'https://luminor.solutions/bs/services/digital-marketing',
                'hr': 'https://luminor.solutions/bs/services/digital-marketing',
                'sr': 'https://luminor.solutions/bs/services/digital-marketing',
            },
        },
    };
}

export default function DigitalMarketingLayout({ children }: Props) {
    return <>{children}</>;
}
