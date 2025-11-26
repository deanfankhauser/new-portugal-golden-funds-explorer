import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Fund } from '@/data/types/funds';
import FundCard from '@/components/FundCard';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { QuizAnswers } from '@/hooks/useFundMatcherQuery';

interface QuizResultsProps {
  funds: Fund[];
  answers: QuizAnswers;
  onReset: () => void;
  onClose: () => void;
  showQEFHighlight?: boolean;
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
    usTaxAccount: {
      'yes': 'Yes, IRA/401k account',
      'no': 'No, standard account'
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
    usTaxAccount: 'US Tax Account',
    timeline: 'Investment Timeline'
  };
  return questions[questionId] || questionId;
};

export const QuizResults: React.FC<QuizResultsProps> = ({ funds, answers, onReset, onClose, showQEFHighlight = false }) => {
  return (
    <div className="space-y-6">
      {/* Preferences Summary Card */}
      <Card className="p-6 bg-muted/30">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Your Preferences
        </h4>
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
        {showQEFHighlight && (
          <p className="text-sm text-muted-foreground">
            QEF-eligible funds are highlighted for your US tax account
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {funds.map((fund) => (
          <div key={fund.id} className="relative">
            <FundCard fund={fund} />
            {showQEFHighlight && fund.pficStatus && (
              <Badge 
                variant="success" 
                className="absolute top-4 right-4 gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                QEF-Eligible
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
        <Button onClick={onClose}>
          View Full Directory
        </Button>
      </div>
    </div>
  );
};
