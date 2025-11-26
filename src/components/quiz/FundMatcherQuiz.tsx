import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { QuizNoResults } from './QuizNoResults';
import { useFundMatcherQuery, QuizAnswers } from '@/hooks/useFundMatcherQuery';
import { trackQuizEvent } from '@/services/quizAnalytics';

interface FundMatcherQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const questions = [
  {
    id: 'budget',
    question: 'How much capital are you looking to allocate?',
    options: [
      { value: 'under250k', label: 'Under €250,000', description: 'Ideal for first-time investors' },
      { value: 'under500k', label: 'Under €500,000', description: 'Access to more fund options' },
      { value: '500k+', label: '€500,000 or more', description: 'Maximum fund selection' }
    ]
  },
  {
    id: 'strategy',
    question: 'What is your primary goal?',
    options: [
      { value: 'safety', label: 'Safety & Stability', description: 'Focus on capital preservation' },
      { value: 'growth', label: 'Growth & Returns', description: 'Higher potential returns' },
      { value: 'fast_exit', label: 'Fast Exit', description: 'Short lock-up period (≤6 years)' }
    ]
  },
  {
    id: 'income',
    question: 'Do you need regular income distributions?',
    options: [
      { value: 'yes', label: 'Yes', description: 'Annual or quarterly dividends' },
      { value: 'no', label: 'No', description: 'I prefer capital accumulation' }
    ]
  },
  {
    id: 'riskTolerance',
    question: 'How comfortable are you with investment volatility?',
    options: [
      { value: 'conservative', label: 'Conservative', description: 'Prefer stable, predictable returns even if lower' },
      { value: 'moderate', label: 'Moderate', description: 'Accept some fluctuation for better potential returns' },
      { value: 'aggressive', label: 'Aggressive', description: 'Comfortable with high volatility for maximum growth' }
    ]
  },
  {
    id: 'timeline',
    question: 'What is your investment timeline?',
    options: [
      { value: '1-3years', label: '1–3 years', description: 'Short-term investment with early liquidity' },
      { value: '3-5years', label: '3–5 years', description: 'Medium-term commitment for balanced returns' },
      { value: '5plus', label: '5+ years', description: 'Long-term investment for maximum growth potential' }
    ]
  }
];

export const FundMatcherQuiz: React.FC<FundMatcherQuizProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  const { data: matchedFunds, isLoading, isFetched } = useFundMatcherQuery(answers);

  // Track quiz start
  useEffect(() => {
    if (open && currentStep === 0 && Object.keys(answers).length === 0) {
      trackQuizEvent('started');
    }
  }, [open]);

  // Parse URL parameters on mount to handle shared links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quizParam = params.get('quiz');
    
    if (quizParam && open) {
      try {
        const quizParams = new URLSearchParams(decodeURIComponent(quizParam));
        const parsedAnswers: Partial<QuizAnswers> = {};
        
        // Parse each answer from URL
        const validKeys = ['budget', 'strategy', 'income', 'riskTolerance', 'timeline'];
        quizParams.forEach((value, key) => {
          if (validKeys.includes(key)) {
            (parsedAnswers as any)[key] = value;
          }
        });
        
        // If we have valid answers, set them and trigger search
        if (Object.keys(parsedAnswers).length > 0) {
          setAnswers(parsedAnswers as QuizAnswers);
          setIsSearching(true);
        }
      } catch (err) {
        console.error('Failed to parse quiz URL parameters:', err);
      }
    }
  }, [open]);

  // Show results when query completes
  useEffect(() => {
    if (Object.keys(answers).length === 5 && isSearching) {
      if (isFetched && !isLoading) {
        setIsSearching(false);
        setShowResults(true);
        // Track quiz completion
        trackQuizEvent('completed', {
          answers,
          resultsCount: matchedFunds?.length || 0,
        });
      }
    }
  }, [answers, isSearching, isFetched, isLoading, matchedFunds]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show searching state - results will show when query completes
      setIsSearching(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setIsSearching(false);
    setIsEditingPreferences(false);
  };

  const handleEditPreferences = () => {
    setCurrentStep(0);
    setShowResults(false);
    setIsSearching(false);
    setIsEditingPreferences(true);
    // Keep answers so user can modify them
  };

  const handleSkipToResults = () => {
    setShowResults(true);
    setIsEditingPreferences(false);
  };

  const handleClose = () => {
    // Track abandonment if quiz was started but not completed
    if (Object.keys(answers).length > 0 && Object.keys(answers).length < 5 && !showResults) {
      trackQuizEvent('abandoned', {
        abandonedAtStep: currentStep,
        answers: answers as QuizAnswers,
      });
    }
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative min-h-[600px] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Fund Matcher Quiz</h2>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Close
              </Button>
            </div>
            
            {!showResults && !isSearching && (
              <QuizProgress currentStep={currentStep} totalSteps={questions.length} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Finding your perfect matches...</p>
              </div>
            ) : showResults ? (
              matchedFunds && matchedFunds.length > 0 ? (
                <QuizResults 
                  funds={matchedFunds}
                  answers={answers}
                  onReset={handleReset}
                  onEditPreferences={handleEditPreferences}
                  onClose={handleClose}
                />
              ) : (
                <QuizNoResults onReset={handleReset} onClose={handleClose} answers={answers} />
              )
            ) : (
              <div className="space-y-6">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                
                {isEditingPreferences && (
                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={handleSkipToResults}
                  >
                    Skip to Results
                  </Button>
                )}
                
                <QuizQuestion
                  question={questions[currentStep].question}
                  options={questions[currentStep].options}
                  onAnswer={(value) => handleAnswer(questions[currentStep].id, value)}
                  selectedAnswer={answers[questions[currentStep].id as keyof QuizAnswers]}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
