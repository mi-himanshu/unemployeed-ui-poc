import { LandingService } from '@/types/landing';

export const landingServices: LandingService[] = [
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    href: '#services',
  },
  {
    id: 'stats-diagnosis',
    name: 'Stats Diagnosis',
    href: '#services',
  },
  {
    id: 'focused-roadmap',
    name: 'Focused Roadmap',
    href: '#services',
  },
  {
    id: 'extra-resources',
    name: 'Extra Resources',
    href: '#services',
  },
];

export const landingText = {
  line1: [
    { text: 'Step On The ', isHighlighted: false },
    { text: 'Journey', isHighlighted: true },
    { text: ' To Evolution With AI-Powered ', isHighlighted: false },
    { text: 'Roadmaps', isHighlighted: true },
  ],
  description: 'Discover barriers, build resumes, acquire skills, and move forward with clarity — guided by AI‑powered roadmaps and a supportive community.',
  ctaText: 'Start Evolving'
};

export const landingQuote = '"Comprehensive career preparation tools and resources to help you land your dream job"';

