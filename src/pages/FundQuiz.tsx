
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { funds } from '../data/funds';
import FundCard from '../components/FundCard';
import { Helmet } from 'react-helmet';

const quizSchema = z.object({
  riskAppetite: z.enum(['low', 'medium', 'high']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  ticketSize: z.enum(['under-300k', '300k-500k', 'over-500k']),
  citizenship: z.enum(['us', 'uk', 'australia', 'canada', 'china', 'other'])
});

type QuizFormData = z.infer<typeof quizSchema>;

const FundQuiz = () => {
  const [recommendations, setRecommendations] = useState<typeof funds>([]);
  const [showResults, setShowResults] = useState(false);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema)
  });

  const getRecommendations = (data: QuizFormData) => {
    let scoredFunds = funds.map(fund => {
      let score = 0;

      // Risk appetite scoring
      const riskTags = fund.tags.filter(tag => 
        tag.includes('Low Risk') || tag.includes('Medium Risk') || tag.includes('High Risk') ||
        tag.includes('Low-risk') || tag.includes('Medium-risk') || tag.includes('High-risk')
      );
      
      if (data.riskAppetite === 'low' && riskTags.some(tag => tag.includes('Low'))) score += 3;
      if (data.riskAppetite === 'medium' && riskTags.some(tag => tag.includes('Medium'))) score += 3;
      if (data.riskAppetite === 'high' && riskTags.some(tag => tag.includes('High'))) score += 3;

      // Investment horizon scoring (based on fund term)
      if (data.investmentHorizon === 'short' && fund.term <= 5) score += 2;
      if (data.investmentHorizon === 'medium' && fund.term >= 5 && fund.term <= 10) score += 2;
      if (data.investmentHorizon === 'long' && fund.term >= 10) score += 2;

      // Ticket size scoring
      if (data.ticketSize === 'under-300k' && fund.minimumInvestment <= 300000) score += 2;
      if (data.ticketSize === '300k-500k' && fund.minimumInvestment >= 300000 && fund.minimumInvestment <= 500000) score += 2;
      if (data.ticketSize === 'over-500k' && fund.minimumInvestment >= 500000) score += 2;

      // Citizenship-based scoring
      const citizenshipTags = fund.tags.filter(tag => 
        tag.includes('U.S. citizens') || tag.includes('UK citizens') || 
        tag.includes('Australian citizens') || tag.includes('Canadian citizens') ||
        tag.includes('Chinese citizens')
      );

      if (data.citizenship === 'us' && citizenshipTags.some(tag => tag.includes('U.S. citizens'))) score += 3;
      if (data.citizenship === 'uk' && citizenshipTags.some(tag => tag.includes('UK citizens'))) score += 3;
      if (data.citizenship === 'australia' && citizenshipTags.some(tag => tag.includes('Australian citizens'))) score += 3;
      if (data.citizenship === 'canada' && citizenshipTags.some(tag => tag.includes('Canadian citizens'))) score += 3;
      if (data.citizenship === 'china' && citizenshipTags.some(tag => tag.includes('Chinese citizens'))) score += 3;

      // Golden Visa eligibility bonus
      if (fund.tags.includes('Golden Visa Eligible')) score += 1;

      return { ...fund, score };
    });

    // Sort by score and return top 5
    return scoredFunds
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const onSubmit = (data: QuizFormData) => {
    const recommendations = getRecommendations(data);
    setRecommendations(recommendations);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setRecommendations([]);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Fund Recommendation Quiz | Portugal Golden Visa Investment Funds</title>
        <meta name="description" content="Take our investor profile quiz to get personalized Portugal Golden Visa fund recommendations based on your risk appetite, investment horizon, and citizenship." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Fund Recommendation Quiz
            </h1>
            <p className="text-xl text-gray-600">
              Answer a few questions to get personalized Portugal Golden Visa fund recommendations
            </p>
          </div>

          {!showResults ? (
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
          ) : (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Personalized Fund Recommendations</CardTitle>
                      <CardDescription>
                        Based on your investor profile, here are the top funds that match your preferences
                      </CardDescription>
                    </div>
                    <Button onClick={resetQuiz} variant="outline">
                      Retake Quiz
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((fund, index) => (
                    <div key={fund.id} className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                          Top Match
                        </div>
                      )}
                      <FundCard fund={fund} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">
                      No specific matches found. Please consider retaking the quiz or 
                      <a href="/" className="text-primary hover:underline ml-1">browse all funds</a>.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-blue-800 text-center">
                    <strong>Important:</strong> These recommendations are for informational purposes only. 
                    Please consult with qualified financial and legal advisors before making any investment decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
