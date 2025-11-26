import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fund } from '@/data/types/funds';
import FundCard from '@/components/FundCard';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface QuizResultsProps {
  funds: Fund[];
  onReset: () => void;
  onClose: () => void;
  showQEFHighlight?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ funds, onReset, onClose, showQEFHighlight = false }) => {
  return (
    <div className="space-y-6">
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
