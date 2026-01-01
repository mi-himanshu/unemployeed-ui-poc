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
  const [followupQuestions, setFollowupQuestions] = useState<DiagnosticQuestion[]>([]);
  const [isInFollowupSection, setIsInFollowupSection] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map backend question to frontend format
  const mapQuestionToFrontend = (q: any, index: number, isFollowup: boolean = false): DiagnosticQuestion => {
    const categoryMap: Record<string, string> = {
      'career_snapshot': 'career-snapshot',
      'feeling_check': 'feeling-check',
      'root_cause_probe': 'root-cause-probe',
      'ideal_next_step': 'ideal-next-step',
      'readiness_support': 'readiness-support',
      'profile': 'career-snapshot',
      'stuckness': 'feeling-check',
      'roadmap_inputs': 'ideal-next-step',
      'general': 'career-snapshot',
    };
    
    const categoryId = categoryMap[q.category] || 'career-snapshot';
    
    // Use database values if available, otherwise fallback to defaults
    const defaultHelpTexts: Record<string, { whyWeAsk: string; howToAnswer: string; exampleAnswer: string }> = {
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
    
    const defaultHelpText = defaultHelpTexts[categoryId] || defaultHelpTexts['career-snapshot'];
    
    return {
      id: q.question_id,
      categoryId: isFollowup ? 'followup' : categoryId,
      question: q.question_text,
      whyWeAsk: q.why_we_ask || defaultHelpText.whyWeAsk,
      howToAnswer: q.how_to_answer || defaultHelpText.howToAnswer,
      exampleAnswer: defaultHelpText.exampleAnswer, // Keep example answer as fallback for now
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
        
        // If diagnostic is already complete, redirect to roadmap generation
        if (response.is_complete) {
          console.log('Diagnostic already complete, redirecting to roadmap generation');
          // Check if roadmap already exists
          try {
            const roadmaps = await roadmapApi.listRoadmaps();
            if (roadmaps.roadmaps.length > 0) {
              router.push('/roadmap');
            } else {
              // Generate roadmap from completed diagnostic
              router.push(`/roadmap?generate=true&sessionId=${response.session_id}`);
            }
          } catch (err) {
            console.error('Error checking roadmaps:', err);
            router.push(`/roadmap?generate=true&sessionId=${response.session_id}`);
          }
          return;
        }
        
        // If all questions are answered and ready to complete, trigger completion
        if (response.ready_to_complete && response.session_id) {
          console.log('All questions answered, ready to complete diagnostic');
          // Load existing responses
          if (response.existing_responses && Object.keys(response.existing_responses).length > 0) {
            setAnswers(response.existing_responses);
          }
          // Automatically submit to trigger verification and completion
          try {
            setSubmitting(true);
            const submitResponse = await diagnosticsApi.submitResponse(response.session_id, response.existing_responses || {});
            
            if (submitResponse.status === 'complete' || submitResponse.missing_items.length === 0) {
              await diagnosticsApi.completeDiagnostic(response.session_id);
              const roadmapResponse = await roadmapApi.generateRoadmap(response.session_id);
              router.push(`/roadmap?roadmapId=${roadmapResponse.roadmap_id}`);
            } else {
              // If verification shows missing items, show follow-up questions
              if (submitResponse.followup_questions && submitResponse.followup_questions.length > 0) {
                const followupMapped = submitResponse.followup_questions.map((q, index) => 
                  mapQuestionToFrontend(q, index, true)
                );
                setFollowupQuestions(followupMapped);
                setIsInFollowupSection(true);
                setCurrentQuestionIndex(0);
                setSubmitting(false);
              } else {
                setError('Please provide more detailed answers to complete the diagnostic.');
                setSubmitting(false);
              }
            }
          } catch (err: any) {
            console.error('Error completing diagnostic:', err);
            setError('Error completing diagnostic. Please try again.');
            setSubmitting(false);
          }
          return;
        }
        
        // Load existing responses if resuming
        if (response.existing_responses && Object.keys(response.existing_responses).length > 0) {
          console.log('Resuming session with existing responses:', response.existing_responses);
          setAnswers(response.existing_responses);
        }
        
        const mappedQuestions = response.questions.map((q, index) => 
          mapQuestionToFrontend(q, index, false)
        );
        console.log('mappedQuestions', mappedQuestions);
        setQuestions(mappedQuestions);
        
        // Handle follow-up questions separately
        if (response.followup_questions && response.followup_questions.length > 0) {
          const mappedFollowups = response.followup_questions.map((q, index) => 
            mapQuestionToFrontend(q, index, true)
          );
          setFollowupQuestions(mappedFollowups);
          // If we have follow-ups and all initial questions are answered, start with follow-ups
          if (mappedQuestions.every(q => response.existing_responses?.[q.id])) {
            setIsInFollowupSection(true);
            setCurrentQuestionIndex(0);
          }
        } else {
          setFollowupQuestions([]);
        }
        
        // If no questions but we have responses, something went wrong
        if (mappedQuestions.length === 0 && response.existing_responses && Object.keys(response.existing_responses).length > 0) {
          console.warn('No questions but have responses - this should not happen');
          setError('Unable to load questions. Please try refreshing the page.');
          setLoading(false);
          return;
        }
        
        // If resuming and we have existing answers, set current question index to first unanswered
        const currentQuestions = isInFollowupSection ? followupQuestions : mappedQuestions;
        if (response.existing_responses && Object.keys(response.existing_responses).length > 0 && currentQuestions.length > 0) {
          // Find first unanswered question
          const firstUnansweredIndex = currentQuestions.findIndex(q => !response.existing_responses?.[q.id]);
          if (firstUnansweredIndex >= 0) {
            setCurrentQuestionIndex(firstUnansweredIndex);
          }
        }
      } catch (err: any) {
        // Log error for debugging
        console.error('[Diagnostics] Error fetching questions:', {
          error: err,
          message: err.message,
          stack: err.stack,
          status: err.status,
          timestamp: new Date().toISOString(),
        });
        
        // Only redirect to error page for backend errors (500+), not client errors
        // Check if we're already on error page to prevent infinite loops
        if (typeof window !== 'undefined' && (!err.status || err.status >= 500)) {
          const isAlreadyOnErrorPage = window.location.pathname === '/error';
          const hasRedirected = sessionStorage.getItem('error_redirected') === 'true';
          
          if (!isAlreadyOnErrorPage && !hasRedirected) {
            sessionStorage.setItem('error_redirected', 'true');
            window.location.href = '/error';
          } else {
            // Already redirected or on error page - just show generic message
            setError('Unable to load questions. Please try again.');
          }
        } else {
          // For other errors, show generic message
          setError('Unable to load questions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, authLoading, router]);

  // Get current questions based on section
  const currentQuestions = isInFollowupSection ? followupQuestions : questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] || '') : '';
  const currentQuote = emotionalQuotes[currentQuestionIndex % emotionalQuotes.length];

  // Check if all questions in current section are answered
  const allQuestionsAnswered = currentQuestions.length > 0 && currentQuestions.every(
    q => answers[q.id] && answers[q.id].trim() !== ''
  );

  // Update categories based on current question and completed answers
  // Only show categories for initial questions, not follow-ups
  const updatedCategories = diagnosticCategories.map((cat) => {
    const categoryQuestions = questions.filter(q => q.categoryId === cat.id);
    const allAnswered = categoryQuestions.length > 0 && categoryQuestions.every(q => answers[q.id] && answers[q.id].trim() !== '');
    // Only mark as active if we're in initial questions section and the category matches
    const isActive = !isInFollowupSection && currentQuestion?.categoryId === cat.id;

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
    } else if (isInFollowupSection && questions.length > 0) {
      // If at first follow-up question, go back to last initial question
      setIsInFollowupSection(false);
      setCurrentQuestionIndex(questions.length - 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // If we're in initial questions and all are answered, check for follow-ups
      if (!isInFollowupSection && allQuestionsAnswered && followupQuestions.length > 0) {
        setIsInFollowupSection(true);
        setCurrentQuestionIndex(0);
      } else if (allQuestionsAnswered && sessionId) {
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
          mapQuestionToFrontend(q, index, true)
        );
        setFollowupQuestions(followupMapped);
        setIsInFollowupSection(true);
        setCurrentQuestionIndex(0);
        setSubmitting(false);
        return;
      }

      if (submitResponse.status === 'complete' || submitResponse.missing_items.length === 0) {
        await diagnosticsApi.completeDiagnostic(sessionId);
        const roadmapResponse = await roadmapApi.generateRoadmap(sessionId);
        router.push(`/roadmap?roadmapId=${roadmapResponse.roadmap_id}`);
      } else {
        // This is a validation error, not a system error - safe to show
        setError('Please provide more detailed answers to complete the diagnostic.');
        setSubmitting(false);
      }
    } catch (err: any) {
      // Log error for debugging
      console.error('[Diagnostics] Error submitting answers:', {
        error: err,
        message: err.message,
        stack: err.stack,
        status: err.status,
        sessionId,
        timestamp: new Date().toISOString(),
      });
      
      // Only redirect to error page for backend errors (500+), not client errors
      // Check if we're already on error page to prevent infinite loops
      if (typeof window !== 'undefined' && (!err.status || err.status >= 500)) {
        const isAlreadyOnErrorPage = window.location.pathname === '/error';
        const hasRedirected = sessionStorage.getItem('error_redirected') === 'true';
        
        if (!isAlreadyOnErrorPage && !hasRedirected) {
          sessionStorage.setItem('error_redirected', 'true');
          window.location.href = '/error';
        } else {
          // Already redirected or on error page - just show generic message
          setError('Unable to submit answers. Please try again.');
          setSubmitting(false);
        }
      } else {
        // For other errors, show generic message
        setError('Unable to submit answers. Please try again.');
        setSubmitting(false);
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Only allow clicking categories when in initial questions section
    if (isInFollowupSection) return;
    
    const categoryQuestionIndex = questions.findIndex(
      q => q.categoryId === categoryId
    );
    
    if (categoryQuestionIndex !== -1) {
      setCurrentQuestionIndex(categoryQuestionIndex);
      setIsInFollowupSection(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-[#1a1a1a]/10 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">Loading questions...</div>
      </div>
    );
  }

  // If there's an error and no questions, redirect to error page
  if (error && questions.length === 0) {
    if (typeof window !== 'undefined') {
      window.location.href = '/error';
    }
    return null;
  }

  if (!currentQuestion) {
    return (
      <div className="bg-[#1a1a1a]/10 min-h-screen flex items-center justify-center">
        <div className="text-[#f6f6f6]">No questions available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Header Section with Animated Background */}
        <div className="relative py-20 px-6 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Red wave-like shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradientDiagnostics" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#d32f2f" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#d32f2f" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
                    fill="url(#waveGradientDiagnostics)"
                    className="animate-pulse"
                  />
                  <path
                    d="M0,250 Q400,150 800,250 T1600,250 L1600,400 L0,400 Z"
                    fill="url(#waveGradientDiagnostics)"
                    className="animate-pulse"
                    style={{ animationDelay: '1s' }}
                  />
                </svg>
              </div>
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
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

          {/* Header Content */}
          <div className="relative z-10">
            <MainHeader
              title="Let's Find What's Holding You Back"
              description="Answer a few guided questions to uncover where you stand, why you feel stuck, and how we can help you evolve — with clarity, confidence, and a roadmap that's truly yours."
              phases={[]}
            />
          </div>
        </div>

        {/* Body Section with dark background */}
        <div className="flex-1 bg-[#1a1a1a]">
      {/* Validation errors (like "provide more detailed answers") are shown as toasts, not inline */}
      {/* Backend errors are logged and redirect to /error page - never shown to users */}
      <DiagnosticsBody
        categories={updatedCategories}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentQuestions.length}
        isFollowupSection={isInFollowupSection}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiagnosticsPage;

