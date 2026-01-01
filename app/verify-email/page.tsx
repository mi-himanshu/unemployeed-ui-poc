'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/navbar/AuthNavbar';
import AuthFooter from '@/components/AuthFooter';
import MainHeader from '@/components/main-header';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';

function VerifyEmailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, signOut } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [verified, setVerified] = useState(false);

    // Check for verification token in URL (from email link)
    useEffect(() => {
        const token = searchParams.get('token');
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type') || 'email'; // Default to 'email' if not specified
        const accessToken = searchParams.get('access_token');
        const code = searchParams.get('code');

        // Handle Supabase redirect after verification (might pass access_token)
        if (accessToken) {
            // Supabase already verified, just store the token and check status
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', accessToken);
            }
            // Reload to update auth state
            window.location.href = '/dashboard';
            return;
        }

        // Handle OAuth code (shouldn't happen here, but handle it)
        if (code) {
            router.push(`/auth/callback?code=${code}`);
            return;
        }

        // Handle email verification token
        if (token && (type === 'email' || type === 'signup')) {
            handleEmailVerification(token, tokenHash || undefined, type);
        } else if (user?.email) {
            setEmail(user.email);
            // Check if already verified
            checkVerificationStatus();
        } else if (!token) {
            // No user and no token - redirect to login
            router.push('/login');
        }
    }, [searchParams, user, router]);

    const checkVerificationStatus = async () => {
        if (!user) return;
        
        try {
            const result = await authApi.checkEmailVerification();
            if (result.email_verified) {
                setVerified(true);
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
        }
    };

    const handleEmailVerification = async (token: string, tokenHash?: string, type: string = 'email') => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Try verification with the provided type first
        const tryVerification = async (verifyType: string): Promise<{ user: any; session: any } | null> => {
            try {
                console.log('Verifying email with token, type:', verifyType);
                const result = await authApi.verifyEmail(token, tokenHash, verifyType);
                console.log('Verification result:', result);
                return result;
            } catch (err: any) {
                console.error(`Verification failed with type=${verifyType}:`, err);
                return null;
            }
        };

        try {
            // Try with the provided type first
            let result = await tryVerification(type);
            
            // If that fails and type was 'email', try 'signup'
            if (!result && type === 'email') {
                console.log('Retrying with type=signup');
                result = await tryVerification('signup');
            }
            
            if (!result) {
                throw new Error('Failed to verify email with both type=email and type=signup. The link may have expired.');
            }
            
            if (result.session) {
                // Store session
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', result.session.access_token);
                    if (result.session.refresh_token) {
                        localStorage.setItem('refresh_token', result.session.refresh_token);
                    }
                }
                
                // Check if email is verified
                if (result.user?.email_verified) {
                    setSuccess('Email verified successfully! Redirecting to dashboard...');
                    setVerified(true);
                    // Redirect to dashboard
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    // Session created but email not verified - reload to check status
                    setSuccess('Session created. Checking verification status...');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                }
                return;
            }

            // Check if email is verified even without session
            if (result.user?.email_verified) {
                setSuccess('Email verified successfully! Please log in to continue.');
                setVerified(true);
                // Redirect to login to get a session
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError('Email verification completed but verification status is unclear. Please try logging in.');
            }
        } catch (err: any) {
            console.error('Email verification error:', err);
            setError(err.message || 'Failed to verify email. The link may have expired. Please try resending the verification email.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        const emailToUse = email || user?.email;
        if (!emailToUse) {
            setError('Email address is required');
            return;
        }

        setResending(true);
        setError(null);
        setSuccess(null);

        try {
            await authApi.resendVerificationEmail(emailToUse);
            setSuccess('Verification email sent! Please check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (verified) {
        return (
            <div className="min-h-screen flex flex-col bg-transparent relative">
                <AnimatedBackground gradientId="waveGradientVerifyEmail" />
                <AuthNavbar currentPage="verify" />
                <main className="flex-1 py-12 px-6 flex items-center justify-center">
                    <div className="max-w-md w-full text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#f6f6f6] mb-4">Email Verified!</h2>
                        <p className="text-[#f6f6f6]/80 mb-6">Your email has been successfully verified. Redirecting to dashboard...</p>
                    </div>
                </main>
                <AuthFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent relative">
            <AnimatedBackground gradientId="waveGradientVerifyEmail" />
            <AuthNavbar currentPage="verify" />
            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mt-12 mx-auto px-6 w-full">
                    <MainHeader
                        title="Verify Your Email"
                        description="We've sent a verification link to your email address. Please click the link in the email to verify your account."
                        phases={[]}
                    />

                    <div className="flex justify-center mb-8">
                        <div className="wrapper-container max-w-2xl w-full">
                            {error && (
                                <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="w-full mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 rounded text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm p-6">
                                <div className="mb-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <svg className="h-12 w-12 text-[#f6f6f6]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#f6f6f6] mb-2 text-center">
                                        Check Your Email
                                    </h3>
                                    <p className="text-[#f6f6f6]/80 text-center mb-4">
                                        We've sent a verification link to:
                                    </p>
                                    <p className="text-[#f6f6f6] font-medium text-center mb-6">
                                        {email || user?.email || 'your email address'}
                                    </p>
                                    <p className="text-[#f6f6f6]/60 text-sm text-center">
                                        Click the link in the email to verify your account. The link will expire in 24 hours.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#f6f6f6] mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email || user?.email || ''}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                                            disabled={!!user?.email}
                                        />
                                    </div>

                                    <button
                                        onClick={handleResendVerification}
                                        disabled={resending || loading}
                                        className="w-full py-3 px-6 rounded-sm text-[#f6f6f6] text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border border-[#f6f6f6]/20"
                                    >
                                        {resending ? 'Sending...' : 'Resend Verification Email'}
                                    </button>

                                    <div className="pt-4 border-t border-[#f6f6f6]/10">
                                        <p className="text-[#f6f6f6]/60 text-sm text-center mb-4">
                                            Already verified?{' '}
                                            <Link
                                                href="/dashboard"
                                                className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 underline"
                                            >
                                                Go to Dashboard
                                            </Link>
                                        </p>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full py-2 px-4 text-sm text-[#f6f6f6]/60 hover:text-[#f6f6f6] transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <AuthFooter />
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col bg-transparent relative">
                <AnimatedBackground gradientId="waveGradientVerifyEmail" />
                <AuthNavbar currentPage="verify" />
                <main className="flex-1 py-12 px-6 flex items-center justify-center">
                    <div className="text-[#f6f6f6]">Loading...</div>
                </main>
                <AuthFooter />
            </div>
        }>
            <VerifyEmailPageContent />
        </Suspense>
    );
}

