import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AuthGate from '../auth/AuthGate';

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
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  if (!historicalPerformance || Object.keys(historicalPerformance).length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
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
  const allChartData = Object.entries(historicalPerformance)
    .map(([dateStr, data]) => ({
      date: dateStr,
      dateObj: new Date(dateStr),
      returns: data.returns || 0,
      aum: data.aum || 0,
      nav: data.nav || 0,
      displayDate: new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      })
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  // Filter data based on selected period
  const getFilteredData = (period: string) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (period) {
      case 'YTD':
        cutoffDate.setMonth(0, 1); // Start of current year
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case '3Y':
        cutoffDate.setFullYear(now.getFullYear() - 3);
        break;
      case '5Y':
        cutoffDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        return allChartData;
    }
    
    return allChartData.filter(item => item.dateObj >= cutoffDate);
  };

  // Check data availability for each period
  const hasDataForPeriod = (period: string) => {
    return getFilteredData(period).length > 0;
  };

  const chartData = getFilteredData(selectedPeriod);

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
      return [`€${value.toFixed(1)}M`, 'AUM'];
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
            <CardTitle className="text-lg font-semibold text-foreground mb-2">
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
        <AuthGate 
          message="Sign in to see detailed historical performance data and charts"
          height="400px"
        >
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger 
                value="YTD" 
                disabled={!hasDataForPeriod('YTD')}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                YTD
              </TabsTrigger>
              <TabsTrigger 
                value="1Y" 
                disabled={!hasDataForPeriod('1Y')}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                1 Year
              </TabsTrigger>
              <TabsTrigger 
                value="3Y" 
                disabled={!hasDataForPeriod('3Y')}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                3 Years
              </TabsTrigger>
              <TabsTrigger 
                value="5Y" 
                disabled={!hasDataForPeriod('5Y')}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                5 Years
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedPeriod} className="mt-6">
              <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                style={{ fontSize: '12px' }}
              >
                <defs>
                  <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.18}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    <stop offset="60%" stopColor="hsl(var(--chart-2))" stopOpacity={0.08}/>
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
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
                  tickFormatter={(value) => `€${value.toFixed(0)}M`}
                  dx={5}
                />
                
                <YAxis 
                  yAxisId="nav"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 11, 
                    fill: 'hsl(var(--muted-foreground))',
                    fontWeight: 500
                  }}
                  tickFormatter={(value) => value.toFixed(2)}
                  dx={40}
                />
                
                {/* Area fills for shadow effect */}
                <Area
                  yAxisId="returns"
                  type="monotone"
                  dataKey="returns"
                  fill="url(#returnsGradient)"
                  stroke="none"
                  strokeWidth={0}
                  dot={false}
                  activeDot={false}
                />
                
                <Area
                  yAxisId="aum"
                  type="monotone"
                  dataKey="aum"
                  fill="url(#aumGradient)"
                  stroke="none"
                  strokeWidth={0}
                  dot={false}
                  activeDot={false}
                />
                
                {/* Main lines with shadow */}
                <Tooltip content={<CustomTooltip />} />
                
                <Line
                  yAxisId="returns"
                  type="monotone"
                  dataKey="returns"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ 
                    fill: 'hsl(var(--primary))', 
                    strokeWidth: 0, 
                    r: 4
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
                  dot={false}
                  activeDot={false}
                  name="AUM (€M)"
                  connectNulls={false}
                />
                
                <Line
                  yAxisId="nav"
                  type="monotone"
                  dataKey="nav"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ 
                    fill: 'hsl(var(--chart-3))', 
                    strokeWidth: 0, 
                    r: 3
                  }}
                  activeDot={{ 
                    r: 5, 
                    fill: 'hsl(var(--chart-3))',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2
                  }}
                  name="NAV"
                  connectNulls={false}
                />
              </ComposedChart>
              </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Performance Disclaimer */}
          <div className="mt-6 p-4 bg-gradient-to-br from-muted/5 to-muted/10 border border-border rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Disclaimer:</span> Historical performance is not indicative of future results. 
              Past performance does not guarantee future returns. All investments carry risk of loss.
            </p>
          </div>
        </AuthGate>
      </CardContent>
    </Card>
  );
};

export default HistoricalPerformanceChart;