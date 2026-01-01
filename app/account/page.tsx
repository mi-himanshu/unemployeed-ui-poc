'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';

const AccountPage: React.FC = () => {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<'account' | 'subscription'>('account');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    primaryEmail: '',
    username: '',
  });
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [newsUpdates, setNewsUpdates] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Load user data
    if (user && profile) {
      const nameParts = (profile.full_name || user.email?.split('@')[0] || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        primaryEmail: user.email || '',
        username: user.email?.split('@')[0] || '',
      });
    }
    setLoading(false);
  }, [user, profile, authLoading, router]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await userApi.updateProfile({
        full_name: fullName,
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating account:', err);
      setError(err.message || 'Failed to update account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;
    
    try {
      // TODO: Implement account deletion API call
      console.log('Deleting account...');
      await signOut();
      router.push('/');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account. Please try again.');
    }
  };

  const userData = {
    fullName: profile?.full_name || user?.email?.split('@')[0] || 'User',
    username: '@' + (user?.email?.split('@')[0] || 'user'),
    location: profile?.location || 'India',
    avatar: profile?.avatar_url || '',
  };

  const firstName = userData.fullName.split(' ')[0];

  if (authLoading || loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col relative">
      <AnimatedBackground gradientId="waveGradientAccount" />
      <Navbar />
      
      {/* Banner Header */}
      <div className="relative w-full py-16 px-6 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 100, 150, 0.4) 0%, rgba(100, 200, 255, 0.4) 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome To Your Account, {firstName}!
          </h1>
          <p className="text-lg text-white/90">
            You can manage your account here. Change your plans, update general settings or view the privacy settings.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Left Sidebar */}
            <aside className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6 h-fit">
              {/* User Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#f6f6f6] mb-2">{userData.fullName}</h2>
                <p className="text-[#f6f6f6]/60 mb-4" style={{ fontSize: '14px' }}>{userData.username}</p>
                <div className="flex items-center gap-2 text-[#f6f6f6]/60 mb-4" style={{ fontSize: '14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                  </svg>
                  {userData.location}
                </div>
                <Link
                  href="/profile"
                  className="inline-block px-4 py-2 bg-[#d1a990] text-[#0a0a0a] rounded-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ fontSize: '14px' }}
                >
                  View Profile
                </Link>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-lg font-semibold text-[#f6f6f6] mb-4">Manage Account</h3>
                
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-[#f6f6f6]/60 uppercase tracking-wider mb-2">GENERAL</h4>
                  <button
                    onClick={() => setActiveSection('account')}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      activeSection === 'account'
                        ? 'text-[#f6f6f6] bg-[#f6f6f6]/10'
                        : 'text-[#f6f6f6]/60 hover:text-[#f6f6f6] hover:bg-[#f6f6f6]/5'
                    }`}
                  >
                    Account
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#f6f6f6]/60 uppercase tracking-wider mb-2">BILLING</h4>
                  <button
                    onClick={() => setActiveSection('subscription')}
                    className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      activeSection === 'subscription'
                        ? 'text-[#f6f6f6] bg-[#f6f6f6]/10'
                        : 'text-[#f6f6f6]/60 hover:text-[#f6f6f6] hover:bg-[#f6f6f6]/5'
                    }`}
                  >
                    Subscription
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className="space-y-6">
              {activeSection === 'account' && (
                <>
                  {/* Account Settings Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-[#f6f6f6] mb-2">Account Settings</h2>
                    <p className="text-[#f6f6f6]/60" style={{ fontSize: '14px' }}>
                      Configure general options, themes and notifications
                    </p>
                  </div>

                  {/* Success/Error Messages */}
                  {success && (
                    <div className="p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded text-sm">
                      Account updated successfully!
                    </div>
                  )}
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
                      {error}
                    </div>
                  )}

                  {/* Profile Information */}
                  <section className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#f6f6f6] mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-[#f6f6f6]/80 mb-2 text-sm">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#f6f6f6]/80 mb-2 text-sm">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#f6f6f6]/80 mb-2 text-sm">Primary Email</label>
                        <input
                          type="email"
                          name="primaryEmail"
                          value={formData.primaryEmail}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-[#f6f6f6]/80 mb-2 text-sm">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#22c55e] text-white rounded-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </section>

                  {/* Appearance */}
                  <section className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#f6f6f6] mb-4">Select Your Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(['dark', 'light', 'system'] as const).map((themeOption) => (
                        <label
                          key={themeOption}
                          className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                            theme === themeOption
                              ? 'border-[#f6f6f6]'
                              : 'border-[#f6f6f6]/20 hover:border-[#f6f6f6]/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={themeOption}
                            checked={theme === themeOption}
                            onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'system')}
                            className="sr-only"
                          />
                          <div className="p-4">
                            <div className="aspect-video bg-[#0a0a0a] border border-[#f6f6f6]/10 rounded mb-3 flex items-center justify-center">
                              <div className="text-[#f6f6f6]/40 text-xs uppercase">{themeOption}</div>
                            </div>
                            <div className="text-center">
                              <span className="text-[#f6f6f6] font-medium capitalize">{themeOption}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Analytics & Marketing */}
                  <section className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#f6f6f6] mb-2">Analytics & Marketing</h3>
                    <p className="text-[#f6f6f6]/60 mb-4 text-sm">
                      Control What You'd Like To Hear From Us About
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#f6f6f6]">Send News & Updates about Unemployed</span>
                        <button
                          onClick={() => setNewsUpdates(!newsUpdates)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            newsUpdates ? 'bg-[#d1a990]' : 'bg-[#f6f6f6]/20'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              newsUpdates ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#f6f6f6]">Send Reminders About My Tasks</span>
                        <button
                          onClick={() => setTaskReminders(!taskReminders)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            taskReminders ? 'bg-[#d1a990]' : 'bg-[#f6f6f6]/20'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              taskReminders ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Delete Account */}
                  <section className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#f6f6f6] mb-2">Permanently Delete Your Account</h3>
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.checked)}
                          className="mt-1"
                        />
                        <span className="text-[#f6f6f6]/80 text-sm">
                          Deleting your account will also delete all your personal data and achievements. We might keep your career compass data for training purposes.
                        </span>
                      </label>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={!deleteConfirm}
                      className="px-6 py-2 bg-[#dc2626] text-white rounded-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete Account
                    </button>
                  </section>
                </>
              )}

              {activeSection === 'subscription' && (
                <div className="bg-[#1a1a1a]/60 border border-[#f6f6f6]/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-[#f6f6f6] mb-4">Subscription</h2>
                  <p className="text-[#f6f6f6]/60">Subscription management coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;

