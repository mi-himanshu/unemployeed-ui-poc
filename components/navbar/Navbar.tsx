'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const planData = {
  currentPlan: 'Starter Plan', // Options: 'Starter Plan', 'Pro Plan', 'Premium Plan'
  canUpgrade: true,
};

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = ['full_name', 'bio', 'location', 'linkedin_url', 'github_url', 'website_url', 'avatar_url'];
    const filledFields = fields.filter(field => {
      const value = profile[field as keyof typeof profile];
      return value && value.toString().trim() !== '';
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const userData = {
    fullName: profile?.full_name || user?.email?.split('@')[0] || 'User',
    username: '@' + (user?.email?.split('@')[0] || 'user'),
    profileCompletion: `${profileCompletion}% Complete`,
    avatar: profile?.avatar_url || '',
  };

  const getPlanDisplayName = (plan: string) => {
    if (plan.includes('Starter')) return 'Starter Plan';
    if (plan.includes('Pro')) return 'Pro Plan';
    if (plan.includes('Premium')) return 'Premium Plan';
    return plan;
  };

  const isPremium = planData.currentPlan.includes('Premium');
  const showUpgradeButton = !isPremium && planData.canUpgrade;

  // Use the calculated profile completion
  const profilePercentage = profileCompletion;
  
  // CSS conic-gradient calculation for circular progress
  // Degree = percentage * 3.6 (since 360 degrees / 100 = 3.6)
  const progressDegree = profilePercentage * 3.6;

  // Determine logo link based on auth status
  const logoLink = user ? '/dashboard' : '/';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <nav className="w-full py-4 text-white">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left Column - 2 Groups */}
        <div className="flex items-center gap-8">
          {/* Group 1: Logo */}
          <div className="flex items-center">
            <Link href={logoLink}>
              <Image
                src="/assets/logo.png"
                alt="unemployeed - FROM STUCK TO UNSTOPPABLE"
                width={180}
                height={40}
                className="h-auto cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </div>

          {/* Group 2: Nav Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard"
              className="text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors font-medium"
              style={{ fontSize: '14px' }}
            >
              DASHBOARD
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="flex items-center gap-1 text-[#f6f6f6] hover:text-[#f6f6f6]/80 transition-colors font-medium"
                style={{ fontSize: '14px' }}
              >
                SERVICES
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M6 9L1 4h10L6 9z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-sm shadow-lg min-w-[200px] z-50">
                  <Link
                    href="/career-compass"
                    className="block px-4 py-3 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    Career Compass
                  </Link>
                  <span
                    className="block px-4 py-3 text-[#f6f6f6]/40 cursor-not-allowed"
                    title="Coming soon"
                  >
                    Resume Studio
                  </span>
                  <span
                    className="block px-4 py-3 text-[#f6f6f6]/40 cursor-not-allowed"
                    title="Coming soon"
                  >
                    Growth Circle
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 2 Groups */}
        <div className="flex items-center gap-6">
          {/* Group 1: Plan Info */}
          <div className="flex items-center gap-4">
            <span 
              className="text-[#f6f6f6]/80 font-medium" 
              style={{ fontSize: '16px' }}
            >
              You are on {getPlanDisplayName(planData.currentPlan)}
            </span>
            {showUpgradeButton && (
              <Button 
                variant="primary" 
                className="text-sm opacity-50 cursor-not-allowed"
                disabled={true}
                title="Coming soon"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Upgrade
              </Button>
            )}
          </div>

          {/* Group 2: User Avatar */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="focus:outline-none"
            >
              {/* Avatar with Progress Ring */}
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:opacity-80"
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
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-[#f6f6f6]/20 rounded-sm shadow-lg min-w-[280px] z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-[#f6f6f6]/20">
                  <div className="flex items-center gap-3">
                    {/* Avatar in dropdown */}
                    <div 
                      className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `conic-gradient(
                          #e6c79c ${progressDegree}deg,
                          rgba(246, 246, 246, 0.2) ${progressDegree}deg 360deg
                        )`,
                        padding: '2px'
                      }}
                    >
                      <div 
                        className={`w-full h-full rounded-full border border-[#f6f6f6]/30 flex items-center justify-center overflow-hidden ${
                          userData.avatar ? 'bg-[#f6f6f6]/20' : 'bg-[#0a0a0a]'
                        }`}
                      >
                        {userData.avatar ? (
                          <Image
                            src={userData.avatar}
                            alt={`${userData.fullName} avatar`}
                            width={44}
                            height={44}
                            className="rounded-full object-center"
                          />
                        ) : (
                          <span className="text-[#f6f6f6] text-base font-medium">
                            {userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f6f6f6] font-medium truncate" style={{ fontSize: '16px' }}>
                        {userData.fullName}
                      </p>
                      <p className="text-[#f6f6f6]/60 truncate" style={{ fontSize: '14px' }}>
                        {userData.username}
                      </p>
                      <p className="text-[#f6f6f6]/60" style={{ fontSize: '12px' }}>
                        Profile: {userData.profileCompletion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Links Section */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ fontSize: '14px' }}
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/preferences"
                    className="block px-4 py-2 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ fontSize: '14px' }}
                  >
                    Set Preferences
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ fontSize: '14px' }}
                  >
                    Manage Your Account
                  </Link>
                  <span
                    className="block px-4 py-2 text-[#f6f6f6]/40 cursor-not-allowed"
                    style={{ fontSize: '14px' }}
                    title="Coming soon"
                  >
                    Explore All Plans
                  </span>
                </div>

                {/* Separator */}
                <div className="border-t border-[#f6f6f6]/20"></div>

                {/* Logout */}
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[#f6f6f6] hover:bg-[#f6f6f6]/10 transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  </nav>
);
};

export default Navbar;