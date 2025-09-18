import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
      <Card className="border-0 shadow-sm bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Historical Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-center">
            <div className="text-muted-foreground">
              <div className="text-sm font-medium mb-1">No performance data available</div>
              <div className="text-xs">Performance metrics will appear when data is provided</div>
            </div>
          </div>
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

  // Calculate performance metrics
  const latestData = chartData[chartData.length - 1];
  const previousData = chartData[chartData.length - 2];
  const returnsTrend = latestData && previousData ? latestData.returns - previousData.returns : 0;
  const avgReturns = chartData.reduce((sum, item) => sum + item.returns, 0) / chartData.length;

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
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-sm mb-3 text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mb-2 last:mb-0">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {formatTooltipValue(entry.value, entry.dataKey)[1]}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatTooltipValue(entry.value, entry.dataKey)[0]}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-sm bg-card/50">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Historical Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly returns and fund metrics over time
            </p>
          </div>
          
          {/* Performance Summary */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">Latest</span>
              {latestData && (
                <div className="flex items-center gap-1">
                  {latestData.returns >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${latestData.returns >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {latestData.returns >= 0 ? '+' : ''}{latestData.returns.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Avg: {avgReturns >= 0 ? '+' : ''}{avgReturns.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              style={{ fontSize: '12px' }}
            >
              <defs>
                <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                  <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
                <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="hsl(var(--primary))" floodOpacity="0.25"/>
                </filter>
                <filter id="aumLineShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(var(--chart-2))" floodOpacity="0.15"/>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
                vertical={false}
              />
              
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: 500
                }}
                dy={5}
              />
              
              <YAxis 
                yAxisId="returns"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: 500
                }}
                tickFormatter={(value) => `${value}%`}
                dx={-5}
              />
              
              <YAxis 
                yAxisId="aum"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: 500
                }}
                tickFormatter={(value) => `€${(value / 1000000).toFixed(0)}M`}
                dx={5}
              />
              
              {/* Area fills for shadow effect */}
              <Area
                yAxisId="returns"
                type="monotone"
                dataKey="returns"
                fill="url(#returnsGradient)"
                stroke="none"
                strokeWidth={0}
              />
              
              <Area
                yAxisId="aum"
                type="monotone"
                dataKey="aum"
                fill="url(#aumGradient)"
                stroke="none"
                strokeWidth={0}
              />
              
              {/* Main lines with shadow */}
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                yAxisId="returns"
                type="monotone"
                dataKey="returns"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                filter="url(#lineShadow)"
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 0, 
                  r: 4,
                  filter: "url(#lineShadow)"
                }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
                name="Returns (%)"
                connectNulls={false}
              />
              
              <Line
                yAxisId="aum"
                type="monotone"
                dataKey="aum"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                filter="url(#aumLineShadow)"
                dot={{ 
                  fill: 'hsl(var(--chart-2))', 
                  strokeWidth: 0, 
                  r: 3,
                  filter: "url(#aumLineShadow)"
                }}
                activeDot={{ 
                  r: 5, 
                  fill: 'hsl(var(--chart-2))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
                name="AUM (€M)"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Performance Disclaimer */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium">Disclaimer:</span> Historical performance is not indicative of future results. 
            Past performance does not guarantee future returns. All investments carry risk of loss.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalPerformanceChart;