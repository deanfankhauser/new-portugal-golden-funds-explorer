
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import { Target, Clock, Euro, User } from 'lucide-react';

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

export type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormContainerProps {
  onSubmit: (data: QuizFormData) => void;
}

const QuizFormContainer: React.FC<QuizFormContainerProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    mode: 'onChange'
  });

  // Save progress to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.keys(value).length > 0) {
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

  // Load saved progress on component mount
  useEffect(() => {
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

  const questions = [
    {
      key: 'riskAppetite',
      title: 'What is your risk appetite?',
      subtitle: 'Understanding your comfort level with investment volatility helps us recommend suitable funds',
      helpText: 'Risk appetite reflects how much volatility you can handle in your investment returns. Higher risk typically offers potential for higher returns but with greater uncertainty.',
      icon: Target,
      options: [
        {
          value: 'low',
          label: 'Conservative',
          description: 'I prefer stable, predictable returns with minimal risk of losing my principal investment',
          badge: 'Low Risk',
          badgeColor: 'bg-green-100 text-green-800'
        },
        {
          value: 'medium',
          label: 'Moderate', 
          description: 'I\'m comfortable with some volatility if it means potentially higher returns over time',
          badge: 'Balanced',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        },
        {
          value: 'high',
          label: 'Aggressive',
          description: 'I\'m willing to accept significant volatility for the potential of substantial returns',
          badge: 'High Risk',
          badgeColor: 'bg-red-100 text-red-800'
        }
      ]
    },
    {
      key: 'investmentHorizon',
      title: 'What is your investment time horizon?',
      subtitle: 'Your timeline affects which investment strategies and fund structures are most appropriate',
      helpText: 'Longer investment horizons typically allow for more aggressive strategies as there\'s more time to recover from short-term volatility.',
      icon: Clock,
      options: [
        {
          value: 'short',
          label: 'Short-term (1-5 years)',
          description: 'I need access to my investment relatively soon or prefer more liquid options',
          badge: '1-5 Years',
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
          value: 'medium',
          label: 'Medium-term (5-10 years)',
          description: 'I can wait several years for my investment to mature and am planning for medium-term goals',
          badge: '5-10 Years',
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
          value: 'long',
          label: 'Long-term (10+ years)',
          description: 'I\'m investing for the long haul and can wait for maximum growth potential',
          badge: '10+ Years',
          badgeColor: 'bg-indigo-100 text-indigo-800'
        }
      ]
    },
    {
      key: 'ticketSize',
      title: 'What is your investment budget?',
      subtitle: 'Different funds have varying minimum investment requirements',
      helpText: 'Your investment amount determines which funds you can access. Larger investments often provide access to institutional-grade opportunities.',
      icon: Euro,
      isSelect: true,
      selectOptions: [
        { 
          value: 'under-300k', 
          label: 'Under €300,000',
          description: 'Entry-level Golden Visa investment'
        },
        { 
          value: '300k-500k', 
          label: '€300,000 - €500,000',
          description: 'Standard Golden Visa range'
        },
        { 
          value: 'over-500k', 
          label: 'Over €500,000',
          description: 'Premium investment opportunities'
        }
      ]
    },
    {
      key: 'citizenship',
      title: 'What is your citizenship?',
      subtitle: 'Some funds have specific requirements or tax implications based on nationality',
      helpText: 'Citizenship affects tax treatment, regulatory compliance, and eligibility for certain investment structures.',
      icon: User,
      isSelect: true,
      selectOptions: [
        { value: 'us', label: 'United States', description: 'PFIC and tax reporting considerations' },
        { value: 'uk', label: 'United Kingdom', description: 'Post-Brexit investment structures' },
        { value: 'australia', label: 'Australia', description: 'CFC and tax transparency rules' },
        { value: 'canada', label: 'Canada', description: 'FBAR and tax treaty benefits' },
        { value: 'china', label: 'China', description: 'Capital controls and approval requirements' },
        { value: 'other', label: 'Other', description: 'Please specify during consultation' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];

  const nextStep = async () => {
    const fieldName = currentQuestion.key as keyof QuizFormData;
    const isValid = await form.trigger(fieldName);
    
    if (isValid && currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: QuizFormData) => {
    localStorage.removeItem('quiz-progress');
    setHasUnsavedChanges(false);
    onSubmit(data);
  };

  const resetQuiz = () => {
    form.reset();
    setCurrentStep(0);
    localStorage.removeItem('quiz-progress');
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <QuizProgress 
          currentStep={currentStep}
          totalSteps={questions.length}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <CardDescription className="text-base">
          Answer {questions.length} detailed questions to get personalized fund recommendations tailored to your profile
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <QuizQuestion
              question={currentQuestion}
              control={form.control}
              getFieldError={getFieldError}
            />

            <QuizNavigation
              currentStep={currentStep}
              totalSteps={questions.length}
              hasUnsavedChanges={hasUnsavedChanges}
              isStepValid={isStepValid()}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              onResetQuiz={resetQuiz}
              onSubmit={() => form.handleSubmit(handleSubmit)()}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuizFormContainer;
