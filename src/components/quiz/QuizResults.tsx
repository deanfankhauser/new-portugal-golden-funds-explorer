
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecommendationCard from './RecommendationCard';
import EmailCapture from '../common/EmailCapture';
import { Fund } from '@/data/types/funds';
import { useAuth } from '@/contexts/AuthContext';

interface QuizResultsProps {
  recommendations: (Fund & { score: number })[];
  onResetQuiz: () => void;
  formatCurrency: (amount: number) => string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ recommendations, onResetQuiz, formatCurrency }) => {
  const { isAuthenticated } = useAuth();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    // Simulate API call - in real app, you'd send this to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email captured:', email);
    setEmailSubmitted(true);
    setIsSubmittingEmail(false);
  };

  // Show email capture if user is not authenticated and hasn't submitted email
  if (!isAuthenticated && !emailSubmitted) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Your Personalized Fund Recommendations Are Ready!</CardTitle>
            <CardDescription>
              Enter your email to view your customized Portugal Golden Visa fund recommendations
            </CardDescription>
          </CardHeader>
        </Card>

        <EmailCapture
          title="Get Your Fund Recommendations"
          description="Enter your email to see which Portugal Golden Visa funds match your investment profile."
          onEmailSubmit={handleEmailSubmit}
          isSubmitting={isSubmittingEmail}
        />

        <div className="text-center">
          <Button onClick={onResetQuiz} variant="outline">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Show results if authenticated or email submitted
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Personalized Fund Recommendations</CardTitle>
              <CardDescription>
                Based on your investor profile, here are the top funds that match your preferences
              </CardDescription>
            </div>
            <Button onClick={onResetQuiz} variant="outline">
              Retake Quiz
            </Button>
          </div>
        </CardHeader>
      </Card>

      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {recommendations.map((fund, index) => (
            <RecommendationCard 
              key={fund.id} 
              fund={fund} 
              index={index} 
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">
              No specific matches found. Please consider retaking the quiz or 
              <a href="/" className="text-primary hover:underline ml-1">browse all funds</a>.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-blue-800 text-center">
            <strong>Important:</strong> These recommendations are for informational purposes only. 
            Please consult with qualified financial and legal advisors before making any investment decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
