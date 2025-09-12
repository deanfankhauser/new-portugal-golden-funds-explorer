import { useState, useEffect } from 'react';
import { Fund, FundTag } from '../data/types/funds';
import { supabase } from '@/integrations/supabase/client';

// Transform database row to Fund interface
const transformDatabaseRowToFund = (row: any): Fund => {
  const parseJsonField = (field: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    detailedDescription: row.detailed_description || row.description || '',
    tags: (row.tags || []) as FundTag[],
    category: row.category || 'Mixed',
    minimumInvestment: row.minimum_investment || 0,
    fundSize: row.aum ? row.aum / 1000000 : 0,
    managementFee: Number(row.management_fee) || 0,
    performanceFee: Number(row.performance_fee) || 0,
    term: row.lock_up_period_months ? Math.round(row.lock_up_period_months / 12) : 5,
    managerName: row.manager_name || '',
    returnTarget: `${row.expected_return_min || 0}-${row.expected_return_max || 0}% annually`,
    fundStatus: 'Open' as const,
    websiteUrl: row.website || undefined,
    established: row.inception_date ? new Date(row.inception_date).getFullYear() : new Date().getFullYear(),
    regulatedBy: 'CMVM',
    location: 'Portugal',
    geographicAllocation: parseJsonField(row.geographic_allocation),
    team: parseJsonField(row.team_members),
    documents: parseJsonField(row.pdf_documents),
    faqs: parseJsonField(row.faqs),
    dateModified: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    datePublished: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
};

export const useRealTimeFunds = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        console.log('🔄 Fetching funds from Supabase...');
        setLoading(true);
        
        // Use raw query since types aren't generated yet
        const { data, error: queryError } = await supabase
          .from('funds' as any)
          .select('*')
          .order('name');

        if (queryError) {
          console.error('Error fetching funds:', queryError);
          setError(queryError.message);
          return;
        }

        const transformedFunds = (data || []).map(transformDatabaseRowToFund);
        console.log(`✅ Loaded ${transformedFunds.length} funds from database`);
        setFunds(transformedFunds);
        setError(null);
      } catch (err) {
        console.error('Error in fetchFunds:', err);
        setError('Failed to load funds');
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();

    // Set up real-time subscription
    console.log('🔔 Setting up real-time subscription for funds...');
    const channel = supabase
      .channel('funds-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funds'
        },
        (payload) => {
          console.log('🔄 Fund data changed:', payload);
          // Refetch funds when any change occurs
          fetchFunds();
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const filterFunds = (tags: FundTag[], searchQuery: string) => {
    let result = [...funds];
    
    // Apply tag filtering
    if (tags.length > 0) {
      result = result.filter(fund => 
        tags.every(tag => fund.tags.includes(tag))
      );
    }
    
    // Apply search filtering
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(fund => 
        fund.name.toLowerCase().includes(lowerCaseQuery) ||
        fund.description.toLowerCase().includes(lowerCaseQuery) ||
        fund.managerName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return result;
  };

  const getFundById = (id: string): Fund | undefined => {
    return funds.find(fund => fund.id === id);
  };

  const getFundsByManager = (managerName: string): Fund[] => {
    return funds.filter(fund => fund.managerName === managerName);
  };

  return {
    funds,
    loading,
    error,
    filterFunds,
    getFundById,
    getFundsByManager,
    refetch: async () => {
      setLoading(true);
      try {
        const { data, error: queryError } = await supabase
          .from('funds' as any)
          .select('*')
          .order('name');

        if (queryError) {
          setError(queryError.message);
          return;
        }

        const transformedFunds = (data || []).map(transformDatabaseRowToFund);
        setFunds(transformedFunds);
        setError(null);
      } catch (err) {
        setError('Failed to reload funds');
      } finally {
        setLoading(false);
      }
    }
  };
};