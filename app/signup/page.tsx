'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthNavbar from '@/components/navbar/AuthNavbar';
import AuthFooter from '@/components/AuthFooter';
import MainHeader from '@/components/main-header';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/error-messages';

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithOAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                duration: 4000,
            });
            toast('Please make sure both password fields match.', {
                icon: '💡',
                duration: 4000,
            });
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            toast.error('Password is too short', {
                duration: 4000,
            });
            toast('Please use a password that is at least 6 characters long.', {
                icon: '💡',
                duration: 4000,
            });
            setLoading(false);
            return;
        }

        try {
            const { error } = await signUp(email, password);
            if (error) {
                const errorInfo = getErrorMessage(error, 'signup');
                toast.error(errorInfo.userMessage, {
                    duration: 6000,
                });
                if (errorInfo.actionMessage) {
                    setTimeout(() => {
                        toast(errorInfo.actionMessage!, {
                            icon: '💡',
                            duration: 5000,
                        });
                    }, 1000);
                }
            } else {
                setSuccess(true);
                toast.success('Account created successfully!', {
                    duration: 3000,
                });
                toast('Please check your email to verify your account.', {
                    icon: '📧',
                    duration: 4000,
                });
                // Redirect to email verification page
                setTimeout(() => {
                    router.push('/verify-email');
                }, 2000);
            }
        } catch (err: any) {
            const errorInfo = getErrorMessage(err, 'signup');
            toast.error(errorInfo.userMessage, {
                duration: 6000,
            });
            if (errorInfo.actionMessage) {
                setTimeout(() => {
                    toast(errorInfo.actionMessage!, {
                        icon: '💡',
                        duration: 5000,
                    });
                }, 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
        try {
            await signInWithOAuth(provider);
            // OAuth redirects automatically
        } catch (err: any) {
            const errorInfo = getErrorMessage(err, 'oauth');
            toast.error(errorInfo.userMessage, {
                duration: 6000,
            });
            if (errorInfo.actionMessage) {
                setTimeout(() => {
                    toast(errorInfo.actionMessage!, {
                        icon: '💡',
                        duration: 5000,
                    });
                }, 1000);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <AuthNavbar currentPage="signup" />

            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mt-12 mx-auto px-6 w-full">
                    {/* Row 1: Title and Subtitle */}
                    <MainHeader
                        title="Begin your journey from stuck to unstoppable."
                        description="Create your account to unlock AI-powered diagnostics, resume tools, and a guided career roadmap designed just for you."
                        phases={[]}
                    />

                    {/* Row 2: Three Column Layout */}
                    <div className="flex justify-center mb-8">
                        <div className="wrapper-container">
                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full max-w-5xl">
                                {/* Left Column - Sign Up Form */}
                                <div className="flex flex-col items-center justify-center w-full md:w-80">
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-1 w-full">
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Use your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                                                style={{ fontSize: '16px' }}
                                                required
                                                disabled={loading || success}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                                                style={{ fontSize: '16px' }}
                                                required
                                                disabled={loading || success}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                                                style={{ fontSize: '16px' }}
                                                required
                                                disabled={loading || success}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || success}
                                            className="w-full py-3 px-6 mt-2 rounded-sm text-[#f6f6f6] text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: '#dc2626' }}
                                        >
                                            {loading ? 'Creating account...' : success ? 'Account created!' : 'Sign Up & Start Evolving'}
                                        </button>
                                    </form>
                                </div>

                                {/* Middle Column - "or" separator */}
                                <div className="flex items-center justify-center w-fit">
                                    <span className="text-[#f6f6f6]/60 font-medium" style={{ fontSize: '16px' }}>or</span>
                                </div>

                                {/* Right Column - OAuth Buttons */}
                                <div className="flex flex-col gap-1 justify-center w-full md:w-80">
                                    <button
                                        onClick={() => handleOAuthSignIn('google')}
                                        disabled={loading || success}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontSize: '16px' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Sign up with Google
                                    </button>
                                    <button
                                        onClick={() => handleOAuthSignIn('apple')}
                                        disabled={loading || success}
                                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontSize: '16px' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.56-.65-2.53-1.16-2.53-1.96 0-.72.73-1.18 1.48-1.65.9-.55 1.83-1.12 2.93-1.8 1.95-1.2 3.05-2.5 3.05-4.2 0-2.01-1.74-3.57-4.5-3.57-1.98 0-3.63.54-4.8 1.58l-.88-.7C4.68 4.9 6.78 4 9.2 4c3.58 0 6.32 2.03 6.32 5.32 0 2.4-1.37 4.24-3.37 5.72l-.01-.01c-.81.5-1.55.95-2.18 1.43-.35.27-.6.5-.6.82 0 .37.27.65.6.82.7.42 1.63.77 2.54 1.14l.7.3z" />
                                        </svg>
                                        Sign up with Apple Account
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Row 3: Navigation to Login */}
                    <div className="text-center">
                        <span className="text-[#f6f6f6]/80" style={{ fontSize: '16px', fontWeight: 400 }}>
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors underline"
                                style={{ fontSize: '16px', fontWeight: 400 }}
                            >
                                Log in to continue your journey.
                            </Link>
                        </span>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}

