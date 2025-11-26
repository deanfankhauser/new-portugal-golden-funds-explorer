import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { QuizNoResults } from './QuizNoResults';
import { useFundMatcherQuery, QuizAnswers } from '@/hooks/useFundMatcherQuery';

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
    id: 'usTaxAccount',
    question: 'Are you investing through a US tax account (IRA/401k)?',
    options: [
      { value: 'yes', label: 'Yes', description: 'We\'ll highlight QEF-eligible funds for you' },
      { value: 'no', label: 'No', description: 'Standard investment account' }
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

  const { data: matchedFunds, isLoading, isFetched } = useFundMatcherQuery(answers);

  // Show results when query completes
  useEffect(() => {
    if (Object.keys(answers).length === 5 && isSearching) {
      if (isFetched && !isLoading) {
        setIsSearching(false);
        setShowResults(true);
      }
    }
  }, [answers, isSearching, isFetched, isLoading]);

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
  };

  const handleClose = () => {
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
                  onReset={handleReset} 
                  onClose={handleClose}
                  showQEFHighlight={answers.usTaxAccount === 'yes'}
                />
              ) : (
                <QuizNoResults onReset={handleReset} onClose={handleClose} />
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
