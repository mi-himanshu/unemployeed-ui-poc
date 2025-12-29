'use client';

import React, { useState, useEffect } from 'react';
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

const RoadmapPage: React.FC = () => {
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
    <div className="bg-[#1a1a1a]/40">
      <Navbar />
      <MainHeader
        title="Your Learning Split Into Phases"
        description="Start your journey! Follow the phases below that guide you throughout your journey and is built chronologically to help you achieve the best results in the shortest time possible."
        phases={phasesWithActive}
        onPhaseClick={handlePhaseClick}
      />
      <MainBody
        milestones={activeMilestones}
        phaseInfo={phaseInfo}
      />
      <Footer />
    </div>
  );
};

export default RoadmapPage;