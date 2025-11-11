import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Fund, FundTag, FundCategory, GeographicAllocation, TeamMember, PdfDocument, FAQItem, RedemptionFrequency } from '../data/types/funds';
import { funds as staticFunds } from '../data/funds'; // Fallback to static data
import { supabase } from '../integrations/supabase/client';

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
    
    // Handle team members from edit history
    if (c.team && Array.isArray(c.team)) {
      n.team = c.team;
    }
    if (c.team_members && Array.isArray(c.team_members)) {
      n.team = c.team_members;
    }
    
    // Regulatory compliance fields
    if (c.cmvm_id && typeof c.cmvm_id === 'string') n.cmvmId = c.cmvm_id;
    if (c.cmvmId && typeof c.cmvmId === 'string') n.cmvmId = c.cmvmId;
    if (c.auditor && typeof c.auditor === 'string') n.auditor = c.auditor;
    if (c.custodian && typeof c.custodian === 'string') n.custodian = c.custodian;
    if (c.nav_frequency && typeof c.nav_frequency === 'string') n.navFrequency = c.nav_frequency;
    if (c.navFrequency && typeof c.navFrequency === 'string') n.navFrequency = c.navFrequency;
    if (c.pfic_status && typeof c.pfic_status === 'string') n.pficStatus = c.pfic_status;
    if (c.pficStatus && typeof c.pficStatus === 'string') n.pficStatus = c.pficStatus;

    // Handle redemption terms transformations
    if (c.redemption_terms && typeof c.redemption_terms === 'object') n.redemptionTerms = c.redemption_terms;
    if (c.redemptionTerms && typeof c.redemptionTerms === 'object') n.redemptionTerms = c.redemptionTerms;

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
    if (Array.isArray(n.team)) {
      f.team = n.team;
    }
    if (Array.isArray(n.documents)) f.documents = n.documents;
    if (typeof n.historicalPerformance === 'object' && n.historicalPerformance && Object.keys(n.historicalPerformance).length > 0) {
      f.historicalPerformance = n.historicalPerformance;
    }
    if (Array.isArray(n.faqs)) f.faqs = n.faqs;
    if (typeof n.redemptionTerms === 'object' && n.redemptionTerms) f.redemptionTerms = n.redemptionTerms;
    
    // Apply regulatory compliance fields
    if (typeof n.cmvmId === 'string') f.cmvmId = n.cmvmId;
    if (typeof n.auditor === 'string') f.auditor = n.auditor;
    if (typeof n.custodian === 'string') f.custodian = n.custodian;
    if (typeof n.navFrequency === 'string') f.navFrequency = n.navFrequency;
    if (typeof n.pficStatus === 'string') f.pficStatus = n.pficStatus as 'QEF available' | 'MTM only' | 'Not provided';
  }

  return Object.values(map);
};

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
              
              // Fetch rankings for develop funds too
              const { data: rankingsData } = await supabase
                .from('fund_rankings')
                .select('fund_id, manual_rank');
              
              const rankingMap = new Map(
                rankingsData?.map(r => [r.fund_id, r.manual_rank ?? 999]) || []
              );
              
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
                  ? (fund.expected_return_min === fund.expected_return_max 
                      ? `${fund.expected_return_min}% annually` 
                      : `${fund.expected_return_min}-${fund.expected_return_max}% annually`)
                  : fund.expected_return_min 
                    ? `${fund.expected_return_min}% annually`
                    : 'Target returns not specified',
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
                     // Transform the database object to match RedemptionTerms interface
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
          finalRank: rankingMap.get(fund.id) || 999,
          updatedAt: fund.updated_at || fund.created_at || undefined
        }));
              
              // Sort funds by finalRank
              const sortedFunds = transformedFunds.sort((a, b) => 
                (a.finalRank ?? 999) - (b.finalRank ?? 999)
              );
              
              setFunds(sortedFunds);
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
          fundSize: Number(fund.aum) / 1000000 || 0, // Convert to millions
          managementFee: Number(fund.management_fee) || 0,
          performanceFee: Number(fund.performance_fee) || 0,
          term: Math.round((fund.lock_up_period_months || 0) / 12) || 5, // Convert months to years
          returnTarget: fund.expected_return_min && fund.expected_return_max 
            ? (fund.expected_return_min === fund.expected_return_max 
                ? `${fund.expected_return_min}% annually` 
                : `${fund.expected_return_min}-${fund.expected_return_max}% annually`)
            : fund.expected_return_min 
              ? `${fund.expected_return_min}% annually`
              : 'Target returns not specified',
          expectedReturnMin: fund.expected_return_min || undefined,
          expectedReturnMax: fund.expected_return_max || undefined,
          fundStatus: 'Open' as const, // Default status
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
          // Date tracking
          datePublished: fund.created_at || new Date().toISOString(),
          dateModified: fund.updated_at || fund.created_at || new Date().toISOString(),
          // Additional fields
          subscriptionFee: fund.subscription_fee ? Number(fund.subscription_fee) : undefined,
          redemptionFee: fund.redemption_fee ? Number(fund.redemption_fee) : undefined,
          redemptionTerms: (() => {
            const rt = fund.redemption_terms;
            if (rt && typeof rt === 'object' && !Array.isArray(rt)) {
              // Transform the database object to match RedemptionTerms interface
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
          // Regulatory compliance fields
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
          
          // Admin verification
          isVerified: fund.is_verified || false,
          verifiedAt: fund.verified_at || undefined,
          verifiedBy: fund.verified_by || undefined
        };
        });

        // Also fetch edit history and apply approved changes as an overlay
        const { data: editsData, error: editsError } = await supabase
          .from('fund_edit_history')
          .select('fund_id, changes, applied_at')
          .order('applied_at', { ascending: true });

        let fundsWithEdits = transformedFunds;
        
        if (editsError) {
          console.warn('Could not fetch fund_edit_history, proceeding without overlay:', editsError);
        } else if (editsData && editsData.length > 0) {
          fundsWithEdits = applyEditHistory(transformedFunds, editsData as any);
        }
        
        // Sort by: 1. Verified status (verified first), 2. finalRank
        const sortedFunds = fundsWithEdits.sort((a, b) => {
          // Verified funds always come first
          if (a.isVerified && !b.isVerified) return -1;
          if (!a.isVerified && b.isVerified) return 1;
          
          // Within verified/unverified groups, sort by finalRank
          return (a.finalRank ?? 999) - (b.finalRank ?? 999);
        });
        
        setFunds(sortedFunds);
        setError(null);
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
      isFetchingRef.current = false;
    }
  }, []); // Empty deps - fetchFunds is stable
  
  // Smart update for single fund changes
  const updateSingleFund = useCallback(async (fundId: string) => {
    console.log('🔄 Updating single fund:', fundId);
    
    try {
      const { data: fundData, error: fetchError } = await supabase
        .from('funds')
        .select(`
          *,
          fund_rankings (
            manual_rank
          )
        `)
        .eq('id', fundId)
        .single();
      
      if (fetchError || !fundData) {
        console.error('Error fetching single fund:', fetchError);
        return;
      }
      
      // Get ranking from joined data
      const ranking = Array.isArray(fundData.fund_rankings) && fundData.fund_rankings.length > 0
        ? fundData.fund_rankings[0].manual_rank
        : 999;
      
      // Transform single fund
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
            : 'Target returns not specified',
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

    const applyOverlayHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { fund_id: string; changes: Record<string, any> };
      if (!detail?.fund_id || !detail?.changes) return;
      console.log('🧩 Applying local overlay from event:', detail);
      setFunds(prev => applyEditHistory(prev, [{ fund_id: detail.fund_id, changes: detail.changes } as any]));
    };

    window.addEventListener('funds:refetch' as any, refetchHandler as any);
    window.addEventListener('funds:apply-overlay' as any, applyOverlayHandler as any);

    // Set up smart real-time subscription
    if (enableRealTime) {
      const channel = supabase.channel('funds-realtime-updates');
      
      // If subscribeTo is specified, only listen to those specific funds
      if (subscribeTo && subscribeTo.length > 0) {
        console.log('🎯 Subscribing to specific funds:', subscribeTo);
        
        // Subscribe to specific fund changes only
        subscribeTo.forEach(fundId => {
          channel.on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'funds',
              filter: `id=eq.${fundId}`
            },
            (payload) => {
              console.log('🔄 Selective fund update:', fundId);
              const changedFundId = (payload.new as any)?.id || (payload.old as any)?.id;
              
              if (payload.eventType === 'DELETE') {
                // Remove deleted fund
                setFunds(prev => prev.filter(f => f.id !== changedFundId));
              } else {
                // Update single fund instead of refetching all
                updateSingleFund(changedFundId);
              }
            }
          );
        });
      } else {
        // General subscription for homepage - use debounced refetch
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'funds'
          },
          (payload) => {
            console.log('🔄 General fund update detected');
            const changedFundId = (payload.new as any)?.id || (payload.old as any)?.id;
            
            if (payload.eventType === 'DELETE') {
              // Remove deleted fund immediately
              setFunds(prev => prev.filter(f => f.id !== changedFundId));
            } else if (changedFundId) {
              // Try selective update first
              updateSingleFund(changedFundId);
            } else {
              // Fall back to debounced full refetch
              debouncedRefetch();
            }
          }
        );
        
        // Listen to edit history changes with debouncing
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'fund_edit_history'
          },
          () => {
            console.log('📝 Edit history changed - debounced refetch');
            debouncedRefetch();
          }
        );
      }
      
      channel.subscribe();

      return () => {
        window.removeEventListener('funds:refetch' as any, refetchHandler as any);
        window.removeEventListener('funds:apply-overlay' as any, applyOverlayHandler as any);
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
        supabase.removeChannel(channel);
      };
    }

    return () => {
      window.removeEventListener('funds:refetch' as any, refetchHandler as any);
      window.removeEventListener('funds:apply-overlay' as any, applyOverlayHandler as any);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [enableRealTime, subscribeTo, updateSingleFund, debouncedRefetch, fetchFunds]);

  // Memoized filter function
  const filterFunds = useCallback((tags: FundTag[], searchQuery: string) => {
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