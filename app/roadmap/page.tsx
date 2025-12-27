'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import MainHeader from '@/components/main-header';
import MainBody from '@/components/main-body';
import { phases, milestones } from '@/data/roadmap-data';
import { Phase } from '@/types/milestone';

const RoadmapPage: React.FC = () => {
  const [activePhaseId, setActivePhaseId] = useState<string>('skill-deepening');

  const handlePhaseClick = (phaseId: string) => {
    setActivePhaseId(phaseId);
  };

  // Update phases with active state
  const phasesWithActive = phases.map(phase => ({
    ...phase,
    isActive: phase.id === activePhaseId,
  }));

  // Filter milestones for active phase
  const activeMilestones = milestones.filter(m => m.phaseId === activePhaseId);
  const activePhase = phases.find(p => p.id === activePhaseId);
  const phaseInfo = activePhase ? `Phase ${activePhase.number} - ${activePhase.name}` : '';

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