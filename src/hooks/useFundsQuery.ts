import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
const getSupabase = async () => (await import('../integrations/supabase/client')).supabase;
import { Fund, FundTag, FundCategory, GeographicAllocation, TeamMember, PdfDocument, FAQItem, RedemptionFrequency } from '../data/types/funds';
import { addTagsToFunds } from '../data/services/funds-service';

const FUNDS_PER_PAGE = 30;
const isSSG = typeof window === 'undefined';

interface TransformFundParams {
  fund: any;
  ranking?: number;
}

// Transform database fund to UI Fund type
const transformFund = ({ fund, ranking = 999 }: TransformFundParams): Fund => {
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
};

// Fetch all funds with pagination
const fetchFundsPage = async ({ pageParam = 0 }) => {
  // Skip network calls during SSG
  if (isSSG) {
    return { funds: [], nextPage: undefined, totalCount: 0 };
  }
  
  const from = pageParam * FUNDS_PER_PAGE;
  const to = from + FUNDS_PER_PAGE - 1;
  
  console.log(`📊 Fetching funds page ${pageParam} (${from}-${to})`);
  
  const supabase = await getSupabase();
  const { data, error, count } = await supabase
    .from('funds')
    .select(`
      *,
      fund_rankings (
        manual_rank
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: true })
    .range(from, to);
  
  if (error) {
    console.error('❌ Error fetching funds:', error);
    throw error;
  }
  
  const transformedFunds: Fund[] = (data || []).map(fund => {
    const ranking = Array.isArray(fund.fund_rankings) && fund.fund_rankings.length > 0
      ? fund.fund_rankings[0].manual_rank
      : 999;
    return transformFund({ fund, ranking });
  });
  
  // Apply tag generation logic
  const fundsWithTags = addTagsToFunds(transformedFunds);
  
  // Sort by verification status then rank
  const sortedFunds = fundsWithTags.sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return (a.finalRank ?? 999) - (b.finalRank ?? 999);
  });
  
  return {
    funds: sortedFunds,
    nextPage: data && data.length === FUNDS_PER_PAGE ? pageParam + 1 : undefined,
    totalCount: count || 0
  };
};

// Fetch single fund by ID
const fetchFundById = async (fundId: string): Promise<Fund | null> => {
  // Skip network calls during SSG
  if (isSSG) {
    return null;
  }
  
  console.log('🔍 Fetching single fund:', fundId);
  
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('funds')
    .select(`
      *,
      fund_rankings (
        manual_rank
      )
    `)
    .eq('id', fundId)
    .maybeSingle();
  
  if (error) {
    console.error('❌ Error fetching fund:', error);
    throw error;
  }
  
  if (!data) {
    return null;
  }
  
  const ranking = Array.isArray(data.fund_rankings) && data.fund_rankings.length > 0
    ? data.fund_rankings[0].manual_rank
    : 999;
  
  return transformFund({ fund: data, ranking });
};

// Hook for paginated funds list (homepage)
export const useInfiniteFunds = () => {
  return useInfiniteQuery({
    queryKey: ['funds-infinite'],
    queryFn: fetchFundsPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !isSSG,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for single fund (detail page) - uses React Query cache
export const useFund = (fundId: string | undefined) => {
  return useQuery({
    queryKey: ['fund', fundId],
    queryFn: () => fundId ? fetchFundById(fundId) : Promise.resolve(null),
    enabled: !!fundId && !isSSG,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for all funds at once (for filtering, comparison, etc.)
export const useAllFunds = () => {
  return useQuery({
    queryKey: ['funds-all'],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('funds')
        .select(`
          *,
          fund_rankings (
            manual_rank
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching all funds:', error);
        throw error;
      }
      
      const transformedFunds: Fund[] = (data || []).map(fund => {
        const ranking = Array.isArray(fund.fund_rankings) && fund.fund_rankings.length > 0
          ? fund.fund_rankings[0].manual_rank
          : 999;
        return transformFund({ fund, ranking });
      });
      
      // Apply tag generation logic
      const fundsWithTags = addTagsToFunds(transformedFunds);
      
      return fundsWithTags.sort((a, b) => {
        if (a.isVerified && !b.isVerified) return -1;
        if (!a.isVerified && b.isVerified) return 1;
        return (a.finalRank ?? 999) - (b.finalRank ?? 999);
      });
    },
    enabled: !isSSG,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
