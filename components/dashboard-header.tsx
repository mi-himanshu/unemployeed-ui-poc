import React from 'react';
import Link from 'next/link';

interface DashboardHeaderProps {
  userName: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  heading,
  subheading,
  description,
  ctaText,
  ctaLink,
}) => {
  return (
    <header className="text-center py-12 relative">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <h1 
          className="text-white text-[32px] font-semibold mb-2"
        >
          {heading}
        </h1>
        <p 
          className="text-[#f6f6f6]/80 text-[20px] font-normal tracking-wider mb-6"
        >
          {subheading}
        </p>
        <p 
          className="text-[#f6f6f6]/80 text-[16px] font-normal  mb-8 max-w-3xl mx-auto"
        >
          {description}
        </p>
        <Link href={ctaLink}>
          <button
            className="px-10 py-3 rounded-sm bg-[#dc2626]/85 text-[#f6f6f6] text-base font-medium transition-all hover:opacity-90"
            // style={{ backgroundColor: '#dc2626' }}
          >
            {ctaText}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;

