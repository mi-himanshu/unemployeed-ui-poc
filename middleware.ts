import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication middleware
 * Handles redirects for authenticated and unauthenticated users
 */

// Pages that require authentication (redirect to login if not authenticated)
const PROTECTED_PAGES = [
  '/dashboard',
  '/roadmap',
  '/diagnostics',
  '/account',
  '/profile',
];

// Auth pages (redirect to dashboard if already authenticated)
const AUTH_PAGES = [
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

// Public pages (accessible to everyone)
const PUBLIC_PAGES = [
  '/',
  '/about',
  '/contact',
  '/error',
];

/**
 * Check if user has authentication token
 */
function hasAuthToken(request: NextRequest): boolean {
  // Check cookies first (for persistence)
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) {
    return true;
  }
  
  // Note: We can't check localStorage in middleware (it's client-side only)
  // But cookies are checked, which is the primary storage method
  return false;
}

/**
 * Check if path matches any of the given patterns
 */
function matchesPath(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => pathname.startsWith(pattern));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthToken(request);

  // Handle auth pages - redirect to dashboard if already logged in
  if (matchesPath(pathname, AUTH_PAGES)) {
    if (isAuthenticated) {
      // User is logged in, redirect to dashboard
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // User is not logged in, allow access to auth pages
    return NextResponse.next();
  }

  // Handle protected pages - redirect to login if not authenticated
  if (matchesPath(pathname, PROTECTED_PAGES)) {
    if (!isAuthenticated) {
      // User is not logged in, redirect to login
      const loginUrl = new URL('/login', request.url);
      // Store the original URL to redirect back after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // User is authenticated, allow access
    return NextResponse.next();
  }

  // Public pages - allow access regardless of auth status
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};



