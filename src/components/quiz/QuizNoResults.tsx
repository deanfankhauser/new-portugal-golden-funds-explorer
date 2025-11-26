import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface QuizNoResultsProps {
  onReset: () => void;
  onClose: () => void;
}

export const QuizNoResults: React.FC<QuizNoResultsProps> = ({ onReset, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No exact matches found</h3>
            <p className="text-muted-foreground">
              We couldn't find funds that match all your criteria in our verified partner list.
              Try adjusting your preferences or browse our full directory to explore all available options.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Different Answers
        </Button>
        <Button onClick={onClose}>
          Browse Full Directory
        </Button>
      </div>
    </div>
  );
};
