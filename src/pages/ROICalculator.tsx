
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
        {/* Links Section */}
        <div className="mb-8 space-y-4">
          <div className="text-center">
            <a 
              href="https://www.movingto.com/portugal-golden-visa-funds" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Browse All Portugal Golden Visa Funds
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          {/* Info Box */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground text-center">
              Calculate returns on funds that meet Portugal Golden Visa requirements. {' '}
              <a 
                href="https://movingto.com/pt/portugal-golden-visa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 font-medium underline"
              >
                Check Portugal Golden Visa investment requirements
              </a>
            </p>
          </div>
        </div>
        
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
