import { API_URL } from './api';

export async function getSiteSettings() {
    try {
        const res = await fetch(`${API_URL}/api/settings`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds
        });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Failed to fetch site settings:', error);
        return null;
    }
}

