'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/navbar/AuthNavbar';
import AuthFooter from '@/components/AuthFooter';
import MainHeader from '@/components/main-header';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Get token from URL params (Supabase redirects with access_token and type)
        const accessToken = searchParams.get('access_token');
        const type = searchParams.get('type');
        const tokenParam = searchParams.get('token');

        // Supabase password reset redirects with access_token and type=recovery
        if (accessToken && type === 'recovery') {
            setToken(accessToken);
        } else if (tokenParam) {
            setToken(tokenParam);
        } else if (accessToken) {
            // Sometimes type might not be present, but access_token is
            setToken(accessToken);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // If we have a token from URL, use it for password reset
            // Supabase password reset flow: user clicks email link -> redirected here with access_token
            if (token) {
                const result = await authApi.resetPassword(password, token);
                setSuccess(true);
                
                // Store the session if returned
                if (result.session) {
                    localStorage.setItem('access_token', result.session.access_token);
                    if (result.session.refresh_token) {
                        localStorage.setItem('refresh_token', result.session.refresh_token);
                    }
                }
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login?password_reset=success');
                }, 2000);
            } else {
                setError('Password reset link is invalid or expired. Please request a new one.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired. Please request a new password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <AuthNavbar currentPage="login" />

            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mt-12 mx-auto px-6 w-full">
                    {/* Row 1: Title and Subtitle */}
                    <MainHeader
                        title="Set a new password"
                        description="Enter your new password below."
                        phases={[]}
                    />

                    {/* Row 2: Reset Password Form */}
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Empty for spacing */}
                        <div className="hidden lg:block"></div>

                        {/* Middle Column - Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-lg p-8">
                                {success ? (
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <svg
                                                className="w-16 h-16 mx-auto text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-semibold text-[#f6f6f6] mb-4">
                                            Password Reset Successful
                                        </h2>
                                        <p className="text-[#f6f6f6]/80 mb-6">
                                            Your password has been successfully reset.
                                        </p>
                                        <p className="text-[#f6f6f6]/60 text-sm">
                                            Redirecting...
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-[#f6f6f6] mb-2"
                                                style={{ fontSize: '16px', fontWeight: 400 }}
                                            >
                                                New Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ fontSize: '16px' }}
                                                placeholder="Enter new password"
                                                minLength={6}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="confirmPassword"
                                                className="block text-[#f6f6f6] mb-2"
                                                style={{ fontSize: '16px', fontWeight: 400 }}
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ fontSize: '16px' }}
                                                placeholder="Confirm new password"
                                                minLength={6}
                                            />
                                        </div>

                                        {error && (
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                                <p className="text-red-400 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full px-4 py-3 bg-[#f6f6f6] text-[#0a0a0a] rounded-lg font-semibold hover:bg-[#f6f6f6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ fontSize: '16px' }}
                                        >
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </button>

                                        <div className="text-center">
                                            <Link
                                                href="/login"
                                                className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
                                                style={{ fontSize: '16px', fontWeight: 400 }}
                                            >
                                                Back to Login
                                            </Link>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Empty for spacing */}
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col bg-transparent">
                <AuthNavbar currentPage="login" />
                <main className="flex-1 py-12 px-6 flex items-center justify-center">
                    <div className="text-[#f6f6f6]">Loading...</div>
                </main>
                <AuthFooter />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

