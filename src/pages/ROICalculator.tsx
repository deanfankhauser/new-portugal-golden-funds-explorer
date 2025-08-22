
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
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Clock, FileText } from 'lucide-react';

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
  const [userEmail, setUserEmail] = useState<string>('');
  const emailGateRef = useRef<HTMLDivElement>(null);
  const emailConfirmationRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Scroll to email gate when it appears
  useEffect(() => {
    if (showEmailGate && emailGateRef.current) {
      // Scrolling to email gate
      setTimeout(() => {
        emailGateRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 200);
    }
  }, [showEmailGate]);

  // Scroll to email confirmation when email is submitted
  useEffect(() => {
    if (emailSubmitted && emailConfirmationRef.current) {
      // Scrolling to email confirmation
      setTimeout(() => {
        emailConfirmationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }, [emailSubmitted]);

  const handleResultsCalculated = (calculatedResults: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  }) => {
    // Results calculated, showing email gate
    setResults(calculatedResults);
    setShowEmailGate(true);
    setEmailSubmitted(false);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    setUserEmail(email);
    try {
      // Create email data to send
      const emailData = {
        email: email,
        results: results,
        selectedFund: selectedFund,
        timestamp: new Date().toISOString()
      };

      // Sending email data

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
      // Email sent successfully
      
      // Show success message
      toast({
        title: "Email sent successfully!",
        description: "Your ROI calculation has been sent to your inbox. Check your email for detailed results.",
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
            <ROICalculatorEmailGate 
              onEmailSubmit={handleEmailSubmit}
              isSubmittingEmail={isSubmittingEmail}
              ref={emailGateRef}
            />
          )}
          
          {results && emailSubmitted && (
            <div className="space-y-6">
              {/* Email Confirmation Card */}
              <Card ref={emailConfirmationRef} className="bg-success/10 border-success/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <h3 className="text-lg font-semibold text-success-foreground">Email Sent Successfully!</h3>
                  </div>
                  <div className="space-y-3 text-success-foreground">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Your detailed ROI calculation has been sent to <strong>{userEmail}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>You should receive it within the next few minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>The email includes your investment projections and fund details</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-success/20 rounded-lg">
                    <p className="text-sm text-success-foreground">
                      <strong>What's next?</strong> Review your results below and consider consulting with a financial advisor to discuss your Portugal Golden Visa investment strategy.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Results Display */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Portugal Golden Visa Investment Fund Projection</h2>
                <ROICalculatorResults results={results} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
