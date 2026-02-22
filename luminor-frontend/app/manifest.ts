import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Luminor Solutions - Digital Agency',
        short_name: 'Luminor',
        description: 'Transform your business with cutting-edge digital solutions. Expert web development, SEO, and marketing services.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        categories: ['business', 'productivity', 'marketing'],
        screenshots: [
            {
                src: '/screenshot-mobile.png',
                sizes: '540x720',
                type: 'image/png',
                form_factor: 'narrow',
            },
            {
                src: '/screenshot-desktop.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide',
            },
        ],
    };
}
