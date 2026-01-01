import { NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  
  // Also check hash fragments (some OAuth flows use them)
  const hash = requestUrl.hash;
  let hashParams: URLSearchParams | null = null;
  if (hash) {
    // Remove # and parse hash as query params
    const hashString = hash.substring(1);
    hashParams = new URLSearchParams(hashString);
  }
  
  // Log all query parameters and hash for debugging
  console.log('[OAuth Callback] ========== CALLBACK RECEIVED ==========');
  console.log('[OAuth Callback] Full callback URL:', requestUrl.toString());
  console.log('[OAuth Callback] Pathname:', requestUrl.pathname);
  console.log('[OAuth Callback] Search:', requestUrl.search);
  console.log('[OAuth Callback] Hash:', hash);
  console.log('[OAuth Callback] Query parameters:', Object.fromEntries(requestUrl.searchParams.entries()));
  if (hashParams && hashParams.toString()) {
    console.log('[OAuth Callback] Hash parameters:', Object.fromEntries(hashParams.entries()));
  }
  console.log('[OAuth Callback] All URL parts:', {
    origin: requestUrl.origin,
    pathname: requestUrl.pathname,
    search: requestUrl.search,
    hash: requestUrl.hash,
    href: requestUrl.href,
  });
  
  // Check for code in hash if not in query
  const codeFromHash = hashParams?.get('code') || hashParams?.get('access_token') || null;
  const errorFromHash = hashParams?.get('error') || null;
  
  // Use code from hash if not in query params
  const finalCode = code || codeFromHash;
  const finalError = error || errorFromHash;

  // Handle OAuth errors from provider
  if (finalError) {
    console.error('[OAuth Callback] OAuth provider error:', finalError, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=oauth_failed&message=${encodeURIComponent(errorDescription || finalError)}`, request.url)
    );
  }

  if (!finalCode) {
    // No code - this usually means:
    // 1. The redirect_to URL is not registered in Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs
    // 2. The user cancelled the OAuth flow
    // 3. There was an error that wasn't passed through
    // 4. The redirect_to URL doesn't match exactly (case, trailing slash, protocol)
    
    const callbackUrl = requestUrl.toString();
    const expectedUrl = 'http://localhost:3000/auth/callback';
    
    console.error('[OAuth Callback] ========== NO CODE RECEIVED ==========');
    console.error('[OAuth Callback] Expected callback URL format: http://localhost:3000/auth/callback');
    console.error('[OAuth Callback] Actual callback URL:', callbackUrl);
    console.error('[OAuth Callback] URL comparison:');
    console.error('  - Origin:', requestUrl.origin);
    console.error('  - Pathname:', requestUrl.pathname);
    console.error('  - Expected origin: http://localhost:3000');
    console.error('  - Expected pathname: /auth/callback');
    console.error('  - Match:', requestUrl.origin === 'http://localhost:3000' && requestUrl.pathname === '/auth/callback');
    console.error('[OAuth Callback] All query parameters:', Object.fromEntries(requestUrl.searchParams.entries()));
    console.error('[OAuth Callback] Hash:', hash);
    if (hashParams && hashParams.toString()) {
      console.error('[OAuth Callback] Hash parameters:', Object.fromEntries(hashParams.entries()));
    }
    console.error('[OAuth Callback] ===========================================');
    console.error('[OAuth Callback] TROUBLESHOOTING STEPS:');
    console.error('1. Go to Supabase Dashboard -> Authentication -> URL Configuration');
    console.error('2. Check "Redirect URLs" section');
    console.error('3. Ensure EXACTLY this URL is listed: http://localhost:3000/auth/callback');
    console.error('   - Must be exact match (no trailing slash)');
    console.error('   - Must use http:// (not https://) for localhost');
    console.error('   - Must include port :3000');
    console.error('4. Save and wait a few seconds for changes to propagate');
    console.error('5. Try OAuth again');
    
    return NextResponse.redirect(
      new URL('/login?error=no_code&message=' + encodeURIComponent('No authorization code received. Check browser console for details. Ensure http://localhost:3000/auth/callback is EXACTLY registered in Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs (no trailing slash, exact match required)'), request.url)
    );
  }

  try {
    // Exchange code for session via API Gateway
    console.log('[OAuth Callback] Exchanging code for session...');
    const callbackUrl = `${GATEWAY_URL}/api/v1/auth/callback?code=${encodeURIComponent(finalCode)}`;
    console.log('[OAuth Callback] Calling:', callbackUrl.replace(finalCode, 'CODE_HIDDEN'));
    
    const response = await fetch(callbackUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[OAuth Callback] Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error('[OAuth Callback] API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[OAuth Callback] Success response:', {
      hasSession: !!data.session,
      hasAccessToken: !!data.session?.access_token,
      hasUser: !!data.user,
      userId: data.user?.id,
    });
    
    // Validate response structure
    if (!data.session?.access_token) {
      console.error('[OAuth Callback] Missing access token in response:', data);
      throw new Error('Invalid response from OAuth callback: missing access token');
    }
    
    // Check if email is verified
    const emailVerified = data.user?.email_verified || false;
    
    // Redirect based on verification status
    const redirectUrl = emailVerified 
      ? new URL('/dashboard', request.url)
      : new URL('/verify-email', request.url);
    
    // Store tokens in query params (will be handled by AuthContext)
    redirectUrl.searchParams.set('token', data.session.access_token);
    if (data.session.refresh_token) {
      redirectUrl.searchParams.set('refresh_token', data.session.refresh_token);
    }
    
    // Add user info for initial state
    if (data.user?.id) {
      redirectUrl.searchParams.set('user_id', data.user.id);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('[OAuth Callback] Error details:', {
      message: error?.message,
      stack: error?.stack,
      error: error,
    });
    const errorMessage = error?.message || 'Failed to complete OAuth authentication';
    // Redirect to login on error with error message
    return NextResponse.redirect(
      new URL(`/login?error=oauth_failed&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}

