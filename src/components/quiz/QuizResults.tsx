import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Fund } from '@/data/types/funds';
import FundCard from '@/components/FundCard';
import { RotateCcw, Share2, Check } from 'lucide-react';
import { QuizAnswers } from '@/hooks/useFundMatcherQuery';
import { useToast } from '@/hooks/use-toast';
import { trackQuizEvent } from '@/services/quizAnalytics';

interface QuizResultsProps {
  funds: Fund[];
  answers: QuizAnswers;
  onReset: () => void;
  onClose: () => void;
  onEditPreferences: () => void;
}

const getAnswerLabel = (questionId: string, value: string): string => {
  const labels: Record<string, Record<string, string>> = {
    budget: {
      'under250k': 'Under €250,000',
      'under500k': 'Under €500,000',
      '500k+': '€500,000 or more'
    },
    strategy: {
      'safety': 'Safety & Stability',
      'growth': 'Growth & Returns',
      'fast_exit': 'Fast Exit'
    },
    income: {
      'yes': 'Yes, I need distributions',
      'no': 'No, prefer accumulation'
    },
    riskTolerance: {
      'conservative': 'Conservative',
      'moderate': 'Moderate',
      'aggressive': 'Aggressive'
    },
    timeline: {
      '1-3years': '1–3 years',
      '3-5years': '3–5 years',
      '5plus': '5+ years'
    }
  };
  return labels[questionId]?.[value] || value;
};

const getQuestionLabel = (questionId: string): string => {
  const questions: Record<string, string> = {
    budget: 'Investment Budget',
    strategy: 'Primary Goal',
    income: 'Income Distributions',
    riskTolerance: 'Risk Tolerance',
    timeline: 'Investment Timeline'
  };
  return questions[questionId] || questionId;
};

export const QuizResults: React.FC<QuizResultsProps> = ({ funds, answers, onReset, onClose, onEditPreferences }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);


  const handleShare = async () => {
    // Generate shareable URL with quiz answers
    const params = new URLSearchParams();
    Object.entries(answers).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?quiz=${encodeURIComponent(params.toString())}`;
    
    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Portugal Golden Visa Fund Matches',
          text: `I found ${funds.length} matching funds using the Fund Matcher Quiz`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    
    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link to show your quiz results",
      });
      
      // Track share event
      trackQuizEvent('shared', {
        answers,
        resultsCount: funds.length,
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Preferences Summary Card */}
      <Card className="p-6 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Your Preferences
          </h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEditPreferences}
          >
            Edit Preferences
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(answers).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {getQuestionLabel(key)}
                </p>
                <p className="text-base font-semibold mt-1">
                  {getAnswerLabel(key, value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">We found {funds.length} matching fund{funds.length !== 1 ? 's' : ''}</h3>
        <p className="text-muted-foreground">
          Based on your preferences, here are the funds that match your criteria
        </p>
      </div>

      <div className="grid gap-4">
        {funds.map((fund) => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
        <Button variant="outline" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </>
          )}
        </Button>
        <Button onClick={onClose}>
          View Full Directory
        </Button>
      </div>
    </div>
  );
};
