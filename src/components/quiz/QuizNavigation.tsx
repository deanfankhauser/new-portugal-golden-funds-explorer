
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Target, RotateCcw } from 'lucide-react';

interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  hasUnsavedChanges: boolean;
  isStepValid: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onResetQuiz: () => void;
  onSubmit: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentStep,
  totalSteps,
  hasUnsavedChanges,
  isStepValid,
  onPrevStep,
  onNextStep,
  onResetQuiz,
  onSubmit
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        {hasUnsavedChanges && (
          <Button
            type="button"
            variant="ghost"
            onClick={onResetQuiz}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        )}
      </div>

      {isLastStep ? (
        <Button 
          type="submit" 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={!isStepValid}
          onClick={onSubmit}
        >
          Get My Recommendations
          <Target className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNextStep}
          disabled={!isStepValid}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;
