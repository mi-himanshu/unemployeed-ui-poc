import React from 'react';
import Link from 'next/link';
import { ProgressItem, Service, Resource, SecondaryService } from '@/types/dashboard';

interface DashboardBodyProps {
  progressItems: ProgressItem[];
  services: Service[];
  motivationalQuote: string;
  secondaryServices: SecondaryService[];
  resources: Resource[];
}

const DashboardBody: React.FC<DashboardBodyProps> = ({
  progressItems,
  services,
  motivationalQuote,
  secondaryServices,
  resources,
}) => {
  return (
    <div className='bg-[#2a3030]/50'>
      <div className="max-w-7xl mx-auto px-6 w-full py-8">
        {/* Section 1: Your Progress */}
        <section className="mb-12">
          <h2
            className="text-white mb-6"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            Your Progress
          </h2>
          <div className="space-y-1">
            {progressItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <h3
                      className="text-white mb-1"
                      style={{ fontSize: '18px', fontWeight: 500 }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#f6f6f6]/60"
                      style={{ fontSize: '14px', fontWeight: 400 }}
                    >
                      {item.status}
                    </p>
                  </div>
                  <div
                    className="text-white"
                    style={{ fontSize: '18px', fontWeight: 600 }}
                  >
                    {item.value}
                  </div>
                </div>
                {index < progressItems.length - 1 && (
                  <div className="border-t border-[#f6f6f6]/20" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Services */}
        <section className="mb-12">
          <h2
            className="text-white mb-8"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.primaryLink}
                className="bg-[#2a3030]/50 p-6 rounded-lg border border-[#f6f6f6]/10 flex flex-col hover:border-[#f6f6f6]/20 transition-colors cursor-pointer"
              >
                {/* Row 1: Icon and Title/Subtitle */}
                <div className="flex gap-4 mb-4">
                  {/* Left Column - Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#f6f6f6]/10 rounded-sm flex items-center justify-center">
                      {service.id === 'career-compass' && (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="14" fill="#FF6B6B" opacity="0.2" />
                          <circle cx="16" cy="16" r="12" stroke="#FF6B6B" strokeWidth="1.5" fill="none" />
                          <path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 12 L20 20 M20 12 L12 20" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="16" cy="16" r="2" fill="#FFE66D" />
                          <path d="M16 10 L18 14 L16 16 L14 14 Z" fill="#FF6B6B" />
                          <path d="M22 16 L18 18 L16 16 L18 14 Z" fill="#4ECDC4" />
                          <path d="M16 22 L14 18 L16 16 L18 18 Z" fill="#FFE66D" />
                          <path d="M10 16 L14 14 L16 16 L14 18 Z" fill="#95E1D3" />
                        </svg>
                      )}
                      {service.id === 'resume-studio' && (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="6" width="16" height="20" rx="2" fill="#A8E6CF" opacity="0.3" />
                          <rect x="8" y="6" width="16" height="20" rx="2" stroke="#A8E6CF" strokeWidth="1.5" fill="none" />
                          <line x1="12" y1="11" x2="20" y2="11" stroke="#FFD93D" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="12" y1="14" x2="20" y2="14" stroke="#6BCB77" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="12" y1="17" x2="18" y2="17" stroke="#4D96FF" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="14" cy="20" r="1.5" fill="#FF6B9D" />
                          <path d="M12 22 L16 24 L20 22" stroke="#C44569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <rect x="10" y="8" width="4" height="2" rx="0.5" fill="#FFD93D" />
                        </svg>
                      )}
                      {service.id === 'growth-circle' && (
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="12" fill="#FFD93D" opacity="0.2" />
                          <circle cx="16" cy="16" r="10" stroke="#FFD93D" strokeWidth="1.5" fill="none" />
                          <circle cx="10" cy="12" r="3" fill="#6BCB77" />
                          <circle cx="22" cy="12" r="3" fill="#4D96FF" />
                          <circle cx="10" cy="20" r="3" fill="#FF6B9D" />
                          <circle cx="22" cy="20" r="3" fill="#C44569" />
                          <circle cx="16" cy="16" r="2.5" fill="#FFD93D" />
                          <path d="M13 14 L16 16 L19 14" stroke="#6BCB77" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          <path d="M13 18 L16 16 L19 18" stroke="#4D96FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                          <path d="M16 13.5 L16 18.5" stroke="#FFD93D" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* Right Column - Title and Subtitle */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-white"
                        style={{ fontSize: '20px', fontWeight: 600 }}
                      >
                        {service.title}
                      </h3>
                      {service.hintText && (
                        <span 
                          className="px-2 py-0.5 rounded bg-[#d1a990]/20 text-[#d1a990] text-[10px] font-medium"
                        >
                          {service.hintText}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[#f6f6f6]/80"
                      style={{ fontSize: '14px', fontWeight: 400 }}
                    >
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                {/* Row 2: Description */}
                <div className="mb-5">
                  <p
                    className="text-[#f6f6f6]/60"
                    style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                  >
                    {service.description}
                  </p>
                </div>

              {/* Row 3: CTA Link */}
              <div className="mt-auto">
                <span 
                  className="text-[#d1a990]"
                >
                  {service.primaryLinkText}
                </span>
              </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Motivational Quote */}
        <section className="mb-12">
          <div
            className="bg-[#dc2626]/50 py-6 px-8 rounded-lg"
          >
            <p
              className="text-white italic text-center"
              style={{ fontSize: '18px', fontWeight: 400 }}
            >
              {motivationalQuote}
            </p>
          </div>
        </section>

        {/* Section 4: We Think You Might Like */}
        <section className="mb-12">
          <h2
            className="text-white mb-8"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            We Think You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#2a3030]/50 p-6 rounded-lg border border-[#f6f6f6]/10"
              >
                <h3
                  className="text-white mb-3"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#f6f6f6]/60"
                  style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Resources */}
        <section className="mb-12">
          <h2
            className="text-white mb-8"
            style={{ fontSize: '32px', fontWeight: 600 }}
          >
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#2a3030]/50 p-6 rounded-lg border border-[#f6f6f6]/10 flex flex-col"
              >
                <div className="w-12 h-12 bg-[#f6f6f6]/10 rounded-sm mb-4 flex items-center justify-center">
                  {resource.id === 'guides-articles' && (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="20" height="24" rx="2" fill="#FF6B6B" opacity="0.3"/>
                      <rect x="6" y="4" width="20" height="24" rx="2" stroke="#FF6B6B" strokeWidth="1.5" fill="none"/>
                      <line x1="10" y1="10" x2="22" y2="10" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="10" y1="14" x2="18" y2="14" stroke="#95E1D3" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="10" y1="18" x2="20" y2="18" stroke="#FFE66D" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="14" cy="22" r="1.5" fill="#FF6B9D"/>
                      <path d="M10 24 L16 26 L22 24" stroke="#C44569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <rect x="8" y="6" width="3" height="2" rx="0.5" fill="#4ECDC4"/>
                    </svg>
                  )}
                  {resource.id === 'templates-checklists' && (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="7" y="5" width="18" height="22" rx="1.5" fill="#6BCB77" opacity="0.3"/>
                      <rect x="7" y="5" width="18" height="22" rx="1.5" stroke="#6BCB77" strokeWidth="1.5" fill="none"/>
                      <line x1="11" y1="10" x2="21" y2="10" stroke="#FFD93D" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="11" y1="14" x2="19" y2="14" stroke="#4D96FF" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="11" y1="18" x2="17" y2="18" stroke="#FF6B9D" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="22" r="1.5" fill="#6BCB77"/>
                      <circle cx="12" cy="25" r="1.5" fill="#4D96FF"/>
                      <path d="M15 22 L20 22 M15 25 L20 25" stroke="#95E1D3" strokeWidth="1.5" strokeLinecap="round"/>
                      <rect x="9" y="7" width="4" height="2" rx="0.5" fill="#FFD93D"/>
                    </svg>
                  )}
                  {resource.id === 'external-learning' && (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 6 L6 12 L16 18 L26 12 Z" fill="#FFD93D" opacity="0.3"/>
                      <path d="M16 6 L6 12 L16 18 L26 12 Z" stroke="#FFD93D" strokeWidth="1.5" fill="none"/>
                      <path d="M6 12 L6 20 L16 26 L26 20 L26 12" stroke="#4D96FF" strokeWidth="1.5" fill="none"/>
                      <path d="M16 18 L16 26" stroke="#6BCB77" strokeWidth="1.5"/>
                      <circle cx="11" cy="15" r="1.5" fill="#FF6B9D"/>
                      <circle cx="21" cy="15" r="1.5" fill="#C44569"/>
                      <circle cx="16" cy="22" r="1.5" fill="#95E1D3"/>
                      <path d="M9 16 L13 16 M19 16 L23 16" stroke="#FFE66D" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <h3
                  className="text-white mb-1"
                  style={{ fontSize: '20px', fontWeight: 600 }}
                >
                  {resource.title}
                </h3>
                <p
                  className="text-[#f6f6f6]/80 mb-3"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  {resource.subtitle}
                </p>
                <p
                  className="text-[#f6f6f6]/60 mb-4 flex-1"
                  style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                >
                  {resource.description}
                </p>
                <div className="mt-auto">
                  <Link
                    href={resource.link}
                    className="text-[#d1a990] hover:text-[#d1a990]/80 transition-colors"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  >
                    {resource.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

  );
};

export default DashboardBody;

