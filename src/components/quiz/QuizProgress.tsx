
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Save } from 'lucide-react';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  hasUnsavedChanges: boolean;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ 
  currentStep, 
  totalSteps, 
  hasUnsavedChanges 
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Investor Profile Questionnaire</h2>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Save className="w-4 h-4" />
            Progress saved
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Question {currentStep + 1} of {totalSteps}</span>
          <span className="text-sm text-gray-600 ml-4">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="w-48" />
      </div>
    </div>
  );
};

export default QuizProgress;
