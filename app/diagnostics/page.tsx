'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import MainHeader from '@/components/main-header';
import DiagnosticsBody from '@/components/diagnostics-body';
import { diagnosticCategories, emotionalQuotes } from '@/data/diagnostics-data';
import { DiagnosticCategory, DiagnosticQuestion } from '@/types/diagnostics';
import { diagnosticsApi, roadmapApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const DiagnosticsPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map backend question to frontend format
  const mapQuestionToFrontend = (q: any, index: number): DiagnosticQuestion => {
    const categoryMap: Record<string, string> = {
      'career_snapshot': 'career-snapshot',
      'feeling_check': 'feeling-check',
      'root_cause_probe': 'root-cause-probe',
      'ideal_next_step': 'ideal-next-step',
      'readiness_support': 'readiness-support',
      'profile': 'career-snapshot',
      'stuckness': 'feeling-check',
      'roadmap_inputs': 'ideal-next-step',
    };
    
    const categoryId = categoryMap[q.category] || 'career-snapshot';
    
    const helpTexts: Record<string, { whyWeAsk: string; howToAnswer: string; exampleAnswer: string }> = {
      'career-snapshot': {
        whyWeAsk: 'This gives us a clear picture of your starting point — your background, current position, and where you want to go.',
        howToAnswer: 'Share your job title, your education, and the role or career path you\'re aiming for. Be specific, but don\'t worry about perfect wording.',
        exampleAnswer: 'I work as a Software Engineer at ABC and want to switch my role to an AI Engineer in Applied ML. I have a total of 4 years of experience in backend development but my interest aligns to applied AI. I graduated from IIT Kanpur with majors in Computer Science And Engineering.',
      },
      'feeling-check': {
        whyWeAsk: 'Understanding your emotional state helps us identify what\'s truly holding you back. Sometimes the biggest barriers aren\'t skills or opportunities — they\'re fear, doubt, or uncertainty.',
        howToAnswer: 'Be honest about what you\'re feeling. Are you frustrated? Overwhelmed? Excited but stuck? There\'s no wrong answer here.',
        exampleAnswer: 'I feel stuck and frustrated. I know I want to move forward, but I don\'t know the exact path. There\'s also some fear about making the wrong move.',
      },
      'root-cause-probe': {
        whyWeAsk: 'Identifying the root cause helps us address the real problem, not just the symptoms. This is where we get to the heart of what\'s blocking your progress.',
        howToAnswer: 'Think about what\'s really stopping you. Is it lack of skills? Uncertainty about direction? Financial concerns? Be as specific as you can.',
        exampleAnswer: 'I think the main thing is uncertainty. I don\'t know if I\'m qualified enough, and I\'m not sure which direction would be best for my career growth.',
      },
      'ideal-next-step': {
        whyWeAsk: 'Your ideal scenario helps us understand your true goals and aspirations. Even if it feels far away, knowing where you want to go is the first step to getting there.',
        howToAnswer: 'Dream big! Describe your ideal role, company, or career situation. Don\'t worry about whether it\'s "realistic" — we\'re here to help make it happen.',
        exampleAnswer: 'My ideal next step would be landing a role as an AI Engineer at a company working on real-world ML applications, where I can grow my skills and make meaningful impact.',
      },
      'readiness-support': {
        whyWeAsk: 'Understanding what you need helps us create a personalized plan. Whether it\'s skills, confidence, connections, or clarity — we\'ll make sure you have it.',
        howToAnswer: 'Think about what would make you feel confident and ready. Is it specific skills? Mentorship? A clearer plan? List whatever comes to mind.',
        exampleAnswer: 'I would need to build stronger ML fundamentals, get hands-on project experience, and have a clear roadmap for transitioning into AI roles.',
      },
    };
    
    const helpText = helpTexts[categoryId] || helpTexts['career-snapshot'];
    
    return {
      id: q.question_id,
      categoryId: categoryId,
      question: q.question_text,
      whyWeAsk: helpText.whyWeAsk,
      howToAnswer: helpText.howToAnswer,
      exampleAnswer: helpText.exampleAnswer,
    };
  };

  // Fetch questions from backend on mount
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await diagnosticsApi.startDiagnostic();
        setSessionId(response.session_id);
        
        const mappedQuestions = response.questions.map((q, index) => 
          mapQuestionToFrontend(q, index)
        );
        setQuestions(mappedQuestions);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, authLoading, router]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] || '') : '';
  const currentQuote = emotionalQuotes[currentQuestionIndex % emotionalQuotes.length];

  // Check if all questions are answered
  const allQuestionsAnswered = questions.length > 0 && questions.every(
    q => answers[q.id] && answers[q.id].trim() !== ''
  );

  // Update categories based on current question and completed answers
  const updatedCategories = diagnosticCategories.map((cat) => {
    const categoryQuestions = questions.filter(q => q.categoryId === cat.id);
    const allAnswered = categoryQuestions.length > 0 && categoryQuestions.every(q => answers[q.id] && answers[q.id].trim() !== '');
    const isActive = currentQuestion?.categoryId === cat.id;

    return {
      ...cat,
      isCompleted: allAnswered,
      isActive: isActive,
    };
  });

  const handleAnswerChange = (answer: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (allQuestionsAnswered && sessionId) {
        await handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!sessionId || !allQuestionsAnswered) return;

    try {
      setSubmitting(true);
      setError(null);

      const submitResponse = await diagnosticsApi.submitResponse(sessionId, answers);
      
      if (submitResponse.followup_questions && submitResponse.followup_questions.length > 0) {
        const followupMapped = submitResponse.followup_questions.map((q, index) => 
          mapQuestionToFrontend(q, questions.length + index)
        );
        setQuestions(prev => [...prev, ...followupMapped]);
        setSubmitting(false);
        return;
      }

      if (submitResponse.status === 'complete' || submitResponse.missing_items.length === 0) {
        await diagnosticsApi.completeDiagnostic(sessionId);
        const roadmapResponse = await roadmapApi.generateRoadmap(sessionId);
        router.push(`/roadmap?roadmapId=${roadmapResponse.roadmap_id}`);
      } else {
        setError('Please provide more detailed answers to complete the diagnostic.');
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error('Error submitting answers:', err);
      setError(err.message || 'Failed to submit answers. Please try again.');
      setSubmitting(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const categoryQuestionIndex = questions.findIndex(
      q => q.categoryId === categoryId
    );
    
    if (categoryQuestionIndex !== -1) {
      setCurrentQuestionIndex(categoryQuestionIndex);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-[#1a1a1a]/10 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading questions...</div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="bg-[#1a1a1a]/10 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6] text-center">
          <p className="mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#d1a990] text-[#1a1a1a] rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-[#1a1a1a]/10 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">No questions available.</div>
      </div>
    );
  }

  return (
    <div className="">
      <Navbar />
      <MainHeader
        title="Let's Find What's Holding You Back"
        description="Answer a few guided questions to uncover where you stand, why you feel stuck, and how we can help you evolve — with clarity, confidence, and a roadmap that's truly yours."
        phases={[]}
      />
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}
      <DiagnosticsBody
        categories={updatedCategories}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        userAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCategoryClick={handleCategoryClick}
        emotionalQuote={currentQuote}
        canSubmit={allQuestionsAnswered && !submitting}
      />
      {submitting && (
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <div className="text-[#f6f6f6]/60">Submitting your answers and generating your roadmap...</div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DiagnosticsPage;

