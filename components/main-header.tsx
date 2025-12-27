import React from 'react';
import { Phase } from '@/types/milestone';

interface MainHeaderProps {
  title: string;
  description: string;
  phases: Phase[];
  onPhaseClick?: (phaseId: string) => void;
}

// Icon component for phases
const PhaseIcon: React.FC<{ icon: string; isActive: boolean }> = ({ icon, isActive }) => {
  const iconClasses = `w-[80px] h-[80px] flex items-center justify-center rounded-sm border-1 bg-transparent ${
    isActive ? 'border-[#f6f6f6]' : 'border-[#f6f6f6]/30'
  }`;
  
  // Icon representations - can be replaced with SVG icons later
  const renderIcon = () => {
    const iconColor = isActive ? '#f6f6f6' : '#f6f6f6';
    const iconOpacity = isActive ? '1' : '0.5';
    
    switch (icon) {
      case 'atom':
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" opacity={iconOpacity}>
            <circle cx="12" cy="12" r="1"/>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        );
      case 'x':
        return (
          <svg width="36" height="2436" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" opacity={iconOpacity}>
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        );
      case 'building':
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" opacity={iconOpacity}>
            <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
            <path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01"/>
          </svg>
        );
      case 'wifi':
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" opacity={iconOpacity}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        );
      case 'rocket':
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" opacity={iconOpacity}>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
          </svg>
        );
      default:
        return <div className="text-xl" style={{ color: iconColor, opacity: iconOpacity }}>●</div>;
    }
  };

  return (
    <>
    <div className="w-[100px] h-[100px] flex items-center justify-center rounded-sm border-1">
        <div className={iconClasses}>
          {renderIcon()}
        </div>
    </div>
    </>
  );
};

const MainHeader: React.FC<MainHeaderProps> = ({ title, description, phases, onPhaseClick }) => {
  return (
    <header className="text-center py-10">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-1 text-[#f6f6f6]">{title}</h1>
        <p className="text-sm text-[#f6f6f6]/80  mb-8 tracking-wide">{description}</p>
        
        {/* Phases Section */}
        <div className="relative">
          <div className='w-fit mx-auto phases-container'>
            <div className="flex flex-wrap justify-center items-start !gap-5 sm:gap-3 mb-4">
              {phases.map((phase, index) => (
                <div
                  key={phase.id}
                  className="flex min-w-[100px] sm:min-w-0 flex flex-col items-center cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => onPhaseClick?.(phase.id)}
                >
                  <PhaseIcon icon={phase.icon} isActive={phase.isActive} />
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium text-[#f6f6f6] mb-1">{phase.name}</p>
                    <p className="text-xs text-[#f6f6f6]/60">Phase {phase.number}</p>
                  </div>
                </div>
              ))}
            </div>


          {/* Active Phase Indicator Line - Fixed width pointer to active phase */}
          <div 
            className="relative h-0.5 bg-[#f6f6f6]/20 rounded-full overflow-hidden"
            style={{
              // Calculate total width: (number of phases * icon width) + (gaps between phases)
              width: `${phases.length * 100 + (phases.length - 1) * 20}px`,
            }}
          >
            {/* Background track - matches phases container width, dimmed */}
            
            {/* Active indicator - fixed 120px width, centered on active phase */}
            {phases.map((phase, index) => {
              if (!phase.isActive) return null;
              
              // Phase icon outer container: 120px
              // Gap between phases: 20px (gap-5 = 1.25rem = 20px)
              // Calculate left position to center indicator on active phase
              // Phase center = index * (iconWidth + gap) + (iconWidth / 2)
              // Indicator left = Phase center - (indicatorWidth / 2)
              const iconWidth = 100; // 120px outer container
              const gap = 20; // gap-5 = 20px
              const indicatorWidth = 100; // Same as icon outer container
              
              const phaseCenter = index * (iconWidth + gap) + (iconWidth / 2);
              const indicatorLeft = phaseCenter - (indicatorWidth / 2);
              
              return (
                <div
                  key={`active-${phase.id}`}
                  className="absolute top-0 h-full bg-[#f6f6f6] rounded-full transition-all duration-300 ease-out"
                  style={{
                    left: `${indicatorLeft}px`,
                    width: `${indicatorWidth}px`,
                  }}
                />
              );
            })}
          </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default MainHeader;

