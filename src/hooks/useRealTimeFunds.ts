import { useState, useEffect } from 'react';
import { Fund, FundTag, FundCategory, GeographicAllocation, TeamMember, PdfDocument, FAQItem } from '../data/types/funds';
import { funds as staticFunds } from '../data/funds'; // Fallback to static data
import { supabase } from '../integrations/supabase/client';

export const useRealTimeFunds = () => {
  const [funds, setFunds] = useState<Fund[]>(staticFunds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Helper to apply approved edit history changes on top of base funds
const applyEditHistory = (
  baseFunds: Fund[],
  edits: { fund_id: string; changes: Record<string, any> }[]
): Fund[] => {
  if (!edits || edits.length === 0) return baseFunds;
  const map: Record<string, Fund> = Object.fromEntries(baseFunds.map(f => [f.id, { ...f }]));

  for (const e of edits) {
    const f = map[e.fund_id];
    if (!f) continue;

    const c = e.changes || {};
    // Normalize common snake_case fields to camelCase expected by UI
    const n: Record<string, any> = { ...c };
    if (c.short_description && typeof c.short_description === 'string') n.description = c.short_description;
    if (c.shortDescription && typeof c.shortDescription === 'string') n.description = c.shortDescription;
    if (c.description && typeof c.description === 'string') n.description = c.description;
    if (c.detailed_description && typeof c.detailed_description === 'string') n.detailedDescription = c.detailed_description;
    if (c.manager_name && typeof c.manager_name === 'string') n.managerName = c.manager_name;
    if (c.minimum_investment != null) n.minimumInvestment = Number(c.minimum_investment);
    if (c.management_fee != null) n.managementFee = Number(c.management_fee);
    if (c.performance_fee != null) n.performanceFee = Number(c.performance_fee);
    if (c.lock_up_period_months != null) n.term = Math.round(Number(c.lock_up_period_months) / 12);
    if (c.website && typeof c.website === 'string') n.websiteUrl = c.website;
    if (c.website_url && typeof c.website_url === 'string') n.websiteUrl = c.website_url;
    if (c.websiteUrl && typeof c.websiteUrl === 'string') n.websiteUrl = c.websiteUrl;
    if (c.geographic_allocation && Array.isArray(c.geographic_allocation)) n.geographicAllocation = c.geographic_allocation;
    if (c.historicalPerformance && typeof c.historicalPerformance === 'object') n.historicalPerformance = c.historicalPerformance;
    if (c.historical_performance && typeof c.historical_performance === 'object') n.historicalPerformance = c.historical_performance;
    if (c.faqs && Array.isArray(c.faqs)) n.faqs = c.faqs;
    if (c.logo_url === null || c.logoUrl === null || c.logo_url === '' || c.logoUrl === '') n.logoUrl = null;
    if (typeof c.logo_url === 'string') n.logoUrl = c.logo_url;
    if (typeof c.logoUrl === 'string') n.logoUrl = c.logoUrl;

    // Apply supported fields
    console.log(`Applying overlay for fund ${f.id}:`, n);
    if (typeof n.description === 'string') {
      console.log(`Updating description from "${f.description}" to "${n.description}"`);
      f.description = n.description;
    }
    if (typeof n.detailedDescription === 'string') f.detailedDescription = n.detailedDescription;
    if (typeof n.managerName === 'string') f.managerName = n.managerName;
    if (typeof n.category === 'string') f.category = n.category as any; // cast to FundCategory
    if (typeof n.websiteUrl === 'string') f.websiteUrl = n.websiteUrl;
    if (typeof n.location === 'string') f.location = n.location;
    if (typeof n.returnTarget === 'string') f.returnTarget = n.returnTarget;
    if (typeof n.minimumInvestment === 'number') f.minimumInvestment = n.minimumInvestment;
    if (typeof n.managementFee === 'number') f.managementFee = n.managementFee;
    if (typeof n.performanceFee === 'number') f.performanceFee = n.performanceFee;
    if (typeof n.subscriptionFee === 'number') f.subscriptionFee = n.subscriptionFee;
    if (typeof n.redemptionFee === 'number') f.redemptionFee = n.redemptionFee;
    if (typeof n.term === 'number') f.term = n.term; // years
    if (typeof n.fundSize === 'number') f.fundSize = n.fundSize;
    if (typeof n.established === 'number') f.established = n.established;
    if (typeof n.regulatedBy === 'string') f.regulatedBy = n.regulatedBy;
    if (Array.isArray(n.geographicAllocation)) f.geographicAllocation = n.geographicAllocation;
    if (Array.isArray(n.team)) f.team = n.team;
    if (Array.isArray(n.documents)) f.documents = n.documents;
    if (typeof n.historicalPerformance === 'object' && n.historicalPerformance && Object.keys(n.historicalPerformance).length > 0) {
      f.historicalPerformance = n.historicalPerformance;
    }
    if (Array.isArray(n.faqs)) f.faqs = n.faqs;
  }

  return Object.values(map);
};

// Function to fetch funds from Supabase
  const fetchFunds = async () => {
    try {
      setLoading(true);
      console.log('🔍 Attempting to fetch funds from Supabase...');
      console.log('🔗 Environment variables check:', {
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        supabaseUrlPrefix: import.meta.env.VITE_SUPABASE_URL?.substring(0, 50),
        anonKeyPrefix: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
      });
      
      // Test basic connection first
      const { data: testData, error: testError } = await supabase
        .from('funds')
        .select('id, name')
        .limit(1);
      
      console.log('🧪 Basic connection test:', { testData, testError });
      
      const { data: supabaseFunds, error: fetchError } = await supabase
        .from('funds')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('📊 Supabase response:', { 
        supabaseFunds: supabaseFunds?.length, 
        fetchError,
        actualData: supabaseFunds?.slice(0, 2) // Show first 2 funds for debugging
      });
      
      if (fetchError) {
        console.error('❌ Error fetching funds from Supabase:', fetchError);
        console.error('❌ Full error details:', JSON.stringify(fetchError, null, 2));
        
        // If 401 error, try fetching from Funds_Develop via edge function
        if (fetchError.code === 'PGRST301' || fetchError.message?.includes('401')) {
          console.log('🔄 401 error detected, trying Funds_Develop via edge function...');
          try {
            const { data: developFunds, error: developError } = await supabase.functions.invoke('get-develop-funds');
            
            if (!developError && developFunds?.funds) {
              console.log('✅ Successfully fetched from Funds_Develop:', developFunds.funds.length, 'funds');
              
              // Transform the data to Fund interface
              const transformedFunds: Fund[] = developFunds.funds.map((fund: any) => ({
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
                  ? `${fund.expected_return_min}-${fund.expected_return_max}% annually`
                  : 'Target returns not specified',
                fundStatus: 'Open' as const,
                established: fund.inception_date 
                  ? new Date(fund.inception_date).getFullYear() 
                  : new Date().getFullYear(),
                regulatedBy: 'CMVM',
                location: 'Portugal',
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
                  return staticFunds.find(s => s.id === fund.id)?.historicalPerformance;
                })(),
                datePublished: fund.created_at || new Date().toISOString(),
                dateModified: fund.updated_at || fund.created_at || new Date().toISOString(),
            subscriptionFee: 0,
            redemptionFee: 0,
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
              return;
            }
          } catch (developErr) {
            console.error('❌ Failed to fetch from Funds_Develop:', developErr);
          }
        }
        
        // Fall back to static funds and try to overlay edit history if possible
        try {
          const base = staticFunds;
          const { data: editsData, error: editsError } = await supabase
            .from('fund_edit_history')
            .select('fund_id, changes, applied_at')
            .order('applied_at', { ascending: true });

          if (!editsError && editsData && editsData.length > 0) {
            const finalFunds = applyEditHistory(base, editsData as any);
            setFunds(finalFunds);
          } else {
            setFunds(base);
          }
        } catch (e) {
          setFunds(staticFunds);
        }
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
          historicalPerformance: (() => {
            const hp = fund.historical_performance as Record<string, { returns?: number; aum?: number; nav?: number }> | null;
            if (hp && typeof hp === 'object' && Object.keys(hp).length > 0) return hp;
            return staticFunds.find(s => s.id === fund.id)?.historicalPerformance;
          })(),
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
          } : undefined,
          fundBriefUrl: fund.fund_brief_url || undefined
        }));

        // Also fetch edit history and apply approved changes as an overlay
        const { data: editsData, error: editsError } = await supabase
          .from('fund_edit_history')
          .select('fund_id, changes, applied_at')
          .order('applied_at', { ascending: true });

        if (editsError) {
          console.warn('Could not fetch fund_edit_history, proceeding without overlay:', editsError);
          setFunds(transformedFunds);
        } else if (editsData && editsData.length > 0) {
          const finalFunds = applyEditHistory(transformedFunds, editsData as any);
          setFunds(finalFunds);
        } else {
          setFunds(transformedFunds);
        }
        setError(null);
        console.log('✅ Successfully loaded funds from Supabase:', (supabaseFunds?.length || 0), 'with overlay edits:', (editsData?.length || 0));
        console.log('Applied edit history changes:', editsData?.map(e => ({ fund_id: e.fund_id, changes: Object.keys(e.changes || {}) })));
      } else {
        // No funds in database, use static funds but overlay any approved edit history
        try {
          const base = staticFunds;
          const { data: editsData, error: editsError } = await supabase
            .from('fund_edit_history')
            .select('fund_id, changes, applied_at')
            .order('applied_at', { ascending: true });

          if (!editsError && editsData && editsData.length > 0) {
            const finalFunds = applyEditHistory(base, editsData as any);
            setFunds(finalFunds);
          } else {
            setFunds(base);
          }
          console.log('📝 No funds in database, using static data with overlay count:', (editsData?.length || 0));
        } catch (overlayErr) {
          console.warn('Overlay fetch failed, using static funds only:', overlayErr);
          setFunds(staticFunds);
        }
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

    const refetchHandler = () => {
      console.log('🔁 Received funds:refetch event');
      fetchFunds();
    };

    const applyOverlayHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { fund_id: string; changes: Record<string, any> };
      if (!detail?.fund_id || !detail?.changes) return;
      console.log('🧩 Applying local overlay from event:', detail);
      setFunds(prev => applyEditHistory(prev, [{ fund_id: detail.fund_id, changes: detail.changes } as any]));
    };

    window.addEventListener('funds:refetch' as any, refetchHandler as any);
    window.addEventListener('funds:apply-overlay' as any, applyOverlayHandler as any);

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
          console.log('Event type:', payload.eventType);
          console.log('Changed fund ID:', (payload.new as any)?.id || (payload.old as any)?.id);
          console.log('Changed data:', payload.new);
          console.log('Triggering funds refetch due to funds table change...');
          fetchFunds();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fund_edit_history'
        },
        (payload) => {
          console.log('📝 Real-time edit history change detected:', payload);
          console.log('Edit history event type:', payload.eventType);
          console.log('Edit data:', payload.new);
          console.log('Triggering funds refetch due to edit history change...');
          fetchFunds();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('funds:refetch' as any, refetchHandler as any);
      window.removeEventListener('funds:apply-overlay' as any, applyOverlayHandler as any);
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