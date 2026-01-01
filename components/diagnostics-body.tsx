import React from 'react';
import { DiagnosticQuestion, DiagnosticCategory } from '@/types/diagnostics';
import Button from '@/components/ui/Button';

interface DiagnosticsBodyProps {
  categories: DiagnosticCategory[];
  currentQuestion: DiagnosticQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  isFollowupSection?: boolean;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onCategoryClick: (categoryId: string) => void;
  emotionalQuote: string;
  canSubmit: boolean;
}

const CategoryItem: React.FC<{ 
  category: DiagnosticCategory;
  onCategoryClick: (categoryId: string) => void;
}> = ({ category, onCategoryClick }) => {
  return (
    <div 
      className="flex items-center gap-3 py-1 cursor-pointer transition-opacity hover:opacity-80"
      onClick={() => onCategoryClick(category.id)}
    >
      <div className={`w-5 h-5 rounded border-1 flex items-center justify-center flex-shrink-0 ${
        category.isActive 
          ? 'border-[#d1a990]/60 bg-[#d1a990]/10' 
          : category.isCompleted 
          ? 'border-[#65af5b]/60 bg-[#65af5b]/20' 
          : 'border-[#f6f6f6]/30'
      }`}>
        {category.isCompleted && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#f6f6f6]">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span 
        className={`text-sm ${
          category.isActive 
            ? 'text-[#d1a990]/60' 
            : category.isCompleted 
            ? 'text-[#65af5b]/60' 
            : 'text-[#f6f6f6]/40'
        }`}
      >
        {category.name}
      </span>
    </div>
  );
};

const DiagnosticsBody: React.FC<DiagnosticsBodyProps> = ({
  categories,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  isFollowupSection = false,
  userAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  onCategoryClick,
  emotionalQuote,
  canSubmit,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <main className="py-10 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid grid-cols-1 ${isFollowupSection ? 'lg:grid-cols-1' : 'lg:grid-cols-[300px_1fr]'} gap-8`}>
          {/* Left Sidebar - Categories (only show for initial questions) */}
          {!isFollowupSection && (
            <aside className="lg:sticky lg:top-8 h-fit">
              <div className="space-y-1">
                {categories.map((category) => (
                  <CategoryItem 
                    key={category.id} 
                    category={category} 
                    onCategoryClick={onCategoryClick}
                  />
                ))}
              </div>
            </aside>
          )}
          
          {/* Right Column - Question Content */}
          <div className="flex flex-col">
            {/* Follow-up Section Header - Show prominently at top when in follow-up section */}
            {isFollowupSection && (
              <div className="mb-8 p-6 bg-[#2a3030] rounded-lg border border-[#f6f6f6]/10">
                <h3 className="text-xl font-semibold text-[#f6f6f6] mb-2">Follow-up Questions</h3>
                <p className="text-sm text-[#f6f6f6]/70">
                  We need a bit more information to complete your diagnostic. Please answer these additional questions to help us create your personalized roadmap.
                </p>
              </div>
            )}
            
            {/* Question Section */}
            <div className="mb-8">
              <h2 
                className="text-xl font-medium italic text-[#f6f6f6] mb-6"
                style={{ fontSize: '20px' }}
              >
                "{currentQuestion.question}"
              </h2>

              {/* Why We Ask */}
              <div className="mb-2 tracking-wide">
                <span 
                  className="text-sm font-medium text-[#f6f6f6]/70 mb-2 mr-1"
                  style={{ fontSize: '14px' }}
                >
                  Why we ask: 
                </span>
                <span 
                  className="text-sm font-light italic text-[#f6f6f6]/60"
                  style={{ fontSize: '14px' }}
                >
                  {currentQuestion.whyWeAsk}
                </span>
              </div>

              {/* How to Answer */}
              <div className="mb-4 tracking-wide">
                <span 
                  className="text-sm font-medium text-[#f6f6f6]/70 mb-2 mr-1"
                  style={{ fontSize: '14px' }}
                >
                  How to answer: 
                </span>
                <span 
                  className="text-sm font-light italic text-[#f6f6f6]/60"
                  style={{ fontSize: '14px' }}
                >
                  {currentQuestion.howToAnswer}
                </span>
              </div>

              {/* Textarea */}
              <div className="mb-6">
                <textarea
                  value={userAnswer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder={"Example of good answer -\n\n" + currentQuestion.exampleAnswer + "\n\n"}
                  className="w-full min-h-[200px] p-4 bg-[#1c2020] border border-[#f6f6f6]/20 rounded-lg text-[#f6f6f6] placeholder:text-[#f6f6f6]/40 focus:outline-none focus:border-[#f6f6f6]/40 transition-colors resize-y"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Bottom Section - Quote and Navigation */}
            <div className="border-t border-[#f6f6f6]/20 pt-6 mt-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left - Emotional Quote */}
                <div>
                  <p 
                    className="text-sm text-[#f6f6f6]/60 italic"
                    style={{ fontSize: '13px' }}
                  >
                    {emotionalQuote}
                  </p>
                </div>

                {/* Right - Navigation Buttons */}
                <div className="flex justify-end gap-4">
                  {currentQuestionIndex > 0 && (
                    <Button 
                      variant="ghost" 
                      onClick={onPrevious}
                      className="text-sm"
                      title="Previous question (← Arrow key)"
                    >
                      ← Prev
                    </Button>
                  )}
                  <Button 
                    variant="primary" 
                    onClick={onNext}
                    className="text-sm"
                    disabled={isLastQuestion && !canSubmit}
                    title={isLastQuestion ? "Submit (Enter key)" : "Next question (→ Arrow key)"}
                  >
                    {isLastQuestion ? 'Submit Info →' : 'Next →'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiagnosticsBody;

