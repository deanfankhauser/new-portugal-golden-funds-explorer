import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, Bookmark, Mail, CheckCircle2, XCircle, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsTabProps {
  fundId: string;
}

interface AnalyticsData {
  pageViews: number;
  comparisonAdds: number;
  saveCount: number;
  totalLeads: number;
  openLeads: number;
  wonLeads: number;
  conversionRate: number;
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

      // Fetch interactions
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('fund_interactions')
        .select('*')
        .eq('fund_id', fundId)
        .gte('interacted_at', thirtyDaysAgo.toISOString());

      if (interactionsError) throw interactionsError;

      // Fetch leads from fund_enquiries
      const { data: leadsData, error: leadsError } = await supabase
        .from('fund_enquiries')
        .select('*')
        .eq('fund_id', fundId);

      if (leadsError) throw leadsError;

      // Calculate metrics
      const comparisonAdds = interactionsData?.filter(i => i.interaction_type === 'comparison_add').length || 0;
      const saveCount = interactionsData?.filter(i => i.interaction_type === 'save_fund').length || 0;

      // Calculate lead metrics
      const totalLeads = leadsData?.length || 0;
      const openLeads = leadsData?.filter(l => l.status === 'open').length || 0;
      const wonLeads = leadsData?.filter(l => l.status === 'won').length || 0;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

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
        comparisonAdds,
        saveCount,
        totalLeads,
        openLeads,
        wonLeads,
        conversionRate,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
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
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              Saves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.saveCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Fund saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-primary" />
              Comparisons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.comparisonAdds}</div>
            <p className="text-xs text-muted-foreground mt-1">Added to comparison</p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-warning" />
              Open Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Won Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.wonLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Win rate</p>
          </CardContent>
        </Card>
      </div>

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
