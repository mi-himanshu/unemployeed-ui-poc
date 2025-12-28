'use client';

import React from 'react';
import Link from 'next/link';
import { LandingService } from '@/types/landing';

interface LandingHeroProps {
  services: LandingService[];
  landingText: {
    line1: Array<{ text: string; isHighlighted: boolean }>;
    line2: string;
    line3: string;
    description: string;
    ctaText: string;
    finalText: string;
  };
}

const LandingHero: React.FC<LandingHeroProps> = ({ services, landingText }) => {
  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 w-full">
        {/* Left Column - Services */}
        <div className="flex flex-col mb-[100px]">
          <h2 
            className="text-white text-[20px] tracking-widest font-medium mb-6"
          >
            Services
          </h2>
          <div className="flex flex-col gap-1">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                onClick={scrollToServices}
                className="px-4 py-3 rounded-sm border border-[#f6f6f6]/20 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors text-left"
                style={{ fontSize: '16px', fontWeight: 400 }}
              >
                {service.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Landing Text */}
        <div className="flex flex-col items-center w-full">
          <div className="w-[70%] flex flex-col items-center">
            <h1 
              className="text-white mb-6 text-center"
              style={{ 
                fontSize: '30px', 
                fontWeight: 600, 
                fontFamily: 'Montserrat, sans-serif' 
              }}
            >
              Step On The Journey To Evolution With AI-Powered Roadmaps
            </h1>
            
            <p className="text-white mb-6 text-center">
              Discover barriers, build resumes, acquire skills, and move forward with clarity — guided by AI‑powered roadmaps and a supportive community.
            </p>

            <div className="flex flex-row gap-1 items-center">
              <button
                className="w-12 h-12 rounded-sm border border-[#f6f6f6]/20 flex items-center justify-center hover:bg-[#f6f6f6]/10 transition-colors"
                aria-label="Scroll down"
              >↓
              </button>
              <Link href="/diagnostics">
                <button
                  className="px-6 py-3 rounded-sm text-[#f6f6f6] font-medium transition-all hover:opacity-90 border border-[#f6f6f6]/20"
                  style={{ fontSize: '16px' }}
                >
                  {landingText.ctaText}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;

