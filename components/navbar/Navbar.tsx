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

        {/* Settings Icon */}
        <button 
          className="p-2 hover:bg-[#f6f6f6]/10 rounded transition-colors"
          aria-label="Settings"
        >
          <svg 
            width="32" 
            height="28" 
            viewBox="0 0 512 512" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#f6f6f6]"
          >
            <path 
              d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252
              c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366
              c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586
              c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363
              c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005
              c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675
              c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366
              c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552
              l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805
              c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303
              c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799
              c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364
              c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005
              c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007
              c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366
              c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799
              c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698
              c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088
              C339.815,267.771,320.972,313.262,281.292,329.698z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;