
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuizForm, { QuizFormData } from '../components/quiz/QuizForm';
import QuizResults from '../components/quiz/QuizResults';
import { getRecommendations } from '../utils/quizRecommendationEngine';
import { Fund } from '../data/types/funds';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, Sparkles, Target, TrendingUp } from 'lucide-react';

const FundQuiz = () => {
  const [recommendations, setRecommendations] = useState<(Fund & { score: number })[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSubmit = async (data: QuizFormData) => {
    setIsProcessing(true);
    
    // Add a small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendations = getRecommendations(data);
    setRecommendations(recommendations);
    setShowResults(true);
    setIsProcessing(false);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setRecommendations([]);
    setIsProcessing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Helmet>
          <title>Processing Your Results | Portugal Golden Visa Investment Funds</title>
        </Helmet>
        
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold mb-4">Analyzing Your Investment Profile</h2>
                <p className="text-gray-600 mb-6">
                  We're matching your preferences with our database of Portugal Golden Visa funds...
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Evaluating risk compatibility</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Calculating potential returns</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Generating personalized recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Fund Recommendation Quiz | Portugal Golden Visa Investment Funds</title>
        <meta name="description" content="Take our investor profile quiz to get personalized Portugal Golden Visa fund recommendations based on your risk appetite, investment horizon, and citizenship." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          {!showResults ? (
            <>
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <ClipboardCheck className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                  Fund Recommendation Quiz
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get personalized Portugal Golden Visa fund recommendations tailored to your investment profile, 
                  risk tolerance, and financial goals in just a few minutes.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center p-6">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Personalized Matching</h3>
                  <p className="text-sm text-gray-600">
                    Our algorithm matches funds based on your specific risk profile and investment goals
                  </p>
                </Card>
                <Card className="text-center p-6">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Optimized Returns</h3>
                  <p className="text-sm text-gray-600">
                    Find funds that offer the best potential returns within your comfort zone
                  </p>
                </Card>
                <Card className="text-center p-6">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Expert Curation</h3>
                  <p className="text-sm text-gray-600">
                    All recommendations come from our carefully vetted portfolio of Golden Visa funds
                  </p>
                </Card>
              </div>

              <QuizForm onSubmit={onSubmit} />
            </>
          ) : (
            <QuizResults 
              recommendations={recommendations} 
              onResetQuiz={resetQuiz} 
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
