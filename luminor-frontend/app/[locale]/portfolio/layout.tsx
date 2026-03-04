import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.portfolio' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}portfolio`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}portfolio`,
            languages: {
                'en': 'https://www.luminor.solutions/portfolio',
                'bs': 'https://www.luminor.solutions/bs/portfolio',
                'hr': 'https://www.luminor.solutions/bs/portfolio',
                'sr': 'https://www.luminor.solutions/bs/portfolio',
            },
        },
    };
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
