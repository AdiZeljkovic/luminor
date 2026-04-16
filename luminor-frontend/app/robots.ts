import { MetadataRoute } from 'next';

// Hardcoded — never pulls arbitrary directives from DB which could break validation
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/portal/'],
            },
        ],
        sitemap: 'https://www.luminor.solutions/sitemap.xml',
        host: 'https://www.luminor.solutions',
    };
}
