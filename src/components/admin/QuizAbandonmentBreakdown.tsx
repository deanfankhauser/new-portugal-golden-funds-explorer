import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AbandonmentPattern {
  step: number;
  stepLabel: string;
  answers: Record<string, string>;
  count: number;
  percentage: number;
}

interface QuizAbandonmentBreakdownProps {
  patterns: AbandonmentPattern[];
  totalAbandoned: number;
}

const formatQuestionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    budget: 'Budget',
    strategy: 'Strategy',
    income: 'Income',
    riskTolerance: 'Risk Tolerance',
    timeline: 'Timeline',
  };
  return labels[key] || key;
};

const formatAnswerLabel = (questionKey: string, value: string): string => {
  const labels: Record<string, Record<string, string>> = {
    budget: {
      'under250k': 'Under €250k',
      'under500k': 'Under €500k',
      '500k+': '€500k+',
    },
    strategy: {
      safety: 'Safety & Stability',
      growth: 'Growth & Returns',
      fast_exit: 'Fast Exit',
    },
    income: {
      yes: 'Yes',
      no: 'No',
    },
    riskTolerance: {
      conservative: 'Conservative',
      moderate: 'Moderate',
      aggressive: 'Aggressive',
    },
    timeline: {
      '1-3years': '1–3 years',
      '3-5years': '3–5 years',
      '5plus': '5+ years',
    },
  };
  return labels[questionKey]?.[value] || value;
};

export const QuizAbandonmentBreakdown: React.FC<QuizAbandonmentBreakdownProps> = ({ 
  patterns, 
  totalAbandoned 
}) => {
  // Group patterns by step
  const patternsByStep = patterns.reduce((acc, pattern) => {
    if (!acc[pattern.step]) {
      acc[pattern.step] = [];
    }
    acc[pattern.step].push(pattern);
    return acc;
  }, {} as Record<number, AbandonmentPattern[]>);

  // Sort steps and get top patterns per step
  const sortedSteps = Object.keys(patternsByStep)
    .map(Number)
    .sort((a, b) => a - b);

  if (patterns.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No abandonment patterns detected yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-6">
        <TrendingDown className="h-5 w-5 text-destructive mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Abandonment Analysis by Answer Patterns</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Identify which answer combinations correlate with quiz abandonment at each step
          </p>
        </div>
        <Badge variant="destructive">{totalAbandoned} total abandoned</Badge>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {sortedSteps.map((step) => {
          const stepPatterns = patternsByStep[step]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 patterns per step
          
          const stepTotal = stepPatterns.reduce((sum, p) => sum + p.count, 0);
          const stepLabel = stepPatterns[0]?.stepLabel || `Step ${step}`;

          return (
            <AccordionItem key={step} value={`step-${step}`} className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      Step {step}
                    </Badge>
                    <span className="font-medium">{stepLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="font-semibold">
                      {stepTotal} abandoned
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({((stepTotal / totalAbandoned) * 100).toFixed(1)}% of total)
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-2">
                  {stepPatterns.map((pattern, index) => {
                    const answerCount = Object.keys(pattern.answers).length;
                    
                    return (
                      <Card key={index} className="p-4 bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {pattern.count} abandoned ({pattern.percentage.toFixed(1)}%)
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {answerCount} answer{answerCount !== 1 ? 's' : ''} selected
                          </span>
                        </div>

                        {answerCount > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(pattern.answers).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatQuestionLabel(key)}
                                </p>
                                <p className="text-sm font-medium">
                                  {formatAnswerLabel(key, value)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Abandoned immediately without selecting any answers
                          </p>
                        )}

                        {/* Progress bar showing relative frequency */}
                        <div className="mt-3">
                          <div className="w-full bg-background rounded-full h-1.5">
                            <div
                              className="bg-destructive rounded-full h-1.5 transition-all"
                              style={{ width: `${pattern.percentage}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {patternsByStep[step].length > 5 && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    + {patternsByStep[step].length - 5} more pattern{patternsByStep[step].length - 5 !== 1 ? 's' : ''}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Key insights */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold mb-3">Key Insights</h4>
        <div className="space-y-2">
          {sortedSteps.map((step) => {
            const topPattern = patternsByStep[step][0];
            const stepTotal = patternsByStep[step].reduce((sum, p) => sum + p.count, 0);
            
            return (
              <div key={step} className="flex items-start gap-2 text-sm">
                <Badge variant="outline" className="text-xs mt-0.5">Q{step}</Badge>
                <p className="text-muted-foreground flex-1">
                  <span className="font-medium text-foreground">{stepTotal} users</span> abandoned at{' '}
                  <span className="font-medium text-foreground">{topPattern.stepLabel}</span>
                  {Object.keys(topPattern.answers).length > 0 && (
                    <span>
                      {' '}— most common after selecting{' '}
                      <span className="font-medium text-foreground">
                        {formatAnswerLabel(
                          Object.keys(topPattern.answers)[0],
                          Object.values(topPattern.answers)[0]
                        )}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
