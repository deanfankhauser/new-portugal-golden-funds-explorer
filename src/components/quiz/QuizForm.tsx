
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema)
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor Profile Questionnaire</CardTitle>
        <CardDescription>
          Help us understand your investment preferences to recommend the best funds for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="riskAppetite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">What is your risk appetite?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="low" id="risk-low" />
                        <div className="flex-1">
                          <label htmlFor="risk-low" className="font-medium cursor-pointer">Conservative</label>
                          <p className="text-sm text-gray-600">I prefer stable returns with minimal risk</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="medium" id="risk-medium" />
                        <div className="flex-1">
                          <label htmlFor="risk-medium" className="font-medium cursor-pointer">Moderate</label>
                          <p className="text-sm text-gray-600">I'm comfortable with some risk for potentially higher returns</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="high" id="risk-high" />
                        <div className="flex-1">
                          <label htmlFor="risk-high" className="font-medium cursor-pointer">Aggressive</label>
                          <p className="text-sm text-gray-600">I'm willing to take high risks for potentially high rewards</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investmentHorizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">What is your investment time horizon?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="short" id="horizon-short" />
                        <div className="flex-1">
                          <label htmlFor="horizon-short" className="font-medium cursor-pointer">Short-term (1-5 years)</label>
                          <p className="text-sm text-gray-600">I need access to my investment relatively soon</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="medium" id="horizon-medium" />
                        <div className="flex-1">
                          <label htmlFor="horizon-medium" className="font-medium cursor-pointer">Medium-term (5-10 years)</label>
                          <p className="text-sm text-gray-600">I can wait several years for my investment to mature</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="long" id="horizon-long" />
                        <div className="flex-1">
                          <label htmlFor="horizon-long" className="font-medium cursor-pointer">Long-term (10+ years)</label>
                          <p className="text-sm text-gray-600">I'm investing for the long haul</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">What is your investment budget?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your investment range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under-300k">Under €300,000</SelectItem>
                      <SelectItem value="300k-500k">€300,000 - €500,000</SelectItem>
                      <SelectItem value="over-500k">Over €500,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="citizenship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">What is your citizenship?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your citizenship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="china">China</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 text-lg">
              Get My Fund Recommendations
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuizForm;
