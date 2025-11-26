import React from 'react';
import { cn } from '@/lib/utils';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
