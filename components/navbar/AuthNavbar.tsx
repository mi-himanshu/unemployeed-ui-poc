'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthNavbarProps {
  currentPage: 'login' | 'signup';
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ currentPage }) => {
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

        {/* Right Section - Login/Sign Up Button */}
        <div className="flex items-center">
          {currentPage === 'login' ? (
            <Link href="/signup">
              <button
                className="px-6 py-2 rounded-md text-sm text-[#f6f6f6] font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#dc2626' }}
              >
                Sign Up
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button
                className="px-6 py-2 rounded-md text-sm text-[#f6f6f6] font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#dc2626' }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;

