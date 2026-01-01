'use client';

import React from 'react';

interface AnimatedBackgroundProps {
  gradientId?: string;
  particleCount?: number;
  className?: string;
}

export default function AnimatedBackground({ 
  gradientId = 'waveGradient', 
  particleCount = 20,
  className = '' 
}: AnimatedBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Red wave-like shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
              fill={`url(#${gradientId})`}
              className="animate-pulse"
            />
            <path
              d="M0,500 Q400,350 800,500 T1600,500 L1600,800 L0,800 Z"
              fill={`url(#${gradientId})`}
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </div>
      </div>
      
      {/* Particle effects */}
      <div className="absolute inset-0">
        {[...Array(particleCount)].map((_, i) => (
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
  );
}



