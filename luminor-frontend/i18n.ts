import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'bs'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request
    let locale = await requestLocale;

    // Validate the locale
    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
