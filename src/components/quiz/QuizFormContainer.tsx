
import React from 'react';
import { useQuizFormLogic } from './QuizFormLogic';
import QuizFormView from './QuizFormView';
import * as z from 'zod';

const quizSchema = z.object({
  riskAppetite: z.enum(['low', 'medium', 'high']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  ticketSize: z.enum(['under-300k', '300k-500k', 'over-500k']),
  citizenship: z.enum(['us', 'uk', 'australia', 'canada', 'china', 'other'])
});

export type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormContainerProps {
  onSubmit: (data: QuizFormData) => void;
}

const QuizFormContainer: React.FC<QuizFormContainerProps> = ({ onSubmit }) => {
  const {
    form,
    currentStep,
    currentQuestion,
    hasUnsavedChanges,
    totalSteps,
    nextStep,
    prevStep,
    handleSubmit,
    resetQuiz,
    isStepValid,
    getFieldError
  } = useQuizFormLogic({ onSubmit });

  return (
    <QuizFormView
      form={form}
      currentStep={currentStep}
      currentQuestion={currentQuestion}
      hasUnsavedChanges={hasUnsavedChanges}
      totalSteps={totalSteps}
      isStepValid={isStepValid()}
      getFieldError={getFieldError}
      onPrevStep={prevStep}
      onNextStep={nextStep}
      onResetQuiz={resetQuiz}
      onSubmit={() => form.handleSubmit(handleSubmit)()}
    />
  );
};

export default QuizFormContainer;
