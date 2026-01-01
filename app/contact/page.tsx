'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '@/components/navbar/Navbar';
import LandingNavbar from '@/components/navbar/LandingNavbar';
import Footer from '@/components/footer';
import { useAuth } from '@/contexts/AuthContext';
import { contactApi, ContactRequest } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-messages';

export default function ContactPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<ContactRequest>({
    name: profile?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.submitContact(formData);
      toast.success('Message sent successfully!', {
        duration: 4000,
      });
      toast('We aim to respond within 24-48 hours.', {
        icon: '📧',
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: profile?.full_name || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      const errorInfo = getErrorMessage(err, 'login');
      toast.error(errorInfo.userMessage, {
        duration: 6000,
      });
      if (errorInfo.actionMessage) {
        setTimeout(() => {
          toast(errorInfo.actionMessage!, {
            icon: '💡',
            duration: 5000,
          });
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Conditional Navbar */}
      {user ? <Navbar /> : <LandingNavbar />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Row 1: Contact Us Title with Animated Background */}
        <div className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradientContact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
                    fill="url(#waveGradientContact)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,250 Q400,150 800,250 T1600,250 L1600,400 L0,400 Z"
                    fill="url(#waveGradientContact)"
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

          {/* Page Title */}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white">Contact Us</h1>
          </div>
        </div>

        {/* Row 2: Two Column Layout */}
        <div className="flex-1 bg-[#1a1a1a] py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Get In Touch */}
              <div className="space-y-8">
                <div>
                  <p className="text-[#f6f6f6]/60 text-sm uppercase tracking-wider mb-2">KEEP CLOSE</p>
                  <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
                  <p className="text-[#f6f6f6] text-lg leading-relaxed mb-8">
                    Have questions, ideas, or feedback? We&apos;d love to hear from you. Reach out through our contact form or email, and we&apos;ll respond promptly. Your input helps us improve Unemployeed and support your career journey.
                  </p>
                </div>

                {/* Email Contact */}
                <div className="space-y-4">
                  <p className="text-[#f6f6f6] text-sm">
                    For account, billing, or technical queries.
                  </p>
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <a 
                      href="mailto:support@unemployeed.com" 
                      className="text-[#f6f6f6] hover:text-[#d32f2f] transition-colors"
                    >
                      support@unemployeed.com
                    </a>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-4">
                  <p className="text-[#f6f6f6] text-sm">
                    Connect with us on LinkedIn, Twitter, Instagram and Youtube for updates and insights.
                  </p>
                  <div className="flex gap-2">
                    {/* LinkedIn */}
                    <a 
                      href="https://linkedin.com/company/unemployeed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#2a3030] border border-[#f6f6f6]/20 rounded flex items-center justify-center hover:bg-[#f6f6f6]/10 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#f6f6f6]">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    {/* Twitter */}
                    <a 
                      href="https://twitter.com/unemployeed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#2a3030] border border-[#f6f6f6]/20 rounded flex items-center justify-center hover:bg-[#f6f6f6]/10 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a 
                      href="https://instagram.com/unemployeed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#2a3030] border border-[#f6f6f6]/20 rounded flex items-center justify-center hover:bg-[#f6f6f6]/10 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                    {/* YouTube */}
                    <a 
                      href="https://youtube.com/@unemployeed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#2a3030] border border-[#f6f6f6]/20 rounded flex items-center justify-center hover:bg-[#f6f6f6]/10 transition-colors"
                      aria-label="YouTube"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#f6f6f6]">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="pt-4">
                  <p className="text-[#f6f6f6]/60 text-sm mb-2">
                    Not sure if your question has been asked?
                  </p>
                  <Link 
                    href="/faqs" 
                    className="text-[#f6f6f6]/60 hover:text-[#f6f6f6] text-sm transition-colors underline"
                  >
                    Checkout FAQs
                  </Link>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">Your Details</h2>
                  <p className="text-[#f6f6f6]/80 text-sm mb-6">
                    Share your thoughts or report an issue — we&apos;ll get back to you promptly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Email on same line on large devices, stacked on small */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-[#f6f6f6] text-sm mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                        style={{ fontSize: '16px' }}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[#f6f6f6] text-sm mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                        style={{ fontSize: '16px' }}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[#f6f6f6] text-sm mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors"
                      style={{ fontSize: '16px' }}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[#f6f6f6] text-sm mb-2">
                      Comments / Questions
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#2a3030] border border-[#f6f6f6]/20 rounded-sm text-[#f6f6f6] placeholder-[#f6f6f6]/50 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors resize-none"
                      style={{ fontSize: '16px' }}
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-sm text-[#f6f6f6] text-base font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#d1a990' }}
                  >
                    {loading ? 'Sending...' : 'Contact Us'}
                  </button>

                  <div className="space-y-2 pt-2">
                    <p className="text-[#f6f6f6]/60 text-xs">
                      Your feedback helps us improve Unemployeed for the entire community.
                    </p>
                    <p className="text-[#f6f6f6]/60 text-xs">
                      We aim to respond within 24-48 hours.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

