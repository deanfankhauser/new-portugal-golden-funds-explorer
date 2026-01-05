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
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <ROICalculatorHeader />
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-sm">
              <ROICalculatorForm 
                onResultsCalculated={handleResultsCalculated}
                selectedFund={selectedFund}
                setSelectedFund={setSelectedFund}
              />
            </div>
            
            {results && (
              <div className="mt-8 bg-card border border-border rounded-xl p-6 md:p-10 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Projection results</h2>
                <ROICalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
