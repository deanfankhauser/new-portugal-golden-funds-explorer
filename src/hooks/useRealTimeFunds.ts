import { useState, useEffect } from 'react';
import { Fund, FundTag, FundCategory, GeographicAllocation, TeamMember, PdfDocument, FAQItem } from '../data/types/funds';
import { funds as staticFunds } from '../data/funds'; // Fallback to static data
import { supabase } from '../integrations/supabase/client';

export const useRealTimeFunds = () => {
  const [funds, setFunds] = useState<Fund[]>(staticFunds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch funds from Supabase
  const fetchFunds = async () => {
    try {
      setLoading(true);
      const { data: supabaseFunds, error: fetchError } = await supabase
        .from('funds')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching funds from Supabase:', fetchError);
        // Fall back to static funds if there's an error
        setFunds(staticFunds);
        setError('Using cached data');
        return;
      }

      if (supabaseFunds && supabaseFunds.length > 0) {
        // Transform Supabase data to match our Fund interface
        const transformedFunds: Fund[] = supabaseFunds.map(fund => ({
          id: fund.id,
          name: fund.name,
          description: fund.description || '',
          detailedDescription: fund.detailed_description || '',
          managerName: fund.manager_name || '',
          minimumInvestment: Number(fund.minimum_investment) || 0,
          fundSize: Number(fund.aum) / 1000000 || 0, // Convert to millions
          managementFee: Number(fund.management_fee) || 0,
          performanceFee: Number(fund.performance_fee) || 0,
          term: Math.round((fund.lock_up_period_months || 0) / 12) || 5, // Convert months to years
          returnTarget: fund.expected_return_min && fund.expected_return_max 
            ? `${fund.expected_return_min}-${fund.expected_return_max}% annually`
            : 'Target returns not specified',
          fundStatus: 'Open' as const, // Default status
          established: fund.inception_date 
            ? new Date(fund.inception_date).getFullYear() 
            : new Date().getFullYear(),
          regulatedBy: 'CMVM', // Default regulator for Portuguese funds
          location: 'Portugal', // Default location
          tags: (fund.tags || []) as FundTag[],
          category: (fund.category || 'Mixed') as FundCategory,
          websiteUrl: fund.website || undefined,
          geographicAllocation: Array.isArray(fund.geographic_allocation) 
            ? (fund.geographic_allocation as unknown as GeographicAllocation[])
            : undefined,
          team: Array.isArray(fund.team_members) 
            ? (fund.team_members as unknown as TeamMember[])
            : undefined,
          documents: Array.isArray(fund.pdf_documents) 
            ? (fund.pdf_documents as unknown as PdfDocument[])
            : undefined,
          faqs: Array.isArray(fund.faqs) 
            ? (fund.faqs as unknown as FAQItem[])
            : undefined,
          // Date tracking
          datePublished: fund.created_at || new Date().toISOString(),
          dateModified: fund.updated_at || fund.created_at || new Date().toISOString(),
          // Additional fields with defaults
          subscriptionFee: 0,
          redemptionFee: 0,
          managerLogo: undefined,
          redemptionTerms: undefined,
          dataLastVerified: fund.updated_at || fund.created_at,
          performanceDataDate: fund.updated_at || fund.created_at,
          feeLastUpdated: fund.updated_at || fund.created_at,
          statusLastUpdated: fund.updated_at || fund.created_at,
          cmvmId: undefined,
          auditor: undefined,
          custodian: undefined,
          navFrequency: undefined,
          pficStatus: undefined,
          eligibilityBasis: fund.gv_eligible ? {
            portugalAllocation: 'Not provided',
            maturityYears: 'Not provided',
            realEstateExposure: 'Not provided',
            managerAttestation: true
          } : undefined
        }));

        setFunds(transformedFunds);
        setError(null);
        console.log('✅ Successfully loaded funds from Supabase:', transformedFunds.length);
      } else {
        // No funds in database, use static funds
        setFunds(staticFunds);
        console.log('📝 No funds in database, using static data');
      }
    } catch (err) {
      console.error('Error in fetchFunds:', err);
      setFunds(staticFunds);
      setError('Failed to fetch funds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funds'
        },
        (payload) => {
          console.log('🔄 Real-time fund update detected:', payload);
          // Refetch funds when any change occurs
          fetchFunds();
        }
      )
      .subscribe();

    return () => {
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
    refetch: fetchFunds
  };
};