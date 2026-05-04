import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import ContactContent from './ContactContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.contact' });
    const canonicalPath = locale === 'en' ? 'contact' : `${locale}/contact`;

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
                'en': 'https://www.luminor.solutions/contact',
                'bs': 'https://www.luminor.solutions/bs/contact',
                'x-default': 'https://www.luminor.solutions/contact',
            },
        },
    };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactContent />;
}
