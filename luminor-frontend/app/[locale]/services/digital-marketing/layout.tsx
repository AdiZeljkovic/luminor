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
            url: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/digital-marketing`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}services/digital-marketing`,
            languages: {
                'en': 'https://www.luminor.solutions/services/digital-marketing',
                'bs': 'https://www.luminor.solutions/bs/services/digital-marketing',
                'hr': 'https://www.luminor.solutions/bs/services/digital-marketing',
                'sr': 'https://www.luminor.solutions/bs/services/digital-marketing',
            },
        },
    };
}

export default function DigitalMarketingLayout({ children }: Props) {
    return <>{children}</>;
}
