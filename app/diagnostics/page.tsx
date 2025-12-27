'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer';
import MainHeader from '@/components/main-header';
import DiagnosticsBody from '@/components/diagnostics-body';
import { diagnosticCategories, diagnosticQuestions, emotionalQuotes } from '@/data/diagnostics-data';
import { DiagnosticCategory, DiagnosticQuestion } from '@/types/diagnostics';

const DiagnosticsPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = diagnosticQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const currentQuote = emotionalQuotes[currentQuestionIndex % emotionalQuotes.length];

  // Check if all questions are answered
  const allQuestionsAnswered = diagnosticQuestions.every(
    q => answers[q.id] && answers[q.id].trim() !== ''
  );

  // Update categories based on current question and completed answers
  const updatedCategories = diagnosticCategories.map((cat) => {
    const categoryQuestions = diagnosticQuestions.filter(q => q.categoryId === cat.id);
    const allAnswered = categoryQuestions.every(q => answers[q.id] && answers[q.id].trim() !== '');
    const isActive = currentQuestion.categoryId === cat.id;

    return {
      ...cat,
      isCompleted: allAnswered,
      isActive: isActive,
    };
  });

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < diagnosticQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Only submit if all questions are answered
      if (allQuestionsAnswered) {
        console.log('Submitting answers:', answers);
        // TODO: Submit to backend
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Find the first question in the clicked category
    const categoryQuestionIndex = diagnosticQuestions.findIndex(
      q => q.categoryId === categoryId
    );
    
    if (categoryQuestionIndex !== -1) {
      setCurrentQuestionIndex(categoryQuestionIndex);
    }
  };

  return (
    <div className="bg-[#1a1a1a]/10">
      <Navbar />
      <MainHeader
        title="Let's Find What's Holding You Back"
        description="Answer a few guided questions to uncover where you stand, why you feel stuck, and how we can help you evolve — with clarity, confidence, and a roadmap that's truly yours."
        phases={[]}
      />
      <DiagnosticsBody
        categories={updatedCategories}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={diagnosticQuestions.length}
        userAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCategoryClick={handleCategoryClick}
        emotionalQuote={currentQuote}
        canSubmit={allQuestionsAnswered}
      />
      <Footer />
    </div>
  );
};

export default DiagnosticsPage;

