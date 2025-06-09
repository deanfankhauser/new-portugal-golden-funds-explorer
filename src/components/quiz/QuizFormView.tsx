
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import { UseFormReturn } from 'react-hook-form';
import { QuizFormData } from './QuizFormContainer';

interface QuestionData {
  key: string;
  title: string;
  subtitle: string;
  helpText: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelect?: boolean;
  options?: Array<{
    value: string;
    label: string;
    description: string;
    badge?: string;
    badgeColor?: string;
  }>;
  selectOptions?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

interface QuizFormViewProps {
  form: UseFormReturn<QuizFormData>;
  currentStep: number;
  currentQuestion: QuestionData;
  hasUnsavedChanges: boolean;
  totalSteps: number;
  isStepValid: boolean;
  getFieldError: () => string | undefined;
  onPrevStep: () => void;
  onNextStep: () => void;
  onResetQuiz: () => void;
  onSubmit: () => void;
}

const QuizFormView: React.FC<QuizFormViewProps> = ({
  form,
  currentStep,
  currentQuestion,
  hasUnsavedChanges,
  totalSteps,
  isStepValid,
  getFieldError,
  onPrevStep,
  onNextStep,
  onResetQuiz,
  onSubmit
}) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <QuizProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <CardDescription className="text-base">
          Answer {totalSteps} detailed questions to get personalized fund recommendations tailored to your profile
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <QuizQuestion
              question={currentQuestion}
              control={form.control}
              getFieldError={getFieldError}
            />

            <QuizNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              hasUnsavedChanges={hasUnsavedChanges}
              isStepValid={isStepValid}
              onPrevStep={onPrevStep}
              onNextStep={onNextStep}
              onResetQuiz={onResetQuiz}
              onSubmit={onSubmit}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuizFormView;
