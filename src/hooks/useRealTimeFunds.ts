import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Fund, FundTag, FundCategory, GeographicAllocation, TeamMember, PdfDocument, FAQItem, RedemptionFrequency } from '../data/types/funds';
// Supabase client is lazy-loaded to keep SSR safe
const getSupabase = async () => (await import('../integrations/supabase/client')).supabase;

// Options for selective real-time subscriptions
interface UseRealTimeFundsOptions {
  // Subscribe to specific fund IDs only (for fund detail pages)
  subscribeTo?: string[];
  // Enable/disable real-time updates
  enableRealTime?: boolean;
}

export const useRealTimeFunds = (options: UseRealTimeFundsOptions = {}) => {
  const { subscribeTo, enableRealTime = true } = options;
  
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for debouncing and preventing duplicate requests
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);

  // Function to fetch funds from Supabase with smart caching
  const fetchFunds = useCallback(async (forceRefresh: boolean = false) => {
    // Prevent duplicate fetches within 1 second
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTimeRef.current < 1000) {
      console.log('⏭️ Skipping fetch - too recent');
      return;
    }
    
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('⏭️ Skipping fetch - already in progress');
      return;
    }
    
    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);
      console.log('🔍 Fetching funds from Supabase...');
      
      // Optimized: Fetch funds with rankings in a single query using JOIN
      const supabase = await getSupabase();
      const { data: supabaseFunds, error: fetchError } = await supabase
        .from('funds')
        .select(`
          *,
          fund_rankings (
            manual_rank
          )
        `)
        .order('created_at', { ascending: true });

      console.log('📊 Supabase response:', { 
        fundsCount: supabaseFunds?.length, 
        hasError: !!fetchError
      });
      
      if (fetchError) {
        console.error('❌ Error fetching funds:', fetchError);
        setError('Failed to fetch funds');
        setFunds(staticFunds); // Simple fallback to static data
        return;
      }

      if (supabaseFunds && supabaseFunds.length > 0) {
        // Transform Supabase data to match our Fund interface
        const transformedFunds: Fund[] = supabaseFunds.map(fund => {
          // Get ranking from joined data
          const ranking = Array.isArray(fund.fund_rankings) && fund.fund_rankings.length > 0
            ? fund.fund_rankings[0].manual_rank
            : 999;
          
          return {
            id: fund.id,
            name: fund.name,
            description: fund.description || '',
            detailedDescription: fund.detailed_description || '',
            managerName: fund.manager_name || '',
            minimumInvestment: Number(fund.minimum_investment) || 0,
            fundSize: Number(fund.aum) / 1000000 || 0,
            managementFee: Number(fund.management_fee) || 0,
            performanceFee: Number(fund.performance_fee) || 0,
            term: Math.round((fund.lock_up_period_months || 0) / 12) || 5,
            returnTarget: fund.expected_return_min && fund.expected_return_max 
              ? (fund.expected_return_min === fund.expected_return_max 
                  ? `${fund.expected_return_min}% annually` 
                  : `${fund.expected_return_min}-${fund.expected_return_max}% annually`)
              : fund.expected_return_min 
                ? `${fund.expected_return_min}% annually`
                : 'Unspecified',
            expectedReturnMin: fund.expected_return_min || undefined,
            expectedReturnMax: fund.expected_return_max || undefined,
            fundStatus: 'Open' as const,
            established: fund.inception_date 
              ? new Date(fund.inception_date).getFullYear() 
              : new Date().getFullYear(),
            regulatedBy: fund.regulated_by || undefined,
            location: fund.location || undefined,
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
            historicalPerformance: (() => {
              const hp = fund.historical_performance as Record<string, { returns?: number; aum?: number; nav?: number }> | null;
              if (hp && typeof hp === 'object' && Object.keys(hp).length > 0) return hp;
              return undefined;
            })(),
            datePublished: fund.created_at || new Date().toISOString(),
            dateModified: fund.updated_at || fund.created_at || new Date().toISOString(),
            subscriptionFee: fund.subscription_fee ? Number(fund.subscription_fee) : undefined,
            redemptionFee: fund.redemption_fee ? Number(fund.redemption_fee) : undefined,
            redemptionTerms: (() => {
              const rt = fund.redemption_terms;
              if (rt && typeof rt === 'object' && !Array.isArray(rt)) {
                const rtObj = rt as Record<string, any>;
                return {
                  frequency: rtObj.frequency as RedemptionFrequency || 'Quarterly',
                  redemptionOpen: Boolean(rtObj.redemptionOpen ?? rtObj.redemption_open ?? true),
                  noticePeriod: rtObj.noticePeriod ?? rtObj.notice_period,
                  earlyRedemptionFee: rtObj.earlyRedemptionFee ?? rtObj.early_redemption_fee,
                  minimumHoldingPeriod: rtObj.minimumHoldingPeriod ?? rtObj.minimum_holding_period,
                  notes: rtObj.notes
                };
              }
              return undefined;
            })(),
            dataLastVerified: fund.updated_at || fund.created_at,
            performanceDataDate: fund.updated_at || fund.created_at,
            feeLastUpdated: fund.updated_at || fund.created_at,
            statusLastUpdated: fund.updated_at || fund.created_at,
            cmvmId: fund.cmvm_id || undefined,
            auditor: fund.auditor || undefined,
            custodian: fund.custodian || undefined,
            navFrequency: fund.nav_frequency || undefined,
            pficStatus: fund.pfic_status as 'QEF available' | 'MTM only' | 'Not provided' || undefined,
            hurdleRate: fund.hurdle_rate ? Number(fund.hurdle_rate) : undefined,
            eligibilityBasis: (() => {
              if (!fund.gv_eligible) return undefined;
              const eb = fund.eligibility_basis;
              if (eb && typeof eb === 'object' && !Array.isArray(eb)) {
                const ebObj = eb as Record<string, any>;
                return {
                  portugalAllocation: ebObj.portugalAllocation ?? ebObj.portugal_allocation ?? undefined,
                  maturityYears: ebObj.maturityYears ?? ebObj.maturity_years ?? undefined,
                  realEstateExposure: ebObj.realEstateExposure ?? ebObj.real_estate_exposure ?? undefined,
                  managerAttestation: ebObj.managerAttestation ?? ebObj.manager_attestation ?? false
                };
              }
              return undefined;
            })(),
            finalRank: ranking,
            updatedAt: fund.updated_at || fund.created_at || undefined,
            isVerified: fund.is_verified || false,
            verifiedAt: fund.verified_at || undefined,
            verifiedBy: fund.verified_by || undefined
          };
        });

        // Sort by verification status then rank
        const sortedFunds = transformedFunds.sort((a, b) => {
          if (a.isVerified && !b.isVerified) return -1;
          if (!a.isVerified && b.isVerified) return 1;
          return (a.finalRank ?? 999) - (b.finalRank ?? 999);
        });
        
        setFunds(sortedFunds);
        setError(null);
      } else {
        // No funds in database, use static funds as fallback
        console.log('📝 No funds in database, using static data');
        setFunds(staticFunds);
      }
    } catch (err) {
      console.error('Error in fetchFunds:', err);
      setFunds(staticFunds);
      setError('Failed to fetch funds');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);
  
  // Smart update for single fund changes
  const updateSingleFund = useCallback(async (fundId: string) => {
    console.log('🔄 Updating single fund:', fundId);
    
    try {
      const supabase = await getSupabase();
      const { data: fundData, error: fetchError } = await supabase
        .from('funds')
        .select(`
          *,
          fund_rankings (
            manual_rank
          )
        `)
        .eq('id', fundId)
        .maybeSingle();
      
      if (fetchError || !fundData) {
        console.error('Error fetching single fund:', fetchError);
        return;
      }
      
      const ranking = Array.isArray(fundData.fund_rankings) && fundData.fund_rankings.length > 0
        ? fundData.fund_rankings[0].manual_rank
        : 999;
      
      // Transform single fund (same logic as above)
      const transformedFund: Fund = {
        id: fundData.id,
        name: fundData.name,
        description: fundData.description || '',
        detailedDescription: fundData.detailed_description || '',
        managerName: fundData.manager_name || '',
        minimumInvestment: Number(fundData.minimum_investment) || 0,
        fundSize: Number(fundData.aum) / 1000000 || 0,
        managementFee: Number(fundData.management_fee) || 0,
        performanceFee: Number(fundData.performance_fee) || 0,
        term: Math.round((fundData.lock_up_period_months || 0) / 12) || 5,
        returnTarget: fundData.expected_return_min && fundData.expected_return_max 
          ? (fundData.expected_return_min === fundData.expected_return_max 
              ? `${fundData.expected_return_min}% annually` 
              : `${fundData.expected_return_min}-${fundData.expected_return_max}% annually`)
          : fundData.expected_return_min 
            ? `${fundData.expected_return_min}% annually`
            : 'Unspecified',
        expectedReturnMin: fundData.expected_return_min || undefined,
        expectedReturnMax: fundData.expected_return_max || undefined,
        fundStatus: 'Open' as const,
        established: fundData.inception_date 
          ? new Date(fundData.inception_date).getFullYear() 
          : new Date().getFullYear(),
        regulatedBy: fundData.regulated_by || undefined,
        location: fundData.location || undefined,
        tags: (fundData.tags || []) as FundTag[],
        category: (fundData.category || 'Mixed') as FundCategory,
        websiteUrl: fundData.website || undefined,
        geographicAllocation: Array.isArray(fundData.geographic_allocation) 
          ? (fundData.geographic_allocation as unknown as GeographicAllocation[])
          : undefined,
        team: Array.isArray(fundData.team_members) 
          ? (fundData.team_members as unknown as TeamMember[])
          : undefined,
        documents: Array.isArray(fundData.pdf_documents) 
          ? (fundData.pdf_documents as unknown as PdfDocument[])
          : undefined,
        faqs: Array.isArray(fundData.faqs) 
          ? (fundData.faqs as unknown as FAQItem[])
          : undefined,
        historicalPerformance: (() => {
          const hp = fundData.historical_performance as Record<string, { returns?: number; aum?: number; nav?: number }> | null;
          if (hp && typeof hp === 'object' && Object.keys(hp).length > 0) return hp;
          return undefined;
        })(),
        datePublished: fundData.created_at || new Date().toISOString(),
        dateModified: fundData.updated_at || fundData.created_at || new Date().toISOString(),
        subscriptionFee: fundData.subscription_fee ? Number(fundData.subscription_fee) : undefined,
        redemptionFee: fundData.redemption_fee ? Number(fundData.redemption_fee) : undefined,
        redemptionTerms: (() => {
          const rt = fundData.redemption_terms;
          if (rt && typeof rt === 'object' && !Array.isArray(rt)) {
            const rtObj = rt as Record<string, any>;
            return {
              frequency: rtObj.frequency as RedemptionFrequency || 'Quarterly',
              redemptionOpen: Boolean(rtObj.redemptionOpen ?? rtObj.redemption_open ?? true),
              noticePeriod: rtObj.noticePeriod ?? rtObj.notice_period,
              earlyRedemptionFee: rtObj.earlyRedemptionFee ?? rtObj.early_redemption_fee,
              minimumHoldingPeriod: rtObj.minimumHoldingPeriod ?? rtObj.minimum_holding_period,
              notes: rtObj.notes
            };
          }
          return undefined;
        })(),
        dataLastVerified: fundData.updated_at || fundData.created_at,
        performanceDataDate: fundData.updated_at || fundData.created_at,
        feeLastUpdated: fundData.updated_at || fundData.created_at,
        statusLastUpdated: fundData.updated_at || fundData.created_at,
        cmvmId: fundData.cmvm_id || undefined,
        auditor: fundData.auditor || undefined,
        custodian: fundData.custodian || undefined,
        navFrequency: fundData.nav_frequency || undefined,
        pficStatus: fundData.pfic_status as 'QEF available' | 'MTM only' | 'Not provided' || undefined,
        hurdleRate: fundData.hurdle_rate ? Number(fundData.hurdle_rate) : undefined,
        eligibilityBasis: (() => {
          if (!fundData.gv_eligible) return undefined;
          const eb = fundData.eligibility_basis;
          if (eb && typeof eb === 'object' && !Array.isArray(eb)) {
            const ebObj = eb as Record<string, any>;
            return {
              portugalAllocation: ebObj.portugalAllocation ?? ebObj.portugal_allocation ?? undefined,
              maturityYears: ebObj.maturityYears ?? ebObj.maturity_years ?? undefined,
              realEstateExposure: ebObj.realEstateExposure ?? ebObj.real_estate_exposure ?? undefined,
              managerAttestation: ebObj.managerAttestation ?? ebObj.manager_attestation ?? false
            };
          }
          return undefined;
        })(),
        finalRank: ranking,
        updatedAt: fundData.updated_at || fundData.created_at || undefined,
        isVerified: fundData.is_verified || false,
        verifiedAt: fundData.verified_at || undefined,
        verifiedBy: fundData.verified_by || undefined
      };
      
      // Update fund in state
      setFunds(prevFunds => {
        const existingIndex = prevFunds.findIndex(f => f.id === fundId);
        if (existingIndex === -1) {
          // New fund - add it
          return [...prevFunds, transformedFund].sort((a, b) => {
            if (a.isVerified && !b.isVerified) return -1;
            if (!a.isVerified && b.isVerified) return 1;
            return (a.finalRank ?? 999) - (b.finalRank ?? 999);
          });
        } else {
          // Update existing fund
          const newFunds = [...prevFunds];
          newFunds[existingIndex] = transformedFund;
          return newFunds;
        }
      });
    } catch (err) {
      console.error('Error updating single fund:', err);
    }
  }, []);
  
  // Debounced refetch to batch rapid changes
  const debouncedRefetch = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ Debounced refetch executing');
      fetchFunds(true);
    }, 500); // 500ms debounce
  }, [fetchFunds]);

  useEffect(() => {
    fetchFunds();

    const refetchHandler = () => {
      console.log('🔁 Received funds:refetch event');
      fetchFunds();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('funds:refetch' as any, refetchHandler as any);
    }

    let channel: any;

    const setupRealtime = async () => {
      if (!enableRealTime) return;
      const supabase = await getSupabase();
      channel = supabase.channel('funds-realtime-updates');

      // If subscribeTo is specified, only listen to those specific funds
      if (subscribeTo && subscribeTo.length > 0) {
        console.log('🎯 Subscribing to specific funds:', subscribeTo);
        subscribeTo.forEach(fundId => {
          channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'funds', filter: `id=eq.${fundId}` },
            (payload) => {
              console.log('🔄 Selective fund update:', fundId);
              const changedFundId = (payload.new as any)?.id || (payload.old as any)?.id;
              if (payload.eventType === 'DELETE') {
                setFunds(prev => prev.filter(f => f.id !== changedFundId));
              } else {
                updateSingleFund(changedFundId);
              }
            }
          );
        });
      } else {
        // General subscription for homepage - use debounced refetch
        channel.on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'funds' },
          (payload) => {
            console.log('🔄 General fund update detected');
            const changedFundId = (payload.new as any)?.id || (payload.old as any)?.id;
            if (payload.eventType === 'DELETE') {
              setFunds(prev => prev.filter(f => f.id !== changedFundId));
            } else if (changedFundId) {
              updateSingleFund(changedFundId);
            } else {
              debouncedRefetch();
            }
          }
        );
      }

      channel.subscribe();
    };

    setupRealtime();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('funds:refetch' as any, refetchHandler as any);
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (channel) {
        getSupabase().then((supabase) => supabase.removeChannel(channel)).catch(() => {});
      }
    };
  }, [enableRealTime, subscribeTo, updateSingleFund, debouncedRefetch, fetchFunds]);

  // Memoized filter function
  const filterFunds = useCallback((tags: FundTag[], searchQuery: string) => {
    let result = [...funds];
    
    if (tags.length > 0) {
      result = result.filter(fund => 
        tags.every(tag => fund.tags.includes(tag))
      );
    }
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(fund => 
        fund.name.toLowerCase().includes(lowerCaseQuery) ||
        fund.description.toLowerCase().includes(lowerCaseQuery) ||
        fund.managerName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return result;
  }, [funds]);

  // Memoized fund lookup
  const getFundById = useCallback((id: string): Fund | undefined => {
    return funds.find(fund => fund.id === id);
  }, [funds]);

  // Memoized manager funds lookup
  const getFundsByManager = useCallback((managerName: string): Fund[] => {
    return funds.filter(fund => fund.managerName === managerName);
  }, [funds]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    funds,
    loading,
    error,
    filterFunds,
    getFundById,
    getFundsByManager,
    refetch: fetchFunds
  }), [funds, loading, error, filterFunds, getFundById, getFundsByManager, fetchFunds]);
};
