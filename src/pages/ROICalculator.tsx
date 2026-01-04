
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ROICalculatorHeader from '../components/roi-calculator/ROICalculatorHeader';
import ROICalculatorForm from '../components/roi-calculator/ROICalculatorForm';
import ROICalculatorResults from '../components/roi-calculator/ROICalculatorResults';
import { Fund } from '../data/types/funds';

const ROICalculator = () => {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [results, setResults] = useState<{
    grossTotalValue: number;
    grossTotalReturn: number;
    grossAnnualizedReturn: number;
    netTotalValue: number;
    netTotalReturn: number;
    netAnnualizedReturn: number;
    totalFeesPaid: number;
    managementFeesPaid: number;
    performanceFeesPaid: number;
  } | null>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleResultsCalculated = (calculatedResults: {
    grossTotalValue: number;
    grossTotalReturn: number;
    grossAnnualizedReturn: number;
    netTotalValue: number;
    netTotalReturn: number;
    netAnnualizedReturn: number;
    totalFeesPaid: number;
    managementFeesPaid: number;
    performanceFeesPaid: number;
  }) => {
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
          
          {results && (
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Portugal Golden Visa Investment Fund Projection</h2>
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
