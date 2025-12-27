import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const Footer: React.FC = () => (
  <footer className="bg-charcoal text-white py-10 w-full">
    <div className="max-w-7xl mx-auto px-6 w-full">
      {/* Top Row - 2 Major Columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 mb-8">
        {/* Left Column - 4 Sub-columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Helpful Links */}
          <div>
            <h4 
              className="font-medium mb-4 text-[#f6f6f6]"
              style={{ fontSize: '16px' }}
            >
              Helpful Links
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Career Diagnostics
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Learning Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 
              className="font-medium mb-4 text-[#f6f6f6]"
              style={{ fontSize: '16px' }}
            >
              Support
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Troubleshooting
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h4 
              className="font-medium mb-4 text-[#f6f6f6]"
              style={{ fontSize: '16px' }}
            >
              Mission
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  What's New?
                </a>
              </li>
            </ul>
          </div>

          {/* Plans */}
          <div>
            <h4 
              className="font-medium mb-4 text-[#f6f6f6]"
              style={{ fontSize: '16px' }}
            >
              Plans
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors" style={{ fontSize: '12px', fontWeight: 400 }}>
                  Pricing & Plans
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Subheading, CTA, Logo */}
        <div className="flex flex-col justify-end max-w-sm items-end">
          <p 
            className="text-[#f6f6f6]/80 mb-4 text-right"
            style={{ fontSize: '12px', fontWeight: 300 }}
          >
            Comprehensive career preparation tools and resources to help you land your dream job
          </p>
          <div className="mb-6">
            <Button variant="primary" className="text-sm">
              Join Community
            </Button>
          </div>
          <div className="mt-2">
            <Image
              src="/assets/logo.png"
              alt="unemployeed - FROM STUCK TO UNSTOPPABLE"
              width={180}
              height={40}
              className="h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row - 3 Sections */}
      <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left - Copyright */}
        <div 
          className="text-[#f6f6f6]/80"
          style={{ fontSize: '12px', fontWeight: 400 }}
        >
          © 2025 Unemployeed™. All rights reserved.
        </div>

        {/* Center - Terms Links */}
        <div className="flex gap-4">
          <a 
            href="#" 
            className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors"
            style={{ fontSize: '12px', fontWeight: 400 }}
          >
            Terms of service
          </a>
          <a 
            href="#" 
            className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors"
            style={{ fontSize: '12px', fontWeight: 400 }}
          >
            Privacy Policy
          </a>
        </div>

        {/* Right - Social Media Icons */}
        <div className="flex gap-3">
          {/* Instagram */}
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#f6f6f6]/10 border border-[#f6f6f6]/20 flex items-center justify-center hover:bg-[#f6f6f6]/20 transition-colors"
            aria-label="Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          {/* Facebook */}
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#f6f6f6]/10 border border-[#f6f6f6]/20 flex items-center justify-center hover:bg-[#f6f6f6]/20 transition-colors"
            aria-label="Facebook"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>

          {/* Twitter */}
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#f6f6f6]/10 border border-[#f6f6f6]/20 flex items-center justify-center hover:bg-[#f6f6f6]/20 transition-colors"
            aria-label="Twitter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a 
            href="#" 
            className="w-8 h-8 rounded-full bg-[#f6f6f6]/10 border border-[#f6f6f6]/20 flex items-center justify-center hover:bg-[#f6f6f6]/20 transition-colors"
            aria-label="YouTube"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;