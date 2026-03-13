import { API_URL } from './api';

/**
 * API Client with httpOnly Cookie Support
 * All requests automatically include credentials (cookies)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ApiResponse<T = any> {
    success: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    error?: string;
    errors?: Array<{ msg: string; path: string }>;
    // Allow extra fields returned by some endpoints (e.g. session, pagination)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultOptions: RequestInit = {
            credentials: 'include', // CRITICAL: Send httpOnly cookies
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
            });

            const data = await response.json();

            if (response.status === 401) {
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !endpoint.includes('/auth/')) {
                    window.location.href = '/login';
                }
                throw new Error(data.error || 'Unauthorized');
            }

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
        });
    }

    async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include', // CRITICAL: Send httpOnly cookies
                body: formData,
                // Don't set Content-Type - browser will set it with boundary
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Upload Error [${endpoint}]:`, error);
            throw error;
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_URL);

/**
 * Usage Examples:
 *
 * // GET request
 * const { data } = await apiClient.get('/api/blog');
 *
 * // POST request
 * const { data } = await apiClient.post('/api/blog', { title: 'New Post' });
 *
 * // PUT request
 * const { data } = await apiClient.put('/api/blog/1', { title: 'Updated' });
 *
 * // DELETE request
 * const { data } = await apiClient.delete('/api/blog/1');
 *
 * // File upload
 * const formData = new FormData();
 * formData.append('image', file);
 * const { data } = await apiClient.uploadFile('/api/upload', formData);
 */
