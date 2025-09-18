import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MonthlyPerformanceData {
  returns?: number;
  aum?: number;
  nav?: number;
}

interface HistoricalPerformanceChartProps {
  historicalPerformance?: Record<string, MonthlyPerformanceData>;
}

const HistoricalPerformanceChart: React.FC<HistoricalPerformanceChartProps> = ({ 
  historicalPerformance 
}) => {
  if (!historicalPerformance || Object.keys(historicalPerformance).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Historical Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical performance data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Convert data to chart format and sort by date
  const chartData = Object.entries(historicalPerformance)
    .map(([dateStr, data]) => ({
      date: dateStr,
      returns: data.returns || 0,
      aum: data.aum || 0,
      nav: data.nav || 0,
      displayDate: new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      })
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'returns') {
      return [`${value >= 0 ? '+' : ''}${value.toFixed(2)}%`, 'Returns'];
    }
    if (name === 'aum') {
      return [`€${(value / 1000000).toFixed(1)}M`, 'AUM'];
    }
    if (name === 'nav') {
      return [value.toFixed(3), 'NAV'];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {formatTooltipValue(entry.value, entry.dataKey)[1]}: {formatTooltipValue(entry.value, entry.dataKey)[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Historical Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="displayDate" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="returns"
                orientation="left"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="aum"
                orientation="right"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="returns"
                type="monotone"
                dataKey="returns"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Returns (%)"
              />
              <Line
                yAxisId="aum"
                type="monotone"
                dataKey="aum"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                name="AUM (€M)"
              />
            </LineChart>
          </ResponsiveContainer>
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

export default HistoricalPerformanceChart;