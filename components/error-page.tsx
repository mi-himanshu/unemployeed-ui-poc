'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import Footer from '@/components/footer';

const ErrorPage: React.FC = () => {
  // Use a safe auth check that won't trigger API calls
  // This prevents infinite redirect loops
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Only check localStorage, don't make API calls
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // User is likely logged in, but we won't verify via API to avoid loops
        setUser({ id: 'user' }); // Minimal user object just for navbar
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Conditional Navbar - Show Navbar if logged in, LandingNavbar if not */}
      {user ? <Navbar /> : <LandingNavbar />}

      {/* Main Content - 500 Error Section */}
      <main className="flex-1 flex flex-col">
        {/* 500 Error Section with Animated Background */}
        <div className="relative flex-1 flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient500" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
                    fill="url(#waveGradient500)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,500 Q400,350 800,500 T1600,500 L1600,800 L0,800 Z"
                    fill="url(#waveGradient500)"
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
            <h1 className="text-[120px] md:text-[180px] font-bold text-white mb-4">500</h1>
            <p className="text-2xl md:text-3xl text-white mb-4">
              Something went wrong on our side.
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              We&apos;re working to fix it — your career journey is too important to pause for long.
            </p>
          </div>
        </div>

        {/* Guidance Section */}
        <div className="bg-[#1a1a1a] py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
              Our servers hit a snag. Please try again in a few minutes. If the issue persists, head back to your dashboard or contact support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <button className="px-8 py-3 bg-[#1a1a1a] border border-white text-white rounded hover:bg-[#2a2a2a] transition-colors">
                  Back To Home
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-[#1a1a1a] border border-[#d32f2f] text-white rounded hover:bg-[#2a2a2a] transition-colors">
                  Contact Support
                </button>
              </Link>
            </div>

            <p className="text-white/60 text-sm italic">
              Even setbacks are part of progress — we&apos;ll get you back on track.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ErrorPage;

