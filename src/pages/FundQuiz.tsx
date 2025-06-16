
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundQuizHeader from '../components/quiz/FundQuizHeader';
import QuizForm from '../components/quiz/QuizForm';
import QuizResults from '../components/quiz/QuizResults';
import FundQuizProcessing from '../components/quiz/FundQuizProcessing';
import { QuizFormData } from '../components/quiz/QuizFormContainer';
import { quizRecommendationEngine } from '../utils/quizRecommendationEngine';
import { Fund } from '../data/types/funds';

const FundQuiz = () => {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'processing' | 'results'>('quiz');
  const [recommendations, setRecommendations] = useState<(Fund & { score: number })[]>([]);

  const handleQuizSubmit = async (data: QuizFormData) => {
    console.log('Quiz submitted with data:', data);
    setCurrentStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      const results = quizRecommendationEngine.getRecommendations(data);
      setRecommendations(results);
      setCurrentStep('results');
    }, 3000);
  };

  const handleResetQuiz = () => {
    setCurrentStep('quiz');
    setRecommendations([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-quiz" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        {currentStep === 'quiz' && (
          <>
            <FundQuizHeader />
            <QuizForm onSubmit={handleQuizSubmit} />
          </>
        )}
        
        {currentStep === 'processing' && (
          <FundQuizProcessing />
        )}
        
        {currentStep === 'results' && (
          <QuizResults 
            recommendations={recommendations}
            onResetQuiz={handleResetQuiz}
            formatCurrency={formatCurrency}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
