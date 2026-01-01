'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import Footer from '@/components/footer';
import { getAccessToken } from '@/lib/auth-storage';

const NotFoundPage: React.FC = () => {
  // Check auth token synchronously on first render to avoid flash
  // This runs immediately, not in useEffect, so there's no delay
  const token = typeof window !== 'undefined' ? getAccessToken() : null;
  const isAuthenticated = !!token;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Conditional Navbar - Show Navbar if logged in, LandingNavbar if not */}
      {isAuthenticated ? <Navbar /> : <LandingNavbar />}

      {/* Main Content - 404 Error Section */}
      <main className="flex-1 flex flex-col">
        {/* 404 Error Section with Animated Background */}
        <div className="relative flex-1 flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
                    fill="url(#waveGradient)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,500 Q400,350 800,500 T1600,500 L1600,800 L0,800 Z"
                    fill="url(#waveGradient)"
                    className="animate-pulse"
                    style={{ animationDelay: '1s' }}
                  />
                </svg>
              </div>
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-[120px] md:text-[180px] font-bold text-white mb-4">404</h1>
            <p className="text-2xl md:text-3xl text-white mb-4">
              Oops — looks like you&apos;re off track.
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist, but your career journey still does.
            </p>
          </div>
        </div>

        {/* Guidance Section */}
        <div className="bg-[#1a1a1a] py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
              Sometimes detours happen. Let&apos;s get you back on the right path. You can return to your dashboard, explore services, or head to our homepage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <button className="px-8 py-3 bg-[#1a1a1a] border border-white text-white rounded hover:bg-[#2a2a2a] transition-colors">
                  Back To Home
                </button>
              </Link>
              {/* <Link href="/">
                <button className="px-8 py-3 bg-[#1a1a1a] border border-[#d32f2f] text-white rounded hover:bg-[#2a2a2a] transition-colors">
                  Explore Services
                </button>
              </Link> */}
            </div>

            <p className="text-white/60 text-sm italic">
              Remember - &quot;Every wrong turn is just another step toward clarity.&quot;
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFoundPage;

