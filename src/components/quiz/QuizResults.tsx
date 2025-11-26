import React from 'react';
import { Button } from '@/components/ui/button';
import { Fund } from '@/data/types/funds';
import FundCard from '@/components/FundCard';
import { RotateCcw } from 'lucide-react';

interface QuizResultsProps {
  funds: Fund[];
  onReset: () => void;
  onClose: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ funds, onReset, onClose }) => {
  return (
    <div className="space-y-6">
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
        <Button onClick={onClose}>
          View Full Directory
        </Button>
      </div>
    </div>
  );
};
