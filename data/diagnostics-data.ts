import { DiagnosticQuestion, DiagnosticCategory } from '@/types/diagnostics';

export const diagnosticCategories: DiagnosticCategory[] = [
  {
    id: 'career-snapshot',
    name: 'Career Snapshot',
    order: 1,
    isCompleted: false,
    isActive: true,
  },
  {
    id: 'feeling-check',
    name: 'Feeling Check',
    order: 2,
    isCompleted: false,
    isActive: false,
  },
  {
    id: 'root-cause-probe',
    name: 'Root Cause Probe',
    order: 3,
    isCompleted: false,
    isActive: false,
  },
  {
    id: 'ideal-next-step',
    name: 'Ideal Next Step',
    order: 4,
    isCompleted: false,
    isActive: false,
  },
  {
    id: 'readiness-support',
    name: 'Readiness & Support',
    order: 5,
    isCompleted: false,
    isActive: false,
  },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'q1',
    categoryId: 'career-snapshot',
    question: 'Tell us about your current role, education, and what you\'re aiming for next',
    whyWeAsk: 'This gives us a clear picture of your starting point — your background, current position, and where you want to go. Without knowing your foundation, we can\'t design a roadmap that fits your journey.',
    howToAnswer: 'Share your job title, your education, and the role or career path you\'re aiming for. Be specific, but don\'t worry about perfect wording — we just need the essentials.',
    exampleAnswer: 'I work as a Software Engineer at ABC and want to switch my role to an AI Engineer in Applied ML. I have a total of 4 years of experience in backend development but my interest aligns to applied AI. I graduated from IIT Kanpur with majors in Computer Science And Engineering.',
  },
  {
    id: 'q2',
    categoryId: 'feeling-check',
    question: 'What feelings or emotions come up when you think about your career right now?',
    whyWeAsk: 'Understanding your emotional state helps us identify what\'s truly holding you back. Sometimes the biggest barriers aren\'t skills or opportunities — they\'re fear, doubt, or uncertainty.',
    howToAnswer: 'Be honest about what you\'re feeling. Are you frustrated? Overwhelmed? Excited but stuck? There\'s no wrong answer here.',
    exampleAnswer: 'I feel stuck and frustrated. I know I want to move forward, but I don\'t know the exact path. There\'s also some fear about making the wrong move.',
  },
  {
    id: 'q3',
    categoryId: 'root-cause-probe',
    question: 'What do you think is the main thing preventing you from moving forward?',
    whyWeAsk: 'Identifying the root cause helps us address the real problem, not just the symptoms. This is where we get to the heart of what\'s blocking your progress.',
    howToAnswer: 'Think about what\'s really stopping you. Is it lack of skills? Uncertainty about direction? Financial concerns? Be as specific as you can.',
    exampleAnswer: 'I think the main thing is uncertainty. I don\'t know if I\'m qualified enough, and I\'m not sure which direction would be best for my career growth.',
  },
  {
    id: 'q4',
    categoryId: 'ideal-next-step',
    question: 'If you could wave a magic wand, what would your ideal next step look like?',
    whyWeAsk: 'Your ideal scenario helps us understand your true goals and aspirations. Even if it feels far away, knowing where you want to go is the first step to getting there.',
    howToAnswer: 'Dream big! Describe your ideal role, company, or career situation. Don\'t worry about whether it\'s "realistic" — we\'re here to help make it happen.',
    exampleAnswer: 'My ideal next step would be landing a role as an AI Engineer at a company working on real-world ML applications, where I can grow my skills and make meaningful impact.',
  },
  {
    id: 'q5',
    categoryId: 'readiness-support',
    question: 'What support or resources would help you feel ready to take the next step?',
    whyWeAsk: 'Understanding what you need helps us create a personalized plan. Whether it\'s skills, confidence, connections, or clarity — we\'ll make sure you have it.',
    howToAnswer: 'Think about what would make you feel confident and ready. Is it specific skills? Mentorship? A clearer plan? List whatever comes to mind.',
    exampleAnswer: 'I would need to build stronger ML fundamentals, get hands-on project experience, and have a clear roadmap for transitioning into AI roles.',
  },
];

export const emotionalQuotes = [
  'Your story matters! The more you share, the better we can guide you.',
  'Every expert was once a beginner. Your journey starts with a single step.',
  'The only way to do great work is to love what you do. Let\'s find your path.',
  'Progress, not perfection. Every answer brings you closer to clarity.',
  'You\'re not stuck — you\'re just gathering the tools to move forward.',
];

