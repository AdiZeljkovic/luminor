import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.contact' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(',').map((k: string) => k.trim()),
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            url: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}contact`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://luminor.solutions/${locale === 'en' ? '' : locale + '/'}contact`,
            languages: {
                'en': 'https://luminor.solutions/contact',
                'bs': 'https://luminor.solutions/bs/contact',
                'hr': 'https://luminor.solutions/bs/contact',
                'sr': 'https://luminor.solutions/bs/contact',
            },
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
