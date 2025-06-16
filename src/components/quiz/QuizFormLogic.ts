
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QuizFormData } from './QuizFormContainer';
import { quizQuestions } from './QuizQuestionData';

const quizSchema = z.object({
  riskAppetite: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: "Please select your risk appetite to continue" })
  }),
  investmentHorizon: z.enum(['short', 'medium', 'long'], {
    errorMap: () => ({ message: "Please select your investment timeline to continue" })
  }),
  ticketSize: z.enum(['under-300k', '300k-500k', 'over-500k'], {
    errorMap: () => ({ message: "Please select your investment budget to continue" })
  }),
  citizenship: z.enum(['us', 'uk', 'australia', 'canada', 'china', 'other'], {
    errorMap: () => ({ message: "Please select your citizenship to continue" })
  })
});

interface QuizFormLogicProps {
  onSubmit: (data: QuizFormData) => void;
}

export const useQuizFormLogic = ({ onSubmit }: QuizFormLogicProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    mode: 'onChange'
  });

  // Save progress to localStorage (only in browser)
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.keys(value).length > 0 && typeof window !== 'undefined') {
        localStorage.setItem('quiz-progress', JSON.stringify({
          data: value,
          currentStep,
          timestamp: Date.now()
        }));
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep]);

  // Load saved progress on component mount (only in browser)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('quiz-progress');
    if (saved) {
      try {
        const { data, currentStep: savedStep, timestamp } = JSON.parse(saved);
        // Only restore if saved within last 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          Object.keys(data).forEach(key => {
            if (data[key]) {
              form.setValue(key as keyof QuizFormData, data[key]);
            }
          });
          setCurrentStep(savedStep);
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.log('Could not restore quiz progress');
      }
    }
  }, [form]);

  const currentQuestion = quizQuestions[currentStep];

  const nextStep = async () => {
    const fieldName = currentQuestion.key as keyof QuizFormData;
    const isValid = await form.trigger(fieldName);
    
    if (isValid && currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: QuizFormData) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz-progress');
    }
    setHasUnsavedChanges(false);
    onSubmit(data);
  };

  const resetQuiz = () => {
    form.reset();
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz-progress');
    }
    setHasUnsavedChanges(false);
  };

  const isStepValid = () => {
    const fieldName = currentQuestion.key as keyof QuizFormData;
    const value = form.watch(fieldName);
    return value !== undefined;
  };

  const getFieldError = () => {
    const fieldName = currentQuestion.key as keyof QuizFormData;
    return form.formState.errors[fieldName]?.message;
  };

  return {
    form,
    currentStep,
    currentQuestion,
    hasUnsavedChanges,
    totalSteps: quizQuestions.length,
    nextStep,
    prevStep,
    handleSubmit,
    resetQuiz,
    isStepValid,
    getFieldError
  };
};
