import { ProgressItem, Service, Resource, SecondaryService } from '@/types/dashboard';

export const progressItems: ProgressItem[] = [
  {
    id: 'career-compass',
    title: 'Career compass',
    status: 'Yet to step on the journey',
    value: '0%',
  },
  {
    id: 'resume-studio',
    title: 'Resume studio',
    status: 'Resumes created/analyzed',
    value: '0',
  },
  {
    id: 'growth-circle',
    title: 'Growth Circle',
    status: 'Part of discussions',
    value: '0',
  },
];

export const services: Service[] = [
  {
    id: 'career-compass',
    title: 'Career Compass',
    subtitle: 'Diagnose, roadmap, and skill-build',
    description: 'Pinpoint barriers, generate a roadmap, and follow a guided learning path to evolve your skills.',
    primaryLink: '/diagnostics',
    primaryLinkText: 'Start Your Diagnostics →',
    secondaryLink: '/roadmap',
    secondaryLinkText: 'Start Here',
    hintText: 'Recommended',
  },
  {
    id: 'resume-studio',
    title: 'Resume Studio',
    subtitle: 'Create, analyze, and refine resumes.',
    description: 'Craft resumes, compare against job descriptions, and track versions with AI-powered insights.',
    primaryLink: '/resume-studio',
    primaryLinkText: 'Open Resume Studio →',
  },
  {
    id: 'growth-circle',
    title: 'Growth Circle',
    subtitle: 'Engage, share, and grow together',
    description: 'Join discussions, form teams, and celebrate wins or losses with peers on the same journey.',
    primaryLink: '/community',
    primaryLinkText: 'Enter Community →',
  },
];

export const motivationalQuote = '"Every skill you build today is a step toward unstoppable."';

export const secondaryServices: SecondaryService[] = [
  {
    id: 'glossary',
    title: 'Glossary of Career Terms',
    description: 'Decode HR jargon, ATS keywords, and technical terms with our quick reference glossary.',
  },
  {
    id: 'skills-library',
    title: 'Skills Library',
    description: 'Curated links to courses, tutorials, and external learning platforms for upskilling.',
  },
  {
    id: 'reflection-prompts',
    title: 'Reflection Prompts',
    description: 'Guided questions to help you track growth and stay aligned with your goals.',
  },
];

export const resources: Resource[] = [
  {
    id: 'guides-articles',
    title: 'Guides & Articles',
    subtitle: 'Step-by-Step Career Guides',
    description: 'Practical guides and insights that break down complex career challenges into simple, actionable steps you can apply right away.',
    link: '/guides',
    linkText: 'Explore Guides →',
  },
  {
    id: 'templates-checklists',
    title: 'Templates & Checklists',
    subtitle: 'Ready-to-Use Templates',
    description: 'Download polished resumes, cover letters, and interview checklists to save time and present your strengths with impact.',
    link: '/templates',
    linkText: 'Create My Resume →',
  },
  {
    id: 'external-learning',
    title: 'External Learning Hub',
    subtitle: 'Curated Learning Resources',
    description: 'Handpicked courses, tutorials, and industry blogs to help you grow beyond the dashboard.',
    link: '/learning',
    linkText: 'Join Community →',
  },
];

