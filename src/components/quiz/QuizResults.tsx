
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecommendationCard from './RecommendationCard';
import EmailCapture from '../common/EmailCapture';
import { Fund } from '@/data/types/funds';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, RotateCcw, Star, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizResultsProps {
  recommendations: (Fund & { score: number })[];
  onResetQuiz: () => void;
  formatCurrency: (amount: number) => string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ recommendations, onResetQuiz, formatCurrency }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    try {
      // Send thank you email using Postmark template
      const response = await fetch('/api/send-quiz-thank-you', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userName: email.split('@')[0] // Simple name extraction from email
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Thank you email sent successfully:', responseData);
      
      // Show success toast
      toast({
        title: "Thank You for Your Interest!",
        description: "Your golden visa journey starts here. Check your email for more information.",
      });
      
      setEmailSubmitted(true);
    } catch (error) {
      console.error('Error sending thank you email:', error);
      toast({
        title: "Error",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Show email capture if user is not authenticated and hasn't submitted email
  if (!isAuthenticated && !emailSubmitted) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Your Personalized Fund Recommendations Are Ready!</CardTitle>
            <CardDescription className="text-base">
              We've analyzed your investment profile and found {recommendations.length} funds that match your preferences perfectly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Personalized</p>
                <p className="text-xs text-gray-600">Matched to your profile</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Optimized</p>
                <p className="text-xs text-gray-600">Best returns for your risk</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-gray-600">Trusted fund managers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <EmailCapture
          title="Get Your Fund Recommendations"
          description="Enter your email to see which Portugal Golden Visa funds match your investment profile."
          onEmailSubmit={handleEmailSubmit}
          isSubmitting={isSubmittingEmail}
        />

        <div className="text-center">
          <Button onClick={onResetQuiz} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Show results if authenticated or email submitted
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Personalized Fund Recommendations</CardTitle>
                <CardDescription className="text-base mt-2">
                  Based on your investor profile, here are the top {recommendations.length} funds that match your preferences
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Risk-matched
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    ✓ Budget-appropriate
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ Timeline-aligned
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={onResetQuiz} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          </div>
        </CardHeader>
      </Card>

      {recommendations.length > 0 ? (
        <div className="space-y-6">
          {recommendations.map((fund, index) => (
            <div key={fund.id} className="relative">
              <RecommendationCard 
                fund={fund} 
                index={index} 
                formatCurrency={formatCurrency}
              />
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
                  🏆 Best Match
                </div>
              )}
            </div>
          ))}
          
          {/* Summary Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Review each fund's detailed information</li>
                    <li>• Contact fund managers for personalized consultations</li>
                    <li>• Consult with qualified financial and legal advisors</li>
                    <li>• Consider diversifying across multiple funds if budget allows</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No specific matches found</h3>
            <p className="text-gray-600 mb-6">
              Based on your criteria, we couldn't find perfectly matching funds. 
              Try adjusting your preferences or browse all available funds.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onResetQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button asChild>
                <a href="/">Browse All Funds</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <h4 className="font-medium mb-2">Important Legal Disclaimer</h4>
              <p className="leading-relaxed">
                These recommendations are for informational purposes only and do not constitute investment advice. 
                Actual returns may vary significantly and are not guaranteed. Past performance does not 
                predict future results. Investment in funds involves risk, including the possible loss of 
                principal. Please consult with qualified financial and legal advisors before making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
