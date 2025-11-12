import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsTabProps {
  fundId: string;
}

interface AnalyticsData {
  pageViews: number;
  dailyViews: { date: string; count: number }[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ fundId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [fundId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Fetch page views
      const { data: pageViewsData, error: pageViewsError } = await supabase
        .from('fund_page_views')
        .select('*')
        .eq('fund_id', fundId)
        .gte('viewed_at', thirtyDaysAgo.toISOString());

      if (pageViewsError) throw pageViewsError;

      // Calculate daily views for chart
      const viewsByDate: Record<string, number> = {};
      pageViewsData?.forEach(view => {
        const date = new Date(view.viewed_at).toLocaleDateString();
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });

      const dailyViews = Object.entries(viewsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 days

      setAnalytics({
        pageViews: pageViewsData?.length || 0,
        dailyViews,
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
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
          <CardDescription>Daily page views for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.dailyViews.length > 0 ? (
            <div className="h-64 flex items-end gap-1">
              {analytics.dailyViews.map((day, index) => {
                const maxCount = Math.max(...analytics.dailyViews.map(d => d.count));
                const heightPercent = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                      style={{ height: `${heightPercent}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                      title={`${day.date}: ${day.count} views`}
                    />
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No page views yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
