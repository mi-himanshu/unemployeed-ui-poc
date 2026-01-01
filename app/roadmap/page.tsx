'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import MainHeader from '@/components/main-header';
import MainBody from '@/components/main-body';
import { roadmapApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Phase, Milestone } from '@/types/milestone';

const defaultPhases: Phase[] = [
  { id: 'self-discovery', name: 'Self Discovery', number: 1, icon: 'atom', isActive: false },
  { id: 'skill-deepening', name: 'Skill Deepening', number: 2, icon: 'x', isActive: true },
  { id: 'hands-on', name: 'Hands On', number: 3, icon: 'building', isActive: false },
  { id: 'networking', name: 'Networking', number: 4, icon: 'wifi', isActive: false },
  { id: 'career-launch', name: 'Career Launch', number: 5, icon: 'rocket', isActive: false },
];

const getPhaseIdFromMilestone = (milestoneIndex: number, totalMilestones: number): string => {
  const phaseSize = Math.ceil(totalMilestones / 5);
  const phaseNumber = Math.floor(milestoneIndex / phaseSize) + 1;
  const phaseMap: Record<number, string> = {
    1: 'self-discovery', 2: 'skill-deepening', 3: 'hands-on', 4: 'networking', 5: 'career-launch',
  };
  return phaseMap[phaseNumber] || 'skill-deepening';
};

const mapMilestoneToFrontend = (backendMilestone: any, index: number, total: number): Milestone => {
  const phaseId = getPhaseIdFromMilestone(index, total);
  let status: 'Completed' | 'Continue' | 'Start' = 'Start';
  if (backendMilestone.status === 'completed') status = 'Completed';
  else if (backendMilestone.status === 'in_progress') status = 'Continue';
  
  const weeks = backendMilestone.estimated_weeks || 4;
  const duration = weeks === 1 ? '1 Week' : `${weeks} Weeks`;
  const whyItMatters = backendMilestone.description || 
    `This milestone focuses on ${backendMilestone.skill_area || 'key skills'} that are essential for your career growth.`;

  return {
    title: backendMilestone.title || `Milestone ${index + 1}`,
    status: status,
    description: backendMilestone.description || '',
    whyItMatters: whyItMatters,
    duration: duration,
    phaseId: phaseId,
  };
};

const RoadmapPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const roadmapId = searchParams.get('roadmapId');
  
  const [roadmap, setRoadmap] = useState<any>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [phases, setPhases] = useState<Phase[]>(defaultPhases);
  const [activePhaseId, setActivePhaseId] = useState<string>('skill-deepening');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);

        let roadmapData;
        
        if (roadmapId) {
          roadmapData = await roadmapApi.getRoadmap(roadmapId);
        } else {
          const roadmaps = await roadmapApi.listRoadmaps();
          if (roadmaps.roadmaps.length > 0) {
            roadmapData = roadmaps.roadmaps[0];
          } else {
            throw new Error('No roadmap found. Please complete the diagnostic first.');
          }
        }

        setRoadmap(roadmapData);
        const mappedMilestones = roadmapData.milestones.map((m: any, index: number) =>
          mapMilestoneToFrontend(m, index, roadmapData.milestones.length)
        );
        setMilestones(mappedMilestones);
        
        if (mappedMilestones.length > 0) {
          const firstPhaseId = mappedMilestones[0].phaseId;
          setActivePhaseId(firstPhaseId);
        }
      } catch (err: any) {
        console.error('Error fetching roadmap:', err);
        setError(err.message || 'Failed to load roadmap. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [roadmapId, user, authLoading, router]);

  const handlePhaseClick = (phaseId: string) => {
    setActivePhaseId(phaseId);
  };

  const phasesWithActive = phases.map(phase => ({
    ...phase,
    isActive: phase.id === activePhaseId,
  }));

  const activeMilestones = milestones.filter(m => m.phaseId === activePhaseId);
  const activePhase = phases.find(p => p.id === activePhaseId);
  const phaseInfo = activePhase ? `Phase ${activePhase.number} - ${activePhase.name}` : '';

  if (authLoading || loading) {
    return (
      <div className="bg-[#1a1a1a]/40 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading your roadmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a]/40 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6] text-center">
          <p className="mb-4">Error: {error}</p>
          <button 
            onClick={() => router.push('/diagnostics')} 
            className="px-4 py-2 bg-[#d1a990] text-[#1a1a1a] rounded"
          >
            Start Diagnostic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Header Section with Animated Background */}
        <div className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradientRoadmap" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
                    fill="url(#waveGradientRoadmap)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,250 Q400,150 800,250 T1600,250 L1600,400 L0,400 Z"
                    fill="url(#waveGradientRoadmap)"
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
            <MainHeader
              title="Your Learning Split Into Phases"
              description="Start your journey! Follow the phases below that guide you throughout your journey and is built chronologically to help you achieve the best results in the shortest time possible."
              phases={phasesWithActive}
              onPhaseClick={handlePhaseClick}
            />
          </div>
        </div>

        {/* Body Section with dark background */}
        <div className="flex-1 bg-[#1a1a1a]">
          <MainBody
            milestones={activeMilestones}
            phaseInfo={phaseInfo}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const RoadmapPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="bg-[#1a1a1a]/40 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading your roadmap...</div>
      </div>
    }>
      <RoadmapPageContent />
    </Suspense>
  );
};

export default RoadmapPage;