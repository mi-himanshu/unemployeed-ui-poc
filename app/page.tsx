'use client';

import React from 'react';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import LandingHero from '@/components/landing-hero';
import LandingFooter from '@/components/landing-footer';

export default function Home() {
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
      <LandingNavbar />
      
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



