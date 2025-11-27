import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, BarChart, Bar, Cell, Legend } from 'recharts';
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
  const [chartView, setChartView] = useState<'cumulative' | 'annual'>('cumulative');
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

  // Calculate cumulative performance from monthly returns
  const calculateCumulativeReturns = (data: typeof allChartData) => {
    let cumulativeValue = 1; // Start at 100% (or 1.0 multiplier)
    
    return data.map(item => {
      // Convert percentage to decimal and compound
      // e.g., 0.3% = 0.003, so multiplier is 1.003
      const monthlyDecimal = item.returns / 100;
      cumulativeValue *= (1 + monthlyDecimal);
      
      // Calculate cumulative return as percentage
      const cumulativeReturn = (cumulativeValue - 1) * 100;
      
      return {
        ...item,
        monthlyReturn: item.returns, // Keep original for tooltip
        returns: cumulativeReturn    // Override with cumulative for display
      };
    });
  };

  const filteredData = getFilteredData(selectedPeriod);
  const chartData = calculateCumulativeReturns(filteredData);

  // Calculate performance metrics
  const latestData = chartData[chartData.length - 1];
  const previousData = chartData[chartData.length - 2];
  const returnsTrend = latestData && previousData ? latestData.returns - previousData.returns : 0;
  
  // Average should use monthly returns, not cumulative
  const avgMonthlyReturns = filteredData.reduce((sum, item) => sum + item.returns, 0) / filteredData.length;

  // Calculate year-over-year annual returns
  const calculateAnnualReturns = () => {
    // Group monthly data by year
    const yearlyData: Record<number, typeof allChartData> = {};
    
    allChartData.forEach(item => {
      const year = item.dateObj.getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = [];
      }
      yearlyData[year].push(item);
    });
    
    // Calculate annual return for each year by compounding monthly returns
    return Object.entries(yearlyData)
      .map(([year, months]) => {
        let annualValue = 1;
        months.forEach(month => {
          const monthlyDecimal = month.returns / 100;
          annualValue *= (1 + monthlyDecimal);
        });
        const annualReturn = (annualValue - 1) * 100;
        
        return {
          year: parseInt(year),
          return: annualReturn,
          monthCount: months.length
        };
      })
      .sort((a, b) => a.year - b.year);
  };

  const annualReturnsData = calculateAnnualReturns();

  // Format large numbers with appropriate scale (K, M, B)
  const formatLargeNumber = (value: number): string => {
    if (value === 0) return '€0';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1_000_000_000) {
      // Billions
      return `${sign}€${(absValue / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
      // Millions
      return `${sign}€${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      // Thousands
      return `${sign}€${(absValue / 1_000).toFixed(1)}K`;
    } else {
      // Less than 1000
      return `${sign}€${absValue.toFixed(0)}`;
    }
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'returns') {
      return [`${value >= 0 ? '+' : ''}${value.toFixed(2)}%`, 'Cumulative Return'];
    }
    if (name === 'monthlyReturn') {
      return [`${value >= 0 ? '+' : ''}${value.toFixed(2)}%`, 'Monthly Return'];
    }
    if (name === 'aum') {
      return [formatLargeNumber(value), 'AUM'];
    }
    if (name === 'nav') {
      return [value.toFixed(3), 'NAV'];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Get the monthly return from the data point
      const dataPoint = payload[0]?.payload;
      const monthlyReturnValue = dataPoint?.monthlyReturn;
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-sm mb-3 text-foreground">{label}</p>
          
          {/* Show monthly return first */}
          {monthlyReturnValue !== undefined && (
            <div className="flex items-center justify-between gap-6 mb-2 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                />
                <span className="text-sm text-muted-foreground">Monthly Return</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {monthlyReturnValue >= 0 ? '+' : ''}{monthlyReturnValue.toFixed(2)}%
              </span>
            </div>
          )}
          
          {/* Then show all other metrics */}
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
              Cumulative returns compounded from monthly data
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
              Avg Monthly: {avgMonthlyReturns >= 0 ? '+' : ''}{avgMonthlyReturns.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <AuthGate 
          message="Sign in to see detailed historical performance data and charts"
          height="400px"
        >
          {/* View Toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setChartView('cumulative')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                chartView === 'cumulative'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Cumulative Performance
            </button>
            <button
              onClick={() => setChartView('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                chartView === 'annual'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Annual Returns
            </button>
          </div>

          {chartView === 'cumulative' && (
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
                  tickFormatter={(value) => formatLargeNumber(value)}
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
                  name="Cumulative Return (%)"
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
          )}

          {chartView === 'annual' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Year-Over-Year Performance Comparison
                </h3>
                <p className="text-xs text-muted-foreground">
                  Annual returns calculated by compounding monthly performance data
                </p>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={annualReturnsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="hsl(var(--border))" 
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                    
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fontSize: 12, 
                        fill: 'hsl(var(--muted-foreground))',
                        fontWeight: 500
                      }}
                      dy={10}
                    />
                    
                    <YAxis 
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
                    
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
                              <p className="font-semibold text-sm mb-2 text-foreground">
                                {data.year}
                              </p>
                              <div className="flex items-center justify-between gap-6">
                                <span className="text-sm text-muted-foreground">
                                  Annual Return
                                </span>
                                <span className={`text-sm font-medium ${
                                  data.return >= 0 ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                  {data.return >= 0 ? '+' : ''}{data.return.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-6 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Data Points
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {data.monthCount} months
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    
                    <Bar 
                      dataKey="return" 
                      radius={[8, 8, 0, 0]}
                    >
                      {annualReturnsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.return >= 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-5))'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Annual Returns Summary Table */}
              <div className="mt-6 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Year</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Annual Return</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Data Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annualReturnsData.map((data, index) => (
                      <tr 
                        key={data.year}
                        className={`border-b border-border last:border-0 ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-foreground">{data.year}</td>
                        <td className={`py-3 px-4 text-right font-semibold ${
                          data.return >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {data.return >= 0 ? '+' : ''}{data.return.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {data.monthCount} months
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
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