'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthNavbar from '@/components/navbar/AuthNavbar';
import AuthFooter from '@/components/AuthFooter';
import MainHeader from '@/components/main-header';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!email) {
            setError('Email is required');
            setLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset email. Please try again.');
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
                        title="Reset your password"
                        description="Enter your email address and we'll send you a link to reset your password."
                        phases={[]}
                    />

                    {/* Row 2: Forgot Password Form */}
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
                                            Check your email
                                        </h2>
                                        <p className="text-[#f6f6f6]/80 mb-6">
                                            We've sent a password reset link to <strong>{email}</strong>
                                        </p>
                                        <p className="text-[#f6f6f6]/60 text-sm mb-6">
                                            Click the link in the email to reset your password. If you don't see it, check your spam folder.
                                        </p>
                                        <p className="text-[#f6f6f6]/60 text-sm">
                                            Redirecting to login...
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-[#f6f6f6] mb-2"
                                                style={{ fontSize: '16px', fontWeight: 400 }}
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ fontSize: '16px' }}
                                                placeholder="Enter your email"
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
                                            {loading ? 'Sending...' : 'Send Reset Link'}
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


