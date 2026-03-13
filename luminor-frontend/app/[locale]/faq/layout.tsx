import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default function FaqLayout({ children }: Props) {
    return <>{children}</>;
}
