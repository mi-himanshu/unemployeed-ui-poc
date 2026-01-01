'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import Footer from '@/components/footer';
import { useAuth } from '@/contexts/AuthContext';

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Conditional Navbar */}
      {user ? <Navbar /> : <LandingNavbar />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section - About Us */}
        <div className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradientAbout" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
                    fill="url(#waveGradientAbout)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,250 Q400,150 800,250 T1600,250 L1600,400 L0,400 Z"
                    fill="url(#waveGradientAbout)"
                    className="animate-pulse"
                    style={{ animationDelay: '1s' }}
                  />
                </svg>
              </div>
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
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

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">About Us</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              Redefining career preparation for the modern era
            </p>
            <p className="text-white text-lg">
              At Unemployeed, we believe clarity, confidence, and transformation should be accessible to every individual.
            </p>
          </div>
        </div>

        {/* All the Perks Section */}
        <div className="bg-[#1a1a1a] py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">All the Perks</h2>
            <p className="text-[#f6f6f6] text-lg mb-12 max-w-3xl">
              At Unemployeed, we provide a complete career preparation ecosystem designed for modern era for both students and professionals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Career Compass */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Career Compass</h3>
                <p className="text-[#f6f6f6] leading-relaxed">
                  Personalized diagnostics and clear roadmaps to help you identify your ideal path.
                </p>
              </div>

              {/* Resume Studio */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Resume Studio</h3>
                <p className="text-[#f6f6f6] leading-relaxed">
                  Smart tools to craft resumes that resonate with recruiters and stand out technically.
                </p>
              </div>

              {/* Growth Circle */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Growth Circle</h3>
                <p className="text-[#f6f6f6] leading-relaxed">
                  A collaborative community for peer learning, insights, and collective career acceleration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story & Mission Section */}
        <div className="bg-[#0a0a0a] py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Our Story & Mission</h2>
            
            <div className="space-y-6 text-[#f6f6f6] text-lg leading-relaxed">
              <p>
                Career preparation has long been fragmented—scattered resources, generic advice, and overwhelming choices that leave professionals uncertain. Unemployeed was born out of the need to simplify this journey and make it emotionally intelligent.
              </p>
              
              <p>
                We believe that career growth isn&apos;t just about landing a job, it&apos;s about transformation. Our mission is to empower students and professionals with tools that combine clarity, confidence, and emotional resonance. By blending technology with human-centered design, we guide users from self-discovery to career breakthroughs.
              </p>
              
              <p>
                Every feature we build—from diagnostics to community spaces—is designed to reduce friction, inspire progress, and help professionals unlock their full potential. Our mission is simple yet ambitious: to make career preparation smarter, more human, and globally scalable.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-[#1a1a1a] py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">Why Choose Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quote 1 */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6 relative">
                <div className="text-6xl text-white/20 font-serif mb-2">&quot;</div>
                <p className="text-[#f6f6f6] text-lg leading-relaxed">
                  Unemployeed cuts through the noise with structured tools that guide you step-by-step toward progress.
                </p>
              </div>

              {/* Quote 2 */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6 relative">
                <div className="text-6xl text-white/20 font-serif mb-2">&quot;</div>
                <p className="text-[#f6f6f6] text-lg leading-relaxed">
                  Every feature is built to reassure, motivate, and inspire confidence—turning stress into clarity.
                </p>
              </div>

              {/* Quote 3 */}
              <div className="bg-[#2a3030] border border-[#f6f6f6]/10 rounded-lg p-6 relative">
                <div className="text-6xl text-white/20 font-serif mb-2">&quot;</div>
                <p className="text-[#f6f6f6] text-lg leading-relaxed">
                  Beyond tools and templates, we focus on helping professionals grow with confidence, resilience, and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#d32f2f]/40 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white text- md:text-2xl leading-relaxed">
              Unemployeed isn&apos;t just a platform—it&apos;s a movement to redefine career preparation. We&apos;re here to help you move from uncertainty to unstoppable growth, one clear step at a time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

