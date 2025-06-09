
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuizForm, { QuizFormData } from '../components/quiz/QuizForm';
import QuizResults from '../components/quiz/QuizResults';
import FundQuizHeader from '../components/quiz/FundQuizHeader';
import FundQuizProcessing from '../components/quiz/FundQuizProcessing';
import PageSEO from '../components/common/PageSEO';
import { getRecommendations } from '../utils/quizRecommendationEngine';
import { Fund } from '../data/types/funds';
import { analytics } from '../utils/analytics';

const FundQuiz = () => {
  const [recommendations, setRecommendations] = useState<(Fund & { score: number })[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data: QuizFormData) => {
    setIsProcessing(true);
    
    // Track quiz start
    analytics.trackEvent('quiz_start', {
      risk_appetite: data.riskAppetite,
      ticket_size: data.ticketSize,
      investment_horizon: data.investmentHorizon
    });
    
    // Add a small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendations = getRecommendations(data);
    setRecommendations(recommendations);
    setShowResults(true);
    setIsProcessing(false);

    // Track quiz completion
    analytics.trackQuizCompletion(
      recommendations.map(r => r.name),
      {
        riskTolerance: data.riskAppetite,
        investmentAmount: data.ticketSize,
        investmentHorizon: data.investmentHorizon
      }
    );
  };

  const resetQuiz = () => {
    setShowResults(false);
    setRecommendations([]);
    setIsProcessing(false);
    
    // Track quiz reset
    analytics.trackEvent('quiz_reset');
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
    return <FundQuizProcessing />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSEO pageType="fund-quiz" />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          {!showResults ? (
            <>
              <FundQuizHeader />
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
