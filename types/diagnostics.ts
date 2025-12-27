export interface DiagnosticQuestion {
  id: string;
  categoryId: string;
  question: string;
  whyWeAsk: string;
  howToAnswer: string;
  exampleAnswer: string;
  userAnswer?: string;
}

export interface DiagnosticCategory {
  id: string;
  name: string;
  order: number;
  isCompleted: boolean;
  isActive: boolean;
}

