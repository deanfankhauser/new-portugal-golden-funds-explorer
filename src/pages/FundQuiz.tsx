
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuizForm, { QuizFormData } from '../components/quiz/QuizForm';
import QuizResults from '../components/quiz/QuizResults';
import { getRecommendations } from '../utils/quizRecommendationEngine';
import { Fund } from '../data/types/funds';
import { Helmet } from 'react-helmet';

const FundQuiz = () => {
  const [recommendations, setRecommendations] = useState<(Fund & { score: number })[]>([]);
  const [showResults, setShowResults] = useState(false);

  const onSubmit = (data: QuizFormData) => {
    const recommendations = getRecommendations(data);
    setRecommendations(recommendations);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setRecommendations([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            <QuizForm onSubmit={onSubmit} />
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
