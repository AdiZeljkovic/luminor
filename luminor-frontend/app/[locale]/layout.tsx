import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Outfit, Space_Grotesk } from "next/font/google";
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
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import ChatWidget from "@/components/LiveChat/ChatWidget";
import { getSiteSettings } from "@/lib/getSettings";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import AnnouncementBanner from "@/components/AnnouncementBanner";


const beVietnamPro = Be_Vietnam_Pro({
    variable: "--font-primary",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo.default' });
    const settings = await getSiteSettings();

    const baseUrl = 'https://www.luminor.solutions';
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
        appleWebApp: {
            capable: true,
            statusBarStyle: 'black-translucent',
            title: 'Luminor',
        },
        alternates: {
            canonical: locale === defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
            languages: {
                'en': baseUrl,
                'bs': `${baseUrl}/bs`,
                'hr': `${baseUrl}/bs`, // Croatian users see Bosnian version
                'sr': `${baseUrl}/bs`, // Serbian users see Bosnian version
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
                "msvalidate.01": settings?.bing_site_verification ? [settings.bing_site_verification] : [],
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
                url: settings?.og_image_url || 'https://www.luminor.solutions/OG.jpg',
                width: 1200,
                height: 630,
                alt: siteTitle
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: siteTitle,
            description: siteDesc,
            images: [settings?.og_image_url || 'https://www.luminor.solutions/OG.jpg'],
            creator: '@LuminorSolutions',
            site: '@LuminorSolutions',
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
                <body className={`${beVietnamPro.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
                    <MaintenanceScreen />
                </body>
            </html>
        );
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* Organization JSON-LD — sitewide structured data for Google */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "Luminor Solutions",
                        "url": "https://www.luminor.solutions",
                        "logo": "https://www.luminor.solutions/luminor-logo.png",
                        "image": "https://www.luminor.solutions/rocket-hero.png",
                        "description": "Full-service digital agency based in Sarajevo, Bosnia. Custom web development, SEO, digital marketing, branding and AI automation for clients worldwide.",
                        "telephone": "+38762574783",
                        "email": "info@luminor.solutions",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Porodice Ribar 39",
                            "addressLocality": "Sarajevo",
                            "postalCode": "71000",
                            "addressCountry": "BA"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 43.8563,
                            "longitude": 18.4131
                        },
                        "areaServed": [
                            { "@type": "Country", "name": "Bosnia and Herzegovina" },
                            { "@type": "Country", "name": "Germany" },
                            { "@type": "Country", "name": "United States" },
                            { "@type": "Country", "name": "Croatia" },
                            { "@type": "Country", "name": "Serbia" },
                            { "@type": "Continent", "name": "Europe" }
                        ],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Digital Services",
                            "itemListElement": [
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Development" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Optimization" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Marketing" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphic Design & Branding" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Automation" } },
                                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Hosting" } }
                            ]
                        },
                        "sameAs": [
                            "https://www.facebook.com/luminor.solutions",
                            "https://www.instagram.com/luminor.solutions",
                            "https://www.linkedin.com/company/luminor-solutions"
                        ],
                        "priceRange": "$$",
                        "openingHours": "Mo-Fr 09:00-17:00",
                        "foundingDate": "2022"
                    }) }}
                />
                {/* Preconnect to API for faster data fetching */}
                <link rel="preconnect" href="https://api.luminor.solutions" />
                <link rel="dns-prefetch" href="https://api.luminor.solutions" />
                {/* Google Tag Manager — must be as high in <head> as possible */}
                {settings?.google_tag_manager_id && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${settings.google_tag_manager_id}');`
                        }}
                    />
                )}
                {/* Google Analytics 4 */}
                {settings?.google_analytics_id && (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.google_analytics_id}');`
                            }}
                        />
                    </>
                )}
            </head>
            <body className={`${beVietnamPro.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
                {/* Google Tag Manager (noscript) — immediately after <body> per GTM docs */}
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
                            "url": "https://www.luminor.solutions",
                            "logo": settings?.logo_url || "https://www.luminor.solutions/logo.png",
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
                    <a href="#main-content" className="skip-to-main">Skip to main content</a>
                    <AnalyticsTracker />
                    {/* Announcement Banner */}
                    {settings?.announcement_active && settings?.announcement_message && (
                        <AnnouncementBanner
                            message={settings.announcement_message}
                            link={settings.announcement_link}
                        />
                    )}
                    <Header />
                    <main id="main-content">{children}</main>
                    <Footer />
                    <RegionPrompt />
                    <CookieConsent />
                    <LeadMagnetPopup />
                    <ChatWidget />
                </NextIntlClientProvider>

                {/* Facebook Pixel */}
                {settings?.facebook_pixel_id && (
                    <Script id="facebook-pixel" strategy="afterInteractive">
                        {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${settings.facebook_pixel_id}');
                        fbq('track', 'PageView');
                        `}
                    </Script>
                )}
            </body>
        </html>
    );
}
