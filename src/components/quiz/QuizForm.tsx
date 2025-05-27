
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Target, Clock, Euro, User } from 'lucide-react';

const quizSchema = z.object({
  riskAppetite: z.enum(['low', 'medium', 'high']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  ticketSize: z.enum(['under-300k', '300k-500k', 'over-500k']),
  citizenship: z.enum(['us', 'uk', 'australia', 'canada', 'china', 'other'])
});

export type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema)
  });

  const questions = [
    {
      key: 'riskAppetite',
      title: 'What is your risk appetite?',
      subtitle: 'This helps us understand your comfort level with investment volatility',
      icon: Target,
      options: [
        {
          value: 'low',
          label: 'Conservative',
          description: 'I prefer stable returns with minimal risk'
        },
        {
          value: 'medium',
          label: 'Moderate',
          description: 'I\'m comfortable with some risk for potentially higher returns'
        },
        {
          value: 'high',
          label: 'Aggressive',
          description: 'I\'m willing to take high risks for potentially high rewards'
        }
      ]
    },
    {
      key: 'investmentHorizon',
      title: 'What is your investment time horizon?',
      subtitle: 'How long do you plan to keep your investment before needing access to funds?',
      icon: Clock,
      options: [
        {
          value: 'short',
          label: 'Short-term (1-5 years)',
          description: 'I need access to my investment relatively soon'
        },
        {
          value: 'medium',
          label: 'Medium-term (5-10 years)',
          description: 'I can wait several years for my investment to mature'
        },
        {
          value: 'long',
          label: 'Long-term (10+ years)',
          description: 'I\'m investing for the long haul'
        }
      ]
    },
    {
      key: 'ticketSize',
      title: 'What is your investment budget?',
      subtitle: 'This determines which funds are accessible to you',
      icon: Euro,
      isSelect: true,
      selectOptions: [
        { value: 'under-300k', label: 'Under €300,000' },
        { value: '300k-500k', label: '€300,000 - €500,000' },
        { value: 'over-500k', label: 'Over €500,000' }
      ]
    },
    {
      key: 'citizenship',
      title: 'What is your citizenship?',
      subtitle: 'Some funds have specific requirements based on nationality',
      icon: User,
      isSelect: true,
      selectOptions: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'australia', label: 'Australia' },
        { value: 'canada', label: 'Canada' },
        { value: 'china', label: 'China' },
        { value: 'other', label: 'Other' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: QuizFormData) => {
    onSubmit(data);
  };

  const isStepValid = () => {
    const fieldName = currentQuestion.key as keyof QuizFormData;
    const value = form.watch(fieldName);
    return value !== undefined && value !== '';
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Investor Profile Questionnaire</CardTitle>
        <CardDescription className="text-base">
          Answer {questions.length} quick questions to get personalized fund recommendations
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
            <div className="min-h-[400px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <currentQuestion.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{currentQuestion.title}</h3>
                  <p className="text-gray-600">{currentQuestion.subtitle}</p>
                </div>
              </div>

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
                              <SelectItem key={option.value} value={option.value} className="py-3">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                        >
                          {currentQuestion.options?.map((option) => (
                            <div key={option.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                              <div className="flex-1">
                                <label htmlFor={option.value} className="font-medium cursor-pointer block">
                                  {option.label}
                                </label>
                                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-6 border-t">
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
