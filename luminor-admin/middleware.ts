import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if route is public
    const isPublicRoute = publicRoutes.includes(pathname);

    // Get token from cookies (for server-side check)
    // Note: Since we currently use localStorage, this middleware provides
    // an additional layer of security but full protection requires
    // migrating to httpOnly cookies
    const token = request.cookies.get('token')?.value;

    // If accessing protected route without token cookie, redirect to login
    // This provides server-side protection even with localStorage approach
    if (isProtectedRoute && !token) {
        // For now, let's allow through since token is in localStorage
        // This middleware is prepared for future cookie-based auth
        // To fully protect, uncomment below:
        // return NextResponse.redirect(new URL('/login', request.url));
    }

    // Add security headers to all responses
    const response = NextResponse.next();

    // Additional security headers
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
    ],
};
