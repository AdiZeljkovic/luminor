import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const canonicalPath = locale === 'en' ? 'pricing' : `${locale}/pricing`;
    const title = locale === 'bs' ? 'Cijene Usluga | Luminor Solutions' : 'Pricing | Luminor Solutions';
    const description = locale === 'bs'
        ? 'Transparentne cijene za web razvoj, SEO, hosting i digitalni marketing. Odaberite plan koji odgovara vašem budžetu.'
        : 'Transparent pricing for web development, SEO, hosting and digital marketing. Choose a plan that fits your budget.';

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.luminor.solutions/${canonicalPath}`,
            languages: {
                'en': 'https://www.luminor.solutions/pricing',
                'bs': 'https://www.luminor.solutions/bs/pricing',
                'x-default': 'https://www.luminor.solutions/pricing',
            },
        },
        openGraph: {
            type: 'website',
            title,
            description,
            url: `https://www.luminor.solutions/${canonicalPath}`,
            images: [{ url: 'https://www.luminor.solutions/rocket-hero.png', width: 1200, height: 630 }],
        },
    };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
