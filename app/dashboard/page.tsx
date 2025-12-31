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
    <div className="bg-transparent min-h-screen flex flex-col">
      <Navbar />
      <DashboardHeader
        userName={userName}
        heading={`Welcome, ${firstName}!`}
        subheading="Your journey of evolution begins here."
        description="This is your personalized hub for career growth. Explore your roadmap, track milestones, build resumes, and access learning resources — all designed to help you move from stuck to unstoppable with clarity and confidence."
        ctaText={hasRoadmap ? "View Your Roadmap" : "Start Your Journey"}
        ctaLink={hasRoadmap ? "/roadmap" : "/diagnostics"}
      />
      <DashboardBody
        progressItems={progressItems}
        services={services}
        motivationalQuote={motivationalQuote}
        secondaryServices={secondaryServices}
        resources={resources}
      />
      <Footer />
    </div>
  );
};

export default DashboardPage;

