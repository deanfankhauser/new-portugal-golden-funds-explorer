import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuizOption {
  value: string;
  label: string;
  description: string;
}

interface QuizQuestionProps {
  question: string;
  options: QuizOption[];
  onAnswer: (value: string) => void;
  selectedAnswer?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  onAnswer,
  selectedAnswer
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center mb-8">{question}</h3>
      
      <div className="grid gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          
          return (
            <Card
              key={option.value}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md",
                isSelected && "border-primary bg-primary/5"
              )}
              onClick={() => onAnswer(option.value)}
            >
              <CardContent className="flex items-start gap-4 p-6">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                )}>
                  {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
