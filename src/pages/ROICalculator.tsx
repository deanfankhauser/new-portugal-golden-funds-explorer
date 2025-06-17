
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ROICalculatorHeader from '../components/roi-calculator/ROICalculatorHeader';
import ROICalculatorForm from '../components/roi-calculator/ROICalculatorForm';
import ROICalculatorResults from '../components/roi-calculator/ROICalculatorResults';
import ROICalculatorEmailGate from '../components/roi-calculator/ROICalculatorEmailGate';
import { Fund } from '../data/types/funds';
import { useToast } from '@/hooks/use-toast';

const ROICalculator = () => {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [results, setResults] = useState<{
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  } | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const emailGateRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Scroll to email gate when it appears
  useEffect(() => {
    if (showEmailGate && emailGateRef.current) {
      console.log('Scrolling to email gate');
      setTimeout(() => {
        emailGateRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 200);
    }
  }, [showEmailGate]);

  // Scroll to results when email is submitted
  useEffect(() => {
    if (emailSubmitted && resultsRef.current) {
      console.log('Scrolling to results');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 200);
    }
  }, [emailSubmitted]);

  const handleResultsCalculated = (calculatedResults: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  }) => {
    console.log('Results calculated, showing email gate');
    setResults(calculatedResults);
    setShowEmailGate(true);
    setEmailSubmitted(false);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    try {
      // Create email data to send
      const emailData = {
        email: email,
        results: results,
        selectedFund: selectedFund,
        timestamp: new Date().toISOString()
      };

      console.log('Sending email data:', emailData);

      // Send email to a backend service (you'll need to implement this endpoint)
      const response = await fetch('/api/send-roi-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Email sent successfully:', responseData);
      
      // Show success message
      toast({
        title: "Email submitted successfully!",
        description: "Thank you for your interest. Here are your ROI calculations.",
      });
      
      setShowEmailGate(false);
      setEmailSubmitted(true);
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your email. Please try again.",
        variant: "destructive",
      });
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
          
          {showEmailGate && results && (
            <div ref={emailGateRef}>
              <ROICalculatorEmailGate 
                onEmailSubmit={handleEmailSubmit}
                isSubmittingEmail={isSubmittingEmail}
              />
            </div>
          )}
          
          {results && emailSubmitted && (
            <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow-md">
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
