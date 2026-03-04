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
            url: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}contact`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: `https://www.luminor.solutions/${locale === 'en' ? '' : locale + '/'}contact`,
            languages: {
                'en': 'https://www.luminor.solutions/contact',
                'bs': 'https://www.luminor.solutions/bs/contact',
                'hr': 'https://www.luminor.solutions/bs/contact',
                'sr': 'https://www.luminor.solutions/bs/contact',
            },
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
