/**
 * Authentication token storage utilities
 * Uses cookies for persistence with localStorage as fallback
 */

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expires_at';

// Cookie expiration: 5 days
const COOKIE_MAX_AGE = 5 * 24 * 60 * 60; // 5 days in seconds

/**
 * Set a cookie with secure defaults
 */
function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  if (typeof document === 'undefined') return;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = window.location.protocol === 'https:' || isProduction;
  
  // Set cookie with secure flags
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; ${isSecure ? 'SameSite=Strict; Secure;' : 'SameSite=Lax;'}`;
}

/**
 * Get a cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Delete a cookie
 */
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Store authentication tokens in both cookies and localStorage
 */
export function storeAuthTokens(accessToken: string, refreshToken?: string, expiresAt?: number) {
  if (typeof window === 'undefined') return;
  
  // Store in cookies (for persistence across sessions)
  setCookie(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) {
    setCookie(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (expiresAt) {
    setCookie(TOKEN_EXPIRY_KEY, expiresAt.toString());
  }
  
  // Also store in localStorage as fallback
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (expiresAt) {
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
  }
}

/**
 * Get access token (checks cookies first, then localStorage)
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try cookie first
  const cookieToken = getCookie(AUTH_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  
  // Fallback to localStorage
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get refresh token (checks cookies first, then localStorage)
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try cookie first
  const cookieToken = getCookie(REFRESH_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  
  // Fallback to localStorage
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get token expiration timestamp
 */
export function getTokenExpiresAt(): number | null {
  if (typeof window === 'undefined') return null;
  
  const cookieExpiry = getCookie(TOKEN_EXPIRY_KEY);
  if (cookieExpiry) {
    const expiry = parseInt(cookieExpiry, 10);
    if (!isNaN(expiry)) return expiry;
  }
  
  const storageExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (storageExpiry) {
    const expiry = parseInt(storageExpiry, 10);
    if (!isNaN(expiry)) return expiry;
  }
  
  return null;
}

/**
 * Check if token is expired or will expire soon (within 5 minutes)
 */
export function isTokenExpired(): boolean {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return false; // No expiry info, assume valid
  
  // Check if token expires within 5 minutes
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  return expiresAt < fiveMinutesFromNow;
}

/**
 * Clear all authentication tokens
 */
export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  
  // Clear cookies
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(TOKEN_EXPIRY_KEY);
  
  // Clear localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

