import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, ComposedChart } from 'recharts';
import { Badge } from '../ui/badge';

interface PerformanceModuleProps {
  fund: Fund;
}

type TimeRange = 'YTD' | '1Y' | '3Y' | 'MAX';
type ChartType = 'cumulative' | 'drawdown' | 'rolling' | 'heatmap';

const PerformanceModule: React.FC<PerformanceModuleProps> = ({ fund }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('MAX');
  const [chartType, setChartType] = useState<ChartType>('cumulative');
  const [benchmark, setBenchmark] = useState('3M EUR Cash');

  // Process historical performance data
  const processPerformanceData = (range: TimeRange) => {
    if (!fund.historicalPerformance) return [];

    const entries = Object.entries(fund.historicalPerformance);
    const currentDate = new Date();
    
    let filteredEntries = entries;
    
    switch (range) {
      case 'YTD':
        filteredEntries = entries.filter(([date]) => 
          new Date(date).getFullYear() === currentDate.getFullYear()
        );
        break;
      case '1Y':
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filteredEntries = entries.filter(([date]) => new Date(date) >= oneYearAgo);
        break;
      case '3Y':
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
        filteredEntries = entries.filter(([date]) => new Date(date) >= threeYearsAgo);
        break;
      case 'MAX':
      default:
        break;
    }

    return filteredEntries
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, data]) => ({
        date,
        returns: data.returns,
        aum: data.aum,
        nav: data.nav,
        benchmark: generateBenchmarkData(date), // Mock benchmark data
        formattedDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        })
      }));
  };

  // Generate mock benchmark data
  const generateBenchmarkData = (date: string) => {
    // Simple 3M EUR cash rate simulation (around 3-4% annually)
    const baseRate = 3.5;
    const monthlyRate = baseRate / 12;
    const daysSinceEpoch = new Date(date).getTime() / (1000 * 60 * 60 * 24);
    return (daysSinceEpoch * monthlyRate / 30) % 100; // Simplified calculation
  };

  // Calculate drawdown data
  const calculateDrawdown = (data: any[]) => {
    let peak = data[0]?.returns || 0;
    return data.map(item => {
      if (item.returns > peak) peak = item.returns;
      const drawdown = ((peak - item.returns) / peak) * 100;
      return { ...item, drawdown: -Math.abs(drawdown) };
    });
  };

  // Calculate rolling 12-month returns
  const calculateRolling12M = (data: any[]) => {
    return data.map((item, index) => {
      if (index < 12) return { ...item, rolling12M: 0 };
      const current = item.returns;
      const yearAgo = data[index - 12]?.returns || 0;
      return { ...item, rolling12M: current - yearAgo };
    });
  };

  const chartData = processPerformanceData(selectedRange);
  const drawdownData = calculateDrawdown(chartData);
  const rolling12MData = calculateRolling12M(chartData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {typeof entry.value === 'number' ? `${entry.value.toFixed(2)}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Performance Analysis</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Cumulative return (net of fees) vs benchmark
            </p>
          </div>
          
          {/* Range Toggles */}
          <div className="flex gap-2">
            {(['YTD', '1Y', '3Y', 'MAX'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className="min-w-[60px]"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Benchmark Selector */}
        <div className="flex items-center gap-4 pt-2">
          <span className="text-sm text-muted-foreground">Benchmark:</span>
          <Select value={benchmark} onValueChange={setBenchmark}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3M EUR Cash">3M EUR Cash</SelectItem>
              <SelectItem value="MSCI Europe">MSCI Europe</SelectItem>
              <SelectItem value="STOXX Europe 600">STOXX Europe 600</SelectItem>
              <SelectItem value="Euro Gov Bonds">Euro Gov Bonds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
            <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
            <TabsTrigger value="rolling">Rolling 12M</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="cumulative" className="mt-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="returns"
                    stroke="hsl(var(--primary))"
                    fill="url(#returnsGradient)"
                    strokeWidth={2}
                    name="Fund Returns"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name={benchmark}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="drawdown" className="mt-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={drawdownData}>
                  <defs>
                    <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="hsl(var(--destructive))"
                    fill="url(#drawdownGradient)"
                    strokeWidth={2}
                    name="Drawdown"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="rolling" className="mt-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rolling12MData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Line
                    type="monotone"
                    dataKey="rolling12M"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    name="Rolling 12M Return"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Badge variant="outline" className="text-muted-foreground">
                  Calendar Heatmap Coming Soon
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Monthly return calendar visualization
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Data Attribution */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Data source: Fund manager reports • Net of management fees • 
            Inception: {fund.established || 'N/A'} • 
            Performance shown in EUR unless otherwise stated
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceModule;