
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ROICalculatorHeader from '../components/roi-calculator/ROICalculatorHeader';
import ROICalculatorForm from '../components/roi-calculator/ROICalculatorForm';
import ROICalculatorResults from '../components/roi-calculator/ROICalculatorResults';
import ROICalculatorEmailGate from '../components/roi-calculator/ROICalculatorEmailGate';
import { Fund } from '../data/types/funds';

const ROICalculator = () => {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [results, setResults] = useState<{
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  } | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const emailGateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Scroll to email gate when it appears
  useEffect(() => {
    if (showEmailGate && emailGateRef.current) {
      setTimeout(() => {
        emailGateRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showEmailGate]);

  const handleResultsCalculated = (calculatedResults: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  }) => {
    setResults(calculatedResults);
    setShowEmailGate(true);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    try {
      // Simulate email submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email submitted:', email);
      setShowEmailGate(false);
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="roi-calculator" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ROICalculatorHeader />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <ROICalculatorForm 
            onResultsCalculated={handleResultsCalculated}
            selectedFund={selectedFund}
            setSelectedFund={setSelectedFund}
          />
          
          {showEmailGate && results ? (
            <div ref={emailGateRef}>
              <ROICalculatorEmailGate 
                onEmailSubmit={handleEmailSubmit}
                isSubmittingEmail={isSubmittingEmail}
              />
            </div>
          ) : results && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Investment Projection</h2>
              <ROICalculatorResults results={results} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
