
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundQuizHeader from '../components/quiz/FundQuizHeader';
import QuizFormContainer from '../components/quiz/QuizFormContainer';
import QuizResults from '../components/quiz/QuizResults';
import { Fund } from '../data/types/funds';

const FundQuiz = () => {
  const [results, setResults] = useState<Fund[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleQuizSubmit = (funds: Fund[]) => {
    setResults(funds);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-quiz" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <FundQuizHeader />
        
        <div className="max-w-4xl mx-auto space-y-8">
          {!showResults ? (
            <QuizFormContainer onQuizSubmit={handleQuizSubmit} />
          ) : (
            <QuizResults results={results} onRetakeQuiz={handleRetakeQuiz} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
