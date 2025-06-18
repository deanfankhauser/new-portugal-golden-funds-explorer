
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundQuizHeader from '../components/quiz/FundQuizHeader';
import QuizFormContainer from '../components/quiz/QuizFormContainer';
import QuizResults from '../components/quiz/QuizResults';
import { Fund } from '../data/types/funds';
import { QuizFormData } from '../components/quiz/QuizFormContainer';
import { getRecommendations } from '../utils/quizRecommendationEngine';

const FundQuiz = () => {
  const [results, setResults] = useState<(Fund & { score: number })[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizFormData | null>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleQuizSubmit = (data: QuizFormData) => {
    const recommendations = getRecommendations(data);
    setResults(recommendations);
    setQuizAnswers(data);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setResults(null);
    setQuizAnswers(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
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
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <FundQuizHeader />
        
        <div className="max-w-4xl mx-auto space-y-8">
          {!showResults ? (
            <QuizFormContainer onSubmit={handleQuizSubmit} />
          ) : (
            <QuizResults 
              recommendations={results || []} 
              onResetQuiz={handleRetakeQuiz}
              formatCurrency={formatCurrency}
              quizAnswers={quizAnswers}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
