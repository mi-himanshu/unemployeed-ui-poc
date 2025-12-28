'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LandingNavbar: React.FC = () => {
  return (
    <nav className="w-full py-4 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="unemployeed - FROM STUCK TO UNSTOPPABLE"
              width={180}
              height={40}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Center Section - Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            Home
          </Link>
          <Link 
            href="/pricing" 
            className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            Pricing
          </Link>
          <Link 
            href="/contact" 
            className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors"
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            About Us
          </Link>
        </div>

        {/* Right Section - Login and Start Diagnostic Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button
              className="px-6 py-2 rounded-md text-sm text-[#f6f6f6] font-medium transition-all hover:opacity-90 border border-[#f6f6f6]/20"
            >
              Login
            </button>
          </Link>
          <Link href="/diagnostics">
            <button
              className="px-6 py-2 rounded-md text-sm text-[#f6f6f6] font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#dc2626' }}
            >
              Start Diagnostic
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;

