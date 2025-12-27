import { Phase, Milestone } from '@/types/milestone';

export const phases: Phase[] = [
  {
    id: 'self-discovery',
    name: 'Self Discovery',
    number: 1,
    icon: 'atom',
    isActive: false,
  },
  {
    id: 'skill-deepening',
    name: 'Skill Deepening',
    number: 2,
    icon: 'x',
    isActive: true,
  },
  {
    id: 'hands-on',
    name: 'Hands On',
    number: 3,
    icon: 'building',
    isActive: false,
  },
  {
    id: 'networking',
    name: 'Networking',
    number: 4,
    icon: 'wifi',
    isActive: false,
  },
  {
    id: 'career-launch',
    name: 'Career Launch',
    number: 5,
    icon: 'rocket',
    isActive: false,
  },
];

export const milestones: Milestone[] = [
  {
    title: 'Mastering Backend Patterns',
    status: 'Completed',
    description: 'Learn the foundational patterns that power scalable backend systems — from MVC to event-driven design.',
    whyItMatters: 'These patterns help you write cleaner code, collaborate better, and prepare for system design interviews.',
    duration: '2-3 Days',
    phaseId: 'skill-deepening',
  },
  {
    title: 'Optimizing Database Design',
    status: 'Continue',
    description: 'Learn how to structure and optimize databases for scalability, performance, and reliability.',
    whyItMatters: 'Mastering schemas, indexing, and normalization prepares you for both real-world engineering and system design interviews.',
    duration: '2-3 Days',
    phaseId: 'skill-deepening',
  },
  {
    title: 'Building Scalable APIs',
    status: 'Start',
    description: 'Deep dive into designing APIs that are secure, scalable, and developer-friendly.',
    whyItMatters: 'APIs are the backbone of modern systems. Learning REST best practices, authentication flows, and rate limiting equips you to build services that scale with confidence.',
    duration: '2-3 Days',
    phaseId: 'skill-deepening',
  },
];

