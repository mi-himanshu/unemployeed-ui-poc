'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { userApi, UserProfile, authApi } from '@/lib/api';

// API Gateway URL
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

interface User {
  id: string;
  email?: string;
  phone?: string;
  email_verified?: boolean;
  email_confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

interface Session {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  emailVerified: boolean | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  // Store token in localStorage
  const storeSession = (sessionData: Session, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', sessionData.access_token);
      if (sessionData.refresh_token) {
        localStorage.setItem('refresh_token', sessionData.refresh_token);
      }
    }
    setSession(sessionData);
    setUser(userData);
  };

  // Clear session from localStorage
  const clearSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setEmailVerified(null);
  };

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await userApi.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      setEmailVerified(false);
      return false;
    }

    try {
      const result = await authApi.checkEmailVerification();
      setEmailVerified(result.email_verified);
      return result.email_verified;
    } catch (error) {
      console.error('Error checking email verification:', error);
      setEmailVerified(false);
      return false;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Check for OAuth token in URL (from callback)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('token');
        const refreshToken = urlParams.get('refresh_token');
        
        if (oauthToken) {
          // Store tokens and remove from URL
          localStorage.setItem('auth_token', oauthToken);
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          window.history.replaceState({}, '', window.location.pathname);
          
          // Get session data
          try {
            const response = await fetch(`${GATEWAY_URL}/api/v1/auth/session`, {
              headers: {
                'Authorization': `Bearer ${oauthToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              setSession({ 
                access_token: oauthToken,
                refresh_token: refreshToken || undefined
              });
              setEmailVerified(data.user?.email_verified || false);
              await refreshProfile();
              await checkEmailVerification();
            } else {
              console.error('Failed to get OAuth session:', response.statusText);
            }
          } catch (error) {
            console.error('Error getting OAuth session:', error);
          } finally {
            setLoading(false);
          }
          return;
        }
      }

      // Check for existing token in localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${GATEWAY_URL}/api/v1/auth/session`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Get refresh token from localStorage if available
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
          setSession({ 
            access_token: token,
            refresh_token: refreshToken || undefined
          });
          setEmailVerified(data.user?.email_verified || false);
          await refreshProfile();
          await checkEmailVerification();
        } else {
          clearSession();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${GATEWAY_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Failed to sign in' } };
      }

      storeSession(data.session, data.user);
      setEmailVerified(data.user?.email_verified || false);
      
      // Check verification status
      await checkEmailVerification();
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Get the frontend URL for email redirect
      const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectTo = `${frontendUrl}/verify-email`;
      
      const response = await fetch(`${GATEWAY_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, redirect_to: redirectTo }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Failed to create account' } };
      }

      // If session is returned, store it
      if (data.session) {
        storeSession(data.session, data.user);
        setEmailVerified(data.user?.email_verified || false);
      } else {
        // Some signup flows require email verification
        setUser(data.user);
        setEmailVerified(data.user?.email_verified || false);
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      try {
        await fetch(`${GATEWAY_URL}/api/v1/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }

    clearSession();
  };

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('[OAuth] Initiating OAuth flow:', {
        provider,
        redirectTo,
        gatewayUrl: GATEWAY_URL,
      });
      
      const oauthUrl = `${GATEWAY_URL}/api/v1/auth/oauth/${provider}?redirect_to=${encodeURIComponent(redirectTo)}`;
      console.log('[OAuth] Requesting OAuth URL from gateway:', oauthUrl);
      
      const response = await fetch(oauthUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('[OAuth] Failed to get OAuth URL:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(errorData.detail || 'Failed to initiate OAuth');
      }

      const data = await response.json();
      console.log('[OAuth] Received OAuth URL, redirecting to:', data.url);
      
      // Redirect to OAuth URL
      window.location.href = data.url;
    } catch (error: any) {
      console.error('[OAuth] Error initiating OAuth:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    emailVerified,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshProfile,
    checkEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

