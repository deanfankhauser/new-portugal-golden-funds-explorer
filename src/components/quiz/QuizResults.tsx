
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecommendationCard from './RecommendationCard';
import { Fund } from '@/data/types/funds';

interface QuizResultsProps {
  recommendations: (Fund & { score: number })[];
  onResetQuiz: () => void;
  formatCurrency: (amount: number) => string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ recommendations, onResetQuiz, formatCurrency }) => {
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
