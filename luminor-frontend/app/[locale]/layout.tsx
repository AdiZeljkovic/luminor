import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script"; // Added Import
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n';
import { setRequestLocale } from 'next-intl/server';
import RegionPrompt from "@/components/RegionPrompt";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CookieConsent from "@/components/CookieConsent";
import { getSiteSettings } from "@/lib/getSettings";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import AnnouncementBanner from "@/components/AnnouncementBanner";

interface SiteSettings {
    site_title?: string;
    site_description?: string;
    site_keywords?: string;
    google_site_verification?: string;
    bing_site_verification?: string;
    yandex_verification?: string;
    baidu_verification?: string;
    og_image_url?: string;
    google_analytics_id?: string;
    google_tag_manager_id?: string;

    // Schema
    schema_type?: string;
    business_name?: string;
    logo_url?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_linkedin?: string;
    social_twitter?: string;
    price_range?: string;
    opening_hours?: string;
    geo_latitude?: string;
    geo_longitude?: string;
    maintenance_mode?: boolean;
    announcement_active?: boolean;
    announcement_message?: string;
    announcement_link?: string;
}

const beVietnamPro = Be_Vietnam_Pro({
    variable: "--font-primary",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.default' });
    const settings = await getSiteSettings();

    const baseUrl = 'https://luminor.solutions';
    const siteTitle = settings?.site_title || t('title');
    const siteDesc = settings?.site_description || t('description');
    const keywords = settings?.site_keywords
        ? settings.site_keywords.split(',')
        : t('keywords').split(',').map(k => k.trim());

    return {
        title: {
            default: siteTitle,
            template: `%s | ${siteTitle}`
        },
        description: siteDesc,
        keywords: keywords,
        authors: [{ name: siteTitle }],
        alternates: {
            canonical: locale === defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
            languages: {
                'en': baseUrl,
                'bs': `${baseUrl}/bs`,
                'x-default': baseUrl,
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        verification: {
            google: settings?.google_site_verification || undefined,
            other: {
                "bing-analysis": settings?.bing_site_verification ? [settings.bing_site_verification] : [],
                "yandex-verification": settings?.yandex_verification ? [settings.yandex_verification] : [],
                "baidu-site-verification": settings?.baidu_verification ? [settings.baidu_verification] : [],
            },
        },
        openGraph: {
            type: "website",
            locale: locale === 'bs' ? 'bs_BA' : 'en_US',
            siteName: siteTitle,
            title: siteTitle,
            description: siteDesc,
            images: [{
                url: settings?.og_image_url || 'https://luminor.solutions/images/og-default.png',
                width: 1200,
                height: 630,
                alt: siteTitle
            }],
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const messages = await getMessages();
    const settings = await getSiteSettings();

    // Check Maintenance Mode
    if (settings?.maintenance_mode) {
        return (
            <html lang={locale}>
                <body className={`${beVietnamPro.variable} antialiased`}>
                    <MaintenanceScreen />
                </body>
            </html>
        );
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* Hreflang tags for SEO */}
                <link rel="alternate" hrefLang="en" href="https://luminor.solutions" />
                <link rel="alternate" hrefLang="bs" href="https://luminor.solutions/bs" />
                <link rel="alternate" hrefLang="x-default" href="https://luminor.solutions" />
            </head>
            <body className={`${beVietnamPro.variable} antialiased`}>
                {/* Google Tag Manager (noscript) */}
                {settings?.google_tag_manager_id && (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                )}

                {/* Structured Data (JSON-LD) */}
                <script
                    id="schema-org"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": settings?.schema_type || "Organization",
                            "name": settings?.business_name || settings?.site_title || "Luminor.Solutions",
                            "url": "https://luminor.solutions",
                            "logo": settings?.logo_url || "https://luminor.solutions/logo.png",
                            "description": settings?.site_description,
                            "email": settings?.contact_email || "info@luminor.solutions",
                            "telephone": settings?.contact_phone || "+387 62 574 783",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": settings?.contact_address?.split(',')[0] || "Porodice Ribar 39",
                                "addressLocality": "Sarajevo",
                                "postalCode": "71000",
                                "addressCountry": "BA"
                            },
                            "sameAs": [
                                settings?.social_facebook,
                                settings?.social_instagram,
                                settings?.social_linkedin,
                                settings?.social_twitter
                            ].filter(Boolean),
                            // LocalBusiness specific
                            ...(settings?.schema_type === 'LocalBusiness' || settings?.schema_type === 'ProfessionalService' ? {
                                "priceRange": settings?.price_range || "$$",
                                "openingHours": settings?.opening_hours || "Mo-Fr 09:00-17:00",
                                "geo": {
                                    "@type": "GeoCoordinates",
                                    "latitude": settings?.geo_latitude,
                                    "longitude": settings?.geo_longitude
                                }
                            } : {})
                        })
                    }}
                />

                <NextIntlClientProvider messages={messages}>
                    <AnalyticsTracker />
                    {/* Announcement Banner */}
                    {settings?.announcement_active && settings?.announcement_message && (
                        <AnnouncementBanner
                            message={settings.announcement_message}
                            link={settings.announcement_link}
                        />
                    )}
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <RegionPrompt />
                    <CookieConsent />
                </NextIntlClientProvider>

                {/* Google Analytics 4 */}
                {settings?.google_analytics_id && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${settings.google_analytics_id}');
                            `}
                        </Script>
                    </>
                )}

                {/* Google Tag Manager */}
                {settings?.google_tag_manager_id && (
                    <Script id="google-tag-manager" strategy="afterInteractive">
                        {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
                        `}
                    </Script>
                )}
            </body>
        </html>
    );
}
