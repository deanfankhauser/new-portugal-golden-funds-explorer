import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FundMetrics {
  monthlyViews: number;
  totalLeads: number;
  loading: boolean;
}

interface MetricsMap {
  [fundId: string]: FundMetrics;
}

export const useFundEngagementMetrics = (fundIds: string[]): MetricsMap => {
  const [metrics, setMetrics] = useState<MetricsMap>({});

  useEffect(() => {
    const fetchMetrics = async () => {
      if (fundIds.length === 0) return;

      // Initialize loading state for all funds
      const initialState = fundIds.reduce((acc, id) => ({
        ...acc,
        [id]: { monthlyViews: 0, totalLeads: 0, loading: true }
      }), {} as MetricsMap);
      setMetrics(initialState);

      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Query 1: Monthly page views (last 30 days)
        const { data: viewsData, error: viewsError } = await supabase
          .from('fund_page_views')
          .select('fund_id')
          .in('fund_id', fundIds)
          .gte('viewed_at', thirtyDaysAgo.toISOString());

        if (viewsError) throw viewsError;

        // Query 2: Total leads
        const { data: leadsData, error: leadsError } = await supabase
          .from('fund_enquiries')
          .select('fund_id')
          .in('fund_id', fundIds);

        if (leadsError) throw leadsError;

        // Aggregate results
        const viewsCounts: { [key: string]: number } = {};
        const leadsCounts: { [key: string]: number } = {};

        viewsData?.forEach((view) => {
          viewsCounts[view.fund_id] = (viewsCounts[view.fund_id] || 0) + 1;
        });

        leadsData?.forEach((lead) => {
          leadsCounts[lead.fund_id] = (leadsCounts[lead.fund_id] || 0) + 1;
        });

        // Build final metrics object
        const finalMetrics = fundIds.reduce((acc, id) => ({
          ...acc,
          [id]: {
            monthlyViews: viewsCounts[id] || 0,
            totalLeads: leadsCounts[id] || 0,
            loading: false
          }
        }), {} as MetricsMap);

        setMetrics(finalMetrics);
      } catch (error) {
        console.error('Error fetching fund engagement metrics:', error);
        
        // Set error state
        const errorState = fundIds.reduce((acc, id) => ({
          ...acc,
          [id]: { monthlyViews: 0, totalLeads: 0, loading: false }
        }), {} as MetricsMap);
        setMetrics(errorState);
      }
    };

    fetchMetrics();
  }, [fundIds.join(',')]);

  return metrics;
};
