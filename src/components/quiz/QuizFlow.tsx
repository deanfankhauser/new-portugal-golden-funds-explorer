import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { useQuizState, QuizAnswers } from '@/hooks/useQuizState';
import { trackQuizEvent } from '@/services/quizAnalytics';

interface QuizFlowProps {
  isEmbedded?: boolean;
  onComplete?: (answers: QuizAnswers) => void;
}

const questions = [
  {
    id: 'risk',
    urlParam: 'risk',
    question: "What's your investment philosophy?",
    options: [
      { value: 'conservative', label: 'Capital Preservation First', description: 'I want stability and low volatility, even if returns are modest' },
      { value: 'moderate', label: 'Balanced Growth', description: 'Some risk for better returns, but not too aggressive' },
      { value: 'aggressive', label: 'Growth Focused', description: 'Comfortable with volatility for maximum growth potential' }
    ]
  },
  {
    id: 'min',
    urlParam: 'min',
    question: 'How much are you planning to invest?',
    options: [
      { value: '100k', label: '€100,000 – €250,000', description: 'Entry-level Golden Visa investment' },
      { value: '250k', label: '€250,000 – €500,000', description: 'Access to more fund options' },
      { value: '500k', label: '€500,000+', description: 'Maximum fund selection and flexibility' }
    ]
  },
  {
    id: 'nat',
    urlParam: 'nat',
    question: "What's your citizenship?",
    helpText: 'This helps us filter for US PFIC-compliant and other nationality-specific funds.',
    options: [
      { value: 'us', label: 'United States', description: 'We\'ll show PFIC-compliant funds to avoid IRS issues' },
      { value: 'uk', label: 'United Kingdom', description: 'Standard fund selection available' },
      { value: 'eu', label: 'European Union', description: 'Full access to all EU-regulated funds' },
      { value: 'other', label: 'Other', description: 'Standard fund selection available' }
    ]
  },
  {
    id: 'timeline',
    urlParam: 'timeline',
    question: 'When do you need access to your capital?',
    options: [
      { value: '5yr', label: 'After 5 years', description: 'Minimum for citizenship, shorter lock-up funds' },
      { value: '6yr', label: 'After 6 years', description: 'Standard citizenship timeline' },
      { value: '8yr', label: 'After 8+ years', description: 'Comfortable with longer lock-up for better returns' },
      { value: '10yr+', label: '10+ years', description: 'Long-term wealth building, maximum flexibility' }
    ]
  },
  {
    id: 'income',
    urlParam: 'income',
    question: 'Do you need regular income distributions?',
    options: [
      { value: 'yes', label: 'Yes, I need distributions', description: 'Annual or quarterly dividend payments' },
      { value: 'no', label: 'No, I prefer accumulation', description: 'Reinvest returns for compound growth' }
    ]
  }
];

export const QuizFlow: React.FC<QuizFlowProps> = ({ 
  isEmbedded = false, 
  onComplete 
}) => {
  const { answers, setAnswer, currentStep, isComplete, reset, goToResults, totalSteps } = useQuizState();
  const [hasStarted, setHasStarted] = React.useState(false);

  // Track quiz start
  useEffect(() => {
    if (currentStep === 0 && !hasStarted && Object.keys(answers).filter(k => answers[k as keyof QuizAnswers]).length === 0) {
      // User is at start
    }
  }, [currentStep, hasStarted, answers]);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      trackQuizEvent('completed', {
        answers: answers as any,
        resultsCount: 0, // Will be updated when results load
      });
      
      if (onComplete) {
        onComplete(answers);
      } else {
        // Navigate to results page
        goToResults();
      }
    }
  }, [isComplete, answers, onComplete, goToResults]);

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentStep];
    
    // Track first answer as quiz start
    if (!hasStarted) {
      setHasStarted(true);
      trackQuizEvent('started');
    }
    
    setAnswer(currentQuestion.urlParam as keyof QuizAnswers, value);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Remove the current step's answer to go back
      const prevQuestion = questions[currentStep - 1];
      const newParams = new URLSearchParams(window.location.search);
      
      // Remove all answers from current step onwards
      for (let i = currentStep; i < questions.length; i++) {
        newParams.delete(questions[i].urlParam);
      }
      
      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
      window.location.reload(); // Simple reload to reset state
    }
  };

  if (isComplete) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Finding your matches...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'max-w-2xl mx-auto'}`}>
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      
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
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          selectedAnswer={answers[currentQuestion.urlParam as keyof QuizAnswers]}
        />
      </div>
    </div>
  );
};

export default QuizFlow;
