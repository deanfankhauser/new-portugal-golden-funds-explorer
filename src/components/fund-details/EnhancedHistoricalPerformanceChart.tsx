import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Info, Maximize2 } from 'lucide-react';

interface MonthlyPerformanceData {
  returns?: number;
  aum?: number;
  nav?: number;
}

interface HistoricalPerformanceChartProps {
  historicalPerformance?: Record<string, MonthlyPerformanceData>;
}

type TimeRange = '3M' | '6M' | '1Y' | 'ALL';

const EnhancedHistoricalPerformanceChart: React.FC<HistoricalPerformanceChartProps> = ({ 
  historicalPerformance 
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('ALL');
  const [focusedMetric, setFocusedMetric] = useState<'returns' | 'aum' | 'both'>('both');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!historicalPerformance || Object.keys(historicalPerformance).length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-card/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Historical Performance</h3>
                <p className="text-sm text-muted-foreground">Track fund performance over time</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
            <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <div className="text-muted-foreground">
              <div className="text-sm font-medium mb-1">No performance data available</div>
              <div className="text-xs">Performance metrics will appear when data is provided</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process and filter data based on selected time range
  const processedData = useMemo(() => {
    const chartData = Object.entries(historicalPerformance)
      .map(([dateStr, data]) => {
        // Parse YYYY-MM format correctly
        const [year, month] = dateStr.split('-').map(Number);
        const fullDate = new Date(year, month - 1, 1); // month - 1 because Date months are 0-indexed
        
        return {
          date: dateStr,
          returns: data.returns || 0,
          aum: data.aum || 0,
          nav: data.nav || 0,
          displayDate: fullDate.toLocaleDateString('en-US', { 
            month: 'short', 
            year: '2-digit' 
          }),
          fullDate,
          timestamp: fullDate.getTime()
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    // Filter based on time range - but only if we have enough data
    if (selectedRange === 'ALL' || chartData.length <= 3) {
      return chartData; // Show all data if we don't have much
    }
    
    const now = new Date();
    const monthsBack = selectedRange === '3M' ? 3 : selectedRange === '6M' ? 6 : 12;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    
    const filteredData = chartData.filter(item => item.fullDate >= cutoffDate);
    
    // If filtering results in no data, return all data
    return filteredData.length > 0 ? filteredData : chartData;
  }, [historicalPerformance, selectedRange]);

  // Calculate performance metrics
  const metrics = useMemo(() => {
    if (processedData.length === 0) return null;
    
    const latestData = processedData[processedData.length - 1];
    const previousData = processedData[processedData.length - 2];
    const firstData = processedData[0];
    
    const periodReturn = latestData && firstData ? 
      ((latestData.returns - firstData.returns)) : 0;
    
    const monthlyChange = latestData && previousData ? 
      (latestData.returns - previousData.returns) : 0;
    
    const avgReturns = processedData.reduce((sum, item) => sum + item.returns, 0) / processedData.length;
    const volatility = Math.sqrt(
      processedData.reduce((sum, item) => sum + Math.pow(item.returns - avgReturns, 2), 0) / processedData.length
    );
    
    const bestMonth = Math.max(...processedData.map(d => d.returns));
    const worstMonth = Math.min(...processedData.map(d => d.returns));
    
    return {
      currentReturn: latestData?.returns || 0,
      periodReturn,
      monthlyChange,
      avgReturns,
      volatility,
      bestMonth,
      worstMonth,
      totalMonths: processedData.length,
      currentAUM: latestData?.aum || 0,
      aumGrowth: latestData && firstData ? 
        ((latestData.aum - firstData.aum) / firstData.aum) * 100 : 0
    };
  }, [processedData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="font-semibold text-sm text-foreground">{label}</p>
          </div>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              if (entry.dataKey === 'returns') {
                return (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Monthly Return</span>
                    </div>
                    <span className={`text-sm font-semibold ${entry.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
                    </span>
                  </div>
                );
              }
              if (entry.dataKey === 'aum' && focusedMetric !== 'returns') {
                return (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2" />
                      <span className="text-sm text-muted-foreground">Assets Under Management</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      €{(entry.value / 1000000).toFixed(1)}M
                    </span>
                  </div>
                );
              }
              return null;
            })}
            {data && (
              <div className="border-t border-border/30 pt-2 mt-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">NAV</span>
                  <span className="text-xs font-medium text-foreground">{data.nav?.toFixed(3)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const timeRanges: { key: TimeRange; label: string; disabled?: boolean }[] = [
    { key: '3M', label: '3M', disabled: processedData.length < 3 },
    { key: '6M', label: '6M', disabled: processedData.length < 6 },
    { key: '1Y', label: '1Y', disabled: processedData.length < 12 },
    { key: 'ALL', label: 'All' }
  ];

  // Auto-select appropriate range based on available data
  React.useEffect(() => {
    const availableMonths = Object.keys(historicalPerformance || {}).length;
    if (selectedRange !== 'ALL') {
      const requiredMonths = selectedRange === '3M' ? 3 : selectedRange === '6M' ? 6 : 12;
      if (availableMonths < requiredMonths) {
        setSelectedRange('ALL');
      }
    }
  }, [historicalPerformance, selectedRange]);

  return (
    <Card className="border-0 shadow-sm bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Header Section */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Historical Performance</h3>
              <p className="text-sm text-muted-foreground">
                Monthly returns and fund metrics • {processedData.length} months
              </p>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Time Range Selector */}
            <div className="flex bg-muted/30 rounded-lg p-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.key}
                  variant={selectedRange === range.key ? "default" : "ghost"}
                  size="sm"
                  disabled={range.disabled}
                  onClick={() => setSelectedRange(range.key)}
                  className={`text-xs px-3 py-1 ${
                    selectedRange === range.key 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : range.disabled
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={range.disabled ? 'Not enough data for this time range' : undefined}
                >
                  {range.label}
                </Button>
              ))}
            </div>
            
            {/* Metric Focus Selector */}
            <div className="flex bg-muted/30 rounded-lg p-1">
              <Button
                variant={focusedMetric === 'returns' ? "default" : "ghost"}
                size="sm"
                onClick={() => setFocusedMetric('returns')}
                className={`text-xs px-3 py-1 ${
                  focusedMetric === 'returns' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Returns
              </Button>
              <Button
                variant={focusedMetric === 'aum' ? "default" : "ghost"}
                size="sm"
                onClick={() => setFocusedMetric('aum')}
                className={`text-xs px-3 py-1 ${
                  focusedMetric === 'aum' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                AUM
              </Button>
              <Button
                variant={focusedMetric === 'both' ? "default" : "ghost"}
                size="sm"
                onClick={() => setFocusedMetric('both')}
                className={`text-xs px-3 py-1 ${
                  focusedMetric === 'both' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Both
              </Button>
            </div>
          </div>
        </div>
        
        {/* Performance Summary */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Current</span>
              </div>
              <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                {metrics.currentReturn >= 0 ? '+' : ''}{metrics.currentReturn.toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Period</span>
              </div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {metrics.periodReturn >= 0 ? '+' : ''}{metrics.periodReturn.toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/50 dark:border-purple-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Average</span>
              </div>
              <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {metrics.avgReturns >= 0 ? '+' : ''}{metrics.avgReturns.toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border border-orange-200/50 dark:border-orange-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Volatility</span>
              </div>
              <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                {metrics.volatility.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className={`w-full transition-all duration-300 ${isExpanded ? 'h-96' : 'h-80'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={processedData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.15}/>
                  <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity={0.08}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
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
              
              {(focusedMetric === 'returns' || focusedMetric === 'both') && (
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
                  domain={[
                    (min: number) => min - 1,
                    (max: number) => max + 1
                  ]}
                  dx={-5}
                />
              )}
              
              {(focusedMetric === 'aum' || focusedMetric === 'both') && (
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
                  domain={[
                    (min: number) => min * 0.98,
                    (max: number) => max * 1.02
                  ]}
                  dx={5}
                />
              )}
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Zero reference line for returns */}
              {(focusedMetric === 'returns' || focusedMetric === 'both') && (
                <ReferenceLine yAxisId="returns" y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} strokeDasharray="2 2" />
              )}
              
              {/* Area fills for shadow effect */}
              {(focusedMetric === 'returns' || focusedMetric === 'both') && (
                <Area
                  yAxisId="returns"
                  type="monotone"
                  dataKey="returns"
                  fill="url(#returnsGradient)"
                  stroke="none"
                  dot={false}
                  activeDot={false}
                />
              )}
              
              {(focusedMetric === 'aum' || focusedMetric === 'both') && (
                <Area
                  yAxisId="aum"
                  type="monotone"
                  dataKey="aum"
                  fill="url(#aumGradient)"
                  stroke="none"
                  dot={false}
                  activeDot={false}
                />
              )}
              
              {/* Main lines */}
              {(focusedMetric === 'returns' || focusedMetric === 'both') && (
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
              )}
              
              {(focusedMetric === 'aum' || focusedMetric === 'both') && (
                <Line
                  yAxisId="aum"
                  type="monotone"
                  dataKey="aum"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ r: 3, fill: 'hsl(var(--chart-2))' }}
                  activeDot={{ r: 4, fill: 'hsl(var(--chart-2))' }}
                  name="AUM (€M)"
                  connectNulls={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Performance Disclaimer */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium">Performance Disclaimer:</span> Historical performance is not indicative of future results. 
                Past performance does not guarantee future returns. All investments carry risk of loss. The volatility measure shows 
                the standard deviation of monthly returns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedHistoricalPerformanceChart;