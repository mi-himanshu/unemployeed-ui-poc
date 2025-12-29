'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import MainHeader from '@/components/main-header';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, UserProfile } from '@/lib/api';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    avatar_url: '',
  });
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

    // Load profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        website_url: profile.website_url || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setLoading(false);
  }, [user, profile, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await userApi.updateProfile(formData);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = ['full_name', 'bio', 'location', 'linkedin_url', 'github_url', 'website_url', 'avatar_url'];
    const filledFields = fields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.trim() !== '';
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  if (authLoading || loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col">
      <Navbar />
      <MainHeader
        title="Manage Your Profile"
        description="Update your personal information, professional links, and profile details to help us personalize your experience."
        phases={[]}
      />

      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto px-6">
          {/* Profile Completion Indicator */}
          <div className="mb-8 p-6 bg-[#1a1a1a]/40 border border-[#f6f6f6]/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#f6f6f6]/80 text-sm font-medium">Profile Completion</span>
              <span className="text-[#e6c79c] text-sm font-medium">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-[#2a3030] rounded-full h-2">
              <div
                className="bg-[#e6c79c] h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded text-sm">
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-[#1a1a1a]/40 border border-[#f6f6f6]/20 rounded-lg p-6">
              <h2 className="text-[#f6f6f6] text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors resize-y"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label htmlFor="avatar_url" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {formData.avatar_url && (
                    <div className="mt-2">
                      <img
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border border-[#f6f6f6]/20"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Links Section */}
            <div className="bg-[#1a1a1a]/40 border border-[#f6f6f6]/20 rounded-lg p-6">
              <h2 className="text-[#f6f6f6] text-lg font-semibold mb-4">Professional Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="linkedin_url" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label htmlFor="github_url" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label htmlFor="website_url" className="block text-[#f6f6f6]/80 text-sm font-medium mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-[#1a1a1a]/40 border border-[#f6f6f6]/20 rounded-lg p-6">
              <h2 className="text-[#f6f6f6] text-lg font-semibold mb-4">Account Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#f6f6f6]/60 text-sm">Email</span>
                  <span className="text-[#f6f6f6] text-sm">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f6f6f6]/60 text-sm">User ID</span>
                  <span className="text-[#f6f6f6] text-sm font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
                </div>
                {profile && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#f6f6f6]/60 text-sm">Profile Created</span>
                      <span className="text-[#f6f6f6] text-sm">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#f6f6f6]/60 text-sm">Last Updated</span>
                      <span className="text-[#f6f6f6] text-sm">
                        {new Date(profile.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-transparent border border-[#f6f6f6]/20 text-[#f6f6f6] rounded-sm hover:bg-[#f6f6f6]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#dc2626] text-[#f6f6f6] rounded-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

