'use client';

import React from 'react';
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

// Dummy user data - will be replaced with backend integration later
const userData = {
  fullName: 'Himanshu Mishra',
};

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      <Navbar />
      <DashboardHeader
        userName={userData.fullName}
        heading={`Welcome, ${userData.fullName.split(' ')[0]}!`}
        subheading="Your journey of evolution begins here."
        description="This is your personalized hub for career growth. Explore your roadmap, track milestones, build resumes, and access learning resources — all designed to help you move from stuck to unstoppable with clarity and confidence."
        ctaText="Start Your Journey"
        ctaLink="/roadmap"
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

