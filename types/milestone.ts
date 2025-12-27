export interface Milestone {
  title: string;
  status: 'Completed' | 'Continue' | 'Start';
  description: string;
  whyItMatters: string;
  duration: string;
  phaseId: string;
}

export interface Phase {
  id: string;
  name: string;
  number: number;
  icon: string; // Icon name or component identifier
  isActive: boolean;
}