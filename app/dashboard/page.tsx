'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import DashboardHeader from '@/components/dashboard-header';
import DashboardBody from '@/components/dashboard-body';
import {
  progressItems,
  services,
  motivationalQuote,
  secondaryServices,
  resources,
} from '@/data/dashboard-data';
import { useAuth } from '@/contexts/AuthContext';
import { roadmapApi } from '@/lib/api';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, profile, loading: authLoading, emailVerified } = useAuth();
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Check email verification
    if (emailVerified === false) {
      router.push('/verify-email');
      return;
    }

    const checkRoadmap = async () => {
      try {
        const roadmaps = await roadmapApi.listRoadmaps();
        setHasRoadmap(roadmaps.roadmaps.length > 0);
      } catch (error) {
        console.error('Error checking roadmap:', error);
        setHasRoadmap(false);
      } finally {
        setLoading(false);
      }
    };

    checkRoadmap();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading...</div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const firstName = userName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Header Section with Animated Background */}
        <div className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background - only in header section */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradientDashboard" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
                    fill="url(#waveGradientDashboard)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,250 Q400,150 800,250 T1600,250 L1600,400 L0,400 Z"
                    fill="url(#waveGradientDashboard)"
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

          {/* Header Content */}
          <div className="relative z-10">
            <DashboardHeader
              userName={userName}
              heading={`Welcome, ${firstName}!`}
              subheading="Your journey of evolution begins here."
              description="This is your personalized hub for career growth. Explore your roadmap, track milestones, build resumes, and access learning resources — all designed to help you move from stuck to unstoppable with clarity and confidence."
              ctaText={hasRoadmap ? "View Your Roadmap" : "Start Your Journey"}
              ctaLink={hasRoadmap ? "/roadmap" : "/diagnostics"}
            />
          </div>
        </div>

        {/* Body Section with dark background */}
        <div className="flex-1 bg-[#1a1a1a]">
          <DashboardBody
            progressItems={progressItems}
            services={services}
            motivationalQuote={motivationalQuote}
            secondaryServices={secondaryServices}
            resources={resources}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;

