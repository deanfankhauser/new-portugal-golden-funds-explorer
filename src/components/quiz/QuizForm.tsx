
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Target, Clock, Euro, User, HelpCircle, Save, RotateCcw } from 'lucide-react';

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

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit }) => {
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
  const progress = ((currentStep + 1) / questions.length) * 100;

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
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl">Investor Profile Questionnaire</CardTitle>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Save className="w-4 h-4" />
              Progress saved
            </div>
          )}
        </div>
        <CardDescription className="text-base">
          Answer {questions.length} detailed questions to get personalized fund recommendations tailored to your profile
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Question {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="min-h-[500px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <currentQuestion.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{currentQuestion.title}</h3>
                  <p className="text-gray-600">{currentQuestion.subtitle}</p>
                </div>
                <div className="text-gray-400 hover:text-gray-600 cursor-help" title={currentQuestion.helpText}>
                  <HelpCircle className="w-5 h-5" />
                </div>
              </div>

              {currentQuestion.helpText && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">{currentQuestion.helpText}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name={currentQuestion.key as keyof QuizFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {currentQuestion.isSelect ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-14 text-left">
                            <SelectValue placeholder={`Select your ${currentQuestion.key === 'ticketSize' ? 'investment range' : 'citizenship'}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {currentQuestion.selectOptions?.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="py-4">
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  {option.description && (
                                    <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                        >
                          {currentQuestion.options?.map((option) => (
                            <div key={option.value} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <label htmlFor={option.value} className="font-medium cursor-pointer">
                                    {option.label}
                                  </label>
                                  {option.badge && (
                                    <Badge className={`text-xs ${option.badgeColor}`}>
                                      {option.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </FormControl>
                    {getFieldError() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                        <FormMessage className="text-red-600" />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
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
                    onClick={resetQuiz}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>

              {currentStep === questions.length - 1 ? (
                <Button 
                  type="submit" 
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  disabled={!isStepValid()}
                >
                  Get My Recommendations
                  <Target className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuizForm;
