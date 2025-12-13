import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';

interface AnalyticsTabProps {
  fundId: string;
}

interface AnalyticsData {
  pageViews: number;
  chartData: { date: string; count: number; label: string }[];
}

type TimeRange = '7d' | '30d' | '12m';

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ fundId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [fundId, timeRange]);

  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return { start: subDays(now, 7), end: now, isMonthly: false };
      case '30d':
        return { start: subDays(now, 30), end: now, isMonthly: false };
      case '12m':
        return { start: subMonths(now, 12), end: now, isMonthly: true };
    }
  };

  const formatChartDate = (date: Date, isMonthly: boolean): string => {
    if (isMonthly) {
      return format(date, 'yyyy-MM');
    }
    return format(date, 'yyyy-MM-dd');
  };

  const formatXAxisLabel = (dateStr: string, range: TimeRange): string => {
    const date = new Date(dateStr);
    if (range === '12m') {
      return format(date, 'MMM yyyy');
    } else if (range === '7d') {
      return format(date, 'EEE d');
    } else {
      return format(date, 'MMM d');
    }
  };

  const getTimeRangeLabel = (range: TimeRange): string => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '12m': return 'Last 12 months';
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;

    // Create CSV header
    const header = ['Date', 'Page Views'];
    
    // Create CSV rows
    const rows = analytics.chartData.map(item => [
      item.label,
      item.count.toString()
    ]);

    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `fund-analytics-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: 'Analytics data has been exported to CSV.',
    });
  };

  const fetchAnalytics = async (range: TimeRange) => {
    try {
      setLoading(true);
      
      const { start, end, isMonthly } = getDateRange(range);
      
      // Fetch page views
      const { data: pageViewsData, error: pageViewsError } = await supabase
        .from('fund_page_views')
        .select('*')
        .eq('fund_id', fundId)
        .gte('viewed_at', start.toISOString())
        .lte('viewed_at', end.toISOString());

      if (pageViewsError) throw pageViewsError;

      // Group views by date or month
      const viewsByPeriod: Record<string, number> = {};
      pageViewsData?.forEach(view => {
        const viewDate = new Date(view.viewed_at);
        const key = formatChartDate(viewDate, isMonthly);
        viewsByPeriod[key] = (viewsByPeriod[key] || 0) + 1;
      });

      // Generate all dates/months in range with zero counts for missing periods
      const allPeriods = isMonthly
        ? eachMonthOfInterval({ start, end }).map(d => formatChartDate(d, true))
        : eachDayOfInterval({ start, end }).map(d => formatChartDate(d, false));

      const chartData = allPeriods.map(period => ({
        date: period,
        count: viewsByPeriod[period] || 0,
        label: formatXAxisLabel(period, range),
      }));

      setAnalytics({
        pageViews: pageViewsData?.length || 0,
        chartData,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error loading analytics',
        description: 'Could not load analytics data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector and Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value as TimeRange)}>
          <ToggleGroupItem value="7d" aria-label="7 Days">
            7 Days
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" aria-label="Monthly">
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value="12m" aria-label="Yearly">
            Yearly
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToCSV}
          disabled={!analytics || analytics.chartData.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Page Views Metric */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Page Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.pageViews}</div>
          <p className="text-xs text-muted-foreground mt-1">{getTimeRangeLabel(timeRange)}</p>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
          <CardDescription>
            {timeRange === '12m' ? 'Monthly' : 'Daily'} page views for the {getTimeRangeLabel(timeRange).toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#A97155"
                  strokeWidth={2}
                  dot={{ fill: '#A97155', r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Page Views"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No page views yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
