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
        keywords: t('keywords').split(',').map(k => k.trim()),
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
