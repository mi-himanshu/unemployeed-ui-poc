import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    // No code, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Exchange code for session via API Gateway
    const response = await fetch(`${GATEWAY_URL}/api/v1/auth/callback?code=${code}`);
    
    if (!response.ok) {
      throw new Error('Failed to exchange code for session');
    }

    const data = await response.json();
    
    // Store session in cookies or return to client
    // The AuthContext will handle storing the token
    // For now, we'll redirect with the token in a query param (not ideal, but works)
    // In production, you might want to use httpOnly cookies set by the gateway
    
    // Check if email is verified
    const emailVerified = data.user?.email_verified || false;
    
    // Redirect based on verification status
    const redirectUrl = emailVerified 
      ? new URL('/dashboard', request.url)
      : new URL('/verify-email', request.url);
    
    if (data.session?.access_token) {
      // Store token in sessionStorage via client-side redirect
      redirectUrl.searchParams.set('token', data.session.access_token);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    // Redirect to login on error
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }
}

