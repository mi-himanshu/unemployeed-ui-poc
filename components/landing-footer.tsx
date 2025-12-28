import React from 'react';
import Link from 'next/link';

interface LandingFooterProps {
  quote: string;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ quote }) => {
  return (
    <footer className="w-full py-8 border-t border-[#f6f6f6]/20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Motivational Quote */}
          <div>
            <p 
              className="text-[#f6f6f6]/80 italic"
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '1.6' }}
            >
              {quote}
            </p>
          </div>

          {/* Center Column - Scroll Indicator */}
          <div className="flex flex-col items-center justify-center">
            <p 
              className="text-[#f6f6f6] mb-2"
              style={{ fontSize: '14px', fontWeight: 400 }}
            >
              SCROLL FOR MORE
            </p>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-[#f6f6f6]"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>

          {/* Right Column - What's New Link */}
          <div className="flex justify-end items-center">
            <Link 
              href="/highlights"
              className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
              style={{ fontSize: '16px', fontWeight: 400 }}
            >
              What's New?
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

