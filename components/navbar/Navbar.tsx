'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

// Dummy data - will be replaced with backend integration later
const userData = {
  fullName: 'Himanshu Mishra',
  username: '@mihimanshu',
  profileCompletion: 'Profile 40% Complete',
  avatar: '', // Placeholder - replace with actual avatar
};

const planData = {
  currentPlan: 'Starter Plan', // Options: 'Free Plan', 'Basic Plan', 'Member Plan', 'Pro Plan'
  canUpgrade: true,
};

const Navbar: React.FC = () => {
  const getPlanDisplayName = (plan: string) => {
    if (plan.includes('Starter')) return 'Starter Plan';
    if (plan.includes('Free')) return 'Free Plan';
    if (plan.includes('Basic')) return 'Basic Plan';
    if (plan.includes('Member')) return 'Member Plan';
    if (plan.includes('Pro')) return 'Pro Plan';
    return plan;
  };

  // Extract percentage from profile completion string
  const getProfilePercentage = (completion: string): number => {
    const match = completion.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const profilePercentage = getProfilePercentage(userData.profileCompletion);
  
  // CSS conic-gradient calculation for circular progress
  // Degree = percentage * 3.6 (since 360 degrees / 100 = 3.6)
  const progressDegree = profilePercentage * 3.6;

  return (
    <nav className="w-full py-4 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <Image
          src="/assets/logo.png"
          alt="unemployeed - FROM STUCK TO UNSTOPPABLE"
          width={180}
          height={40}
          className="h-auto"
          priority
        />
      </div>

      {/* Center Section - Plan Status */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col justify-center pt-1 pb-1">
          <span 
            className="text-[#f6f6f6]/80 font-medium leading-none" 
            style={{ fontSize: '18px' }}
          >
            You are on {getPlanDisplayName(planData.currentPlan)}
          </span>
          {planData.canUpgrade && (
            <span 
              className="text-[#f6f6f6]/60"
              style={{ fontSize: '10px' }}
            >
              Unlock features and content upon upgrade!
            </span>
          )}
        </div>
        {planData.canUpgrade && (
          <>
            <Button variant="primary" className="text-sm self-center">
              Upgrade
            </Button>
            {/* <button 
              className="p-2 hover:bg-[#f6f6f6]/10 rounded transition-colors"
              aria-label="Search"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-[#f6f6f6]"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button> */}
          </>
        )}
      </div>

      {/* Right Section - Profile & Settings */}
      <div className="flex items-center gap-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right justify-center">
            <p 
              className="text-[#e6c79c] font-medium leading-none"
              style={{ fontSize: '16px' }}
            >
              {userData.fullName}
            </p>
            <p 
              className="text-[#f6f6f6]/60 font-light"
              style={{ fontSize: '10px' }}
            >
              {userData.profileCompletion}
            </p>
          </div>
          {/* Avatar with Progress Ring - CSS conic-gradient approach */}
          <div 
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: `conic-gradient(
                #e6c79c ${progressDegree}deg,
                rgba(246, 246, 246, 0.2) ${progressDegree}deg 360deg
              )`,
              padding: '1px'
            }}
          >
            {/* Inner circle - creates the ring effect */}
            <div 
              className={`w-full h-full rounded-full border border-[#f6f6f6]/30 flex items-center justify-center overflow-hidden ${
                userData.avatar ? 'bg-[#f6f6f6]/20' : 'bg-[#0a0a0a]'
              }`}
            >
              {userData.avatar ? (
                <Image
                  src={userData.avatar}
                  alt={`${userData.fullName} avatar`}
                  width={36}
                  height={36}
                  className="rounded-full object-center"
                />
              ) : (
                <span className="text-[#f6f6f6] text-sm font-medium">
                  {userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hamburger Menu */}
        <button 
          className="p-2 hover:bg-[#f6f6f6]/10 rounded transition-colors"
          aria-label="Menu and settings"
        >
          <svg 
            width="40" 
            height="35" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#f6f6f6]"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;