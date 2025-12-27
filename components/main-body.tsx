import React from 'react';
import { Milestone } from '@/types/milestone';

interface MainBodyProps {
  children?: React.ReactNode;
  milestones?: Milestone[];
  phaseInfo?: string;
}

const MilestoneCard: React.FC<{ milestone: Milestone; phaseInfo?: string }> = ({ milestone, phaseInfo }) => {
  const getButtonText = () => {
    switch (milestone.status) {
      case 'Completed':
        return 'Completed';
      case 'Continue':
        return 'Continue';
      case 'Start':
        return 'Start';
      default:
        return 'Start';
    }
  };

  const getButtonStyles = () => {
    switch (milestone.status) {
      case 'Completed':
        return 'bg-[#f6f6f6]/20 border-[#f6f6f6]/40 text-[#f6f6f6]';
      case 'Continue':
        return 'bg-[#f6f6f6]/10 border-[#f6f6f6]/30 text-[#f6f6f6] hover:bg-[#f6f6f6]/20';
      case 'Start':
        return 'bg-transparent border-[#f6f6f6]/20 text-[#f6f6f6] hover:bg-[#f6f6f6]/10';
      default:
        return 'bg-transparent border-[#f6f6f6]/20 text-[#f6f6f6]';
    }
  };

  const getCardBorderStyles = () => {
    if (milestone.status === 'Completed') {
      return 'border-[#f6f6f6]/40';
    }
    return 'border-[#f6f6f6]/20';
  };

  return (
    <div className={`border rounded-lg p-6 ${getCardBorderStyles()} transition-all hover:border-[#f6f6f6]/40`}>
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-[#f6f6f6]">{milestone.title}</h3>
        <p className="text-xs text-[#f6f6f6]/60 mb-3">{phaseInfo}</p>
      </div>
      
      <p className="text-sm text-[#f6f6f6]/80 mb-4">{milestone.description}</p>
      
      <div className="mb-4">
        <p className="text-xs font-medium text-[#f6f6f6]/70 mb-1">Why This Matters?</p>
        <p className="text-xs text-[#f6f6f6]/60 italic">{milestone.whyItMatters}</p>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <span className="text-xs text-[#f6f6f6]/60">Estimated: {milestone.duration}</span>
        <button
          className={`px-4 py-2 rounded text-xs font-medium border transition-all ${getButtonStyles()}`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

const MainBody: React.FC<MainBodyProps> = ({ children, milestones, phaseInfo }) => {
  if (children) {
    return (
      <main className="py-8 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    );
  }

  if (milestones && milestones.length > 0) {
    return (
      <main className="py-8 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} phaseInfo={phaseInfo} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Empty state when no milestones
  if (milestones && milestones.length === 0) {
    return (
      <main className="py-8 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          {phaseInfo && (
            <h2 className="text-2xl font-bold text-[#f6f6f6] mb-6">{phaseInfo}</h2>
          )}
          <div className="text-center py-12">
            <p className="text-[#f6f6f6]/60">No milestones available for this phase yet.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </main>
  );
};

export default MainBody;

