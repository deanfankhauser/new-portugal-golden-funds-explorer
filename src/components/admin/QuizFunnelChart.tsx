import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Users, CheckCircle2 } from 'lucide-react';

interface FunnelStep {
  step: number;
  label: string;
  count: number;
  dropOffCount: number;
  dropOffRate: number;
  retentionRate: number;
}

interface QuizFunnelChartProps {
  funnelData: FunnelStep[];
  totalStarted: number;
}

export const QuizFunnelChart: React.FC<QuizFunnelChartProps> = ({ funnelData, totalStarted }) => {
  const maxCount = funnelData[0]?.count || 1;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Quiz Completion Funnel</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track user progression through each quiz question
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Users className="h-3 w-3" />
          {totalStarted} started
        </Badge>
      </div>

      <div className="space-y-3">
        {funnelData.map((step, index) => {
          const widthPercentage = (step.count / maxCount) * 100;
          const isLastStep = index === funnelData.length - 1;
          
          return (
            <div key={step.step}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {step.step === 0 ? 'Started' : `Q${step.step}: ${step.label}`}
                  </span>
                  {isLastStep && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{step.count} users</span>
                  <Badge variant="secondary" className="min-w-[60px] justify-center">
                    {step.retentionRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              {/* Funnel bar */}
              <div className="relative">
                <div
                  className="h-12 rounded-lg transition-all duration-300"
                  style={{
                    width: `${widthPercentage}%`,
                    background: isLastStep
                      ? 'hsl(var(--success) / 0.2)'
                      : `linear-gradient(90deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--primary) / 0.1) 100%)`,
                    border: isLastStep
                      ? '2px solid hsl(var(--success))'
                      : '1px solid hsl(var(--border))',
                  }}
                >
                  <div className="flex items-center justify-between h-full px-4">
                    <span className="text-xs font-medium text-foreground">
                      {step.count} continued
                    </span>
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {!isLastStep && step.dropOffCount > 0 && (
                <div className="flex items-center gap-2 mt-2 ml-2">
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">
                    {step.dropOffCount} abandoned ({step.dropOffRate.toFixed(1)}% drop-off)
                  </span>
                </div>
              )}

              {!isLastStep && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-4 bg-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div>
          <p className="text-xs text-muted-foreground">Total Completion</p>
          <p className="text-lg font-bold text-success">
            {((funnelData[funnelData.length - 1]?.count / totalStarted) * 100 || 0).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Drop-offs</p>
          <p className="text-lg font-bold text-destructive">
            {totalStarted - (funnelData[funnelData.length - 1]?.count || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Biggest Drop-off</p>
          <p className="text-lg font-bold">
            {funnelData.reduce((max, step) => 
              step.dropOffRate > max.rate ? { rate: step.dropOffRate, label: step.label } : max,
              { rate: 0, label: 'None' }
            ).label || 'None'}
          </p>
        </div>
      </div>
    </Card>
  );
};
