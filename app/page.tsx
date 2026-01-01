'use client';

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import LandingHero from '@/components/landing-hero';
import LandingFooter from '@/components/landing-footer';
import { getAccessToken } from '@/lib/auth-storage';

export default function Home() {
  // Check auth token synchronously on first render to avoid flash
  // This runs immediately, not in useEffect, so there's no delay
  const token = typeof window !== 'undefined' ? getAccessToken() : null;
  const isAuthenticated = !!token;
  const landingServices = [
    {
      id: 'resume-builder',
      name: 'Resume Builder',
      href: '#services',
    },
    {
      id: 'stats-diagnosis',
      name: 'Stats Diagnosis',
      href: '#services',
    },
    {
      id: 'focused-roadmap',
      name: 'Focused Roadmap',
      href: '#services',
    },
    {
      id: 'extra-resources',
      name: 'Extra Resources',
      href: '#services',
    },
  ];

  const landingText = {
    line1: [
      { text: 'Step On The ', isHighlighted: false },
      { text: 'Journey', isHighlighted: true },
      { text: ' To Evolution With AI-Powered ', isHighlighted: false },
      { text: 'Roadmaps', isHighlighted: true },
    ],
    line2: 'Discover barriers, build resumes, acquire skills, and move forward with clarity',
    line3: '— guided by AI-powered roadmaps and a supportive community.',
    description: 'Comprehensive career preparation tools and resources to help you land your dream job',
    ctaText: 'Start Evolving',
    finalText: 'Scroll for more',
  };

  const landingQuote = '"Comprehensive career preparation tools and resources to help you land your dream job"';

  return (
    <div className="h-screen flex flex-col bg-transparent overflow-hidden relative z-10">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Red wave-like shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradientLanding" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
                fill="url(#waveGradientLanding)"
                className="animate-pulse"
              />
              <path
                d="M0,500 Q400,350 800,500 T1600,500 L1600,800 L0,800 Z"
                fill="url(#waveGradientLanding)"
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

      {/* Conditional Navbar - Show Navbar if logged in, LandingNavbar if not */}
      {isAuthenticated ? <Navbar /> : <LandingNavbar />}
      
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Upper Row - Hero Section */}
        <div className="flex-1 flex items-center">
          <LandingHero 
            services={landingServices}
            landingText={landingText}
          />
        </div>

        {/* Bottom Row - Footer */}
        <LandingFooter quote={landingQuote} />
      </main>
    </div>
  );
}




