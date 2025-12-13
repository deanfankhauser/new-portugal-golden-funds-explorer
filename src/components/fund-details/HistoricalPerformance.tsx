import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PerformanceData {
  returns?: number;
  nav?: number;
  aum?: number;
  benchmark?: number;
}

interface HistoricalPerformanceProps {
  historicalPerformance?: Record<string, PerformanceData>;
}

const HistoricalPerformance: React.FC<HistoricalPerformanceProps> = ({ 
  historicalPerformance 
}) => {
  if (!historicalPerformance || Object.keys(historicalPerformance).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Historical Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical performance data available.</p>
        </CardContent>
      </Card>
    );
  }

  const years = Object.keys(historicalPerformance).sort((a, b) => parseInt(b) - parseInt(a));

  const formatPercentage = (value: number) => {
    const formatted = value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
    return formatted;
  };

  const getReturnIcon = (returns: number) => {
    if (returns > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (returns < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getReturnColor = (returns: number) => {
    if (returns > 0) return 'text-green-600';
    if (returns < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Historical Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {years.map((year) => {
            const data = historicalPerformance[year];
            return (
              <div key={year} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{year}</h4>
                  {data.returns !== undefined && (
                    <div className={`flex items-center gap-1 font-semibold ${getReturnColor(data.returns)}`}>
                      {getReturnIcon(data.returns)}
                      {formatPercentage(data.returns)}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {data.nav !== undefined && (
                    <div>
                      <span className="text-muted-foreground">NAV:</span>
                      <span className="ml-2 font-medium">{data.nav.toFixed(3)}</span>
                    </div>
                  )}
                  
                  {data.aum !== undefined && (
                    <div>
                      <span className="text-muted-foreground">AUM:</span>
                      <span className="ml-2 font-medium">€{data.aum.toLocaleString()}M</span>
                    </div>
                  )}
                  
                  {data.benchmark !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Benchmark:</span>
                      <span className="ml-2 font-medium">{formatPercentage(data.benchmark)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Historical performance is not indicative of future results. Past performance does not guarantee future returns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalPerformance;