import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Fund } from '@/data/types/funds';
import { addTagsToFunds } from '@/data/services/funds-service';

const transformFund = (fund: any): Fund => {
  return {
    id: fund.id,
    name: fund.name,
    description: fund.description || '',
    detailedDescription: fund.detailed_description || '',
    managerName: fund.manager_name || '',
    minimumInvestment: Number(fund.minimum_investment) || 0,
    fundSize: fund.aum ? Number(fund.aum) : null, // Store in base EUR, null if not available
    managementFee: fund.management_fee != null ? Number(fund.management_fee) : null,
    performanceFee: fund.performance_fee != null ? Number(fund.performance_fee) : null,
    term: Math.round((fund.lock_up_period_months || 0) / 12) || 5,
    returnTarget: `${fund.expected_return_min || 0}–${fund.expected_return_max || 0}% annually`,
    expectedReturnMin: fund.expected_return_min || undefined,
    expectedReturnMax: fund.expected_return_max || undefined,
    fundStatus: 'Open' as const,
    established: fund.inception_date ? new Date(fund.inception_date).getFullYear() : new Date().getFullYear(),
    regulatedBy: fund.regulated_by || undefined,
    location: fund.location || undefined,
    tags: (fund.tags || []),
    category: (fund.category || 'Other'),
    websiteUrl: fund.website || undefined,
    isVerified: fund.is_verified || false,
    isQuizEligible: fund.is_quiz_eligible || false,
    usCompliant: fund.us_compliant || false,
    pficStatus: fund.pfic_status || undefined,
    redemptionTerms: (() => {
      const rt = fund.redemption_terms;
      if (rt && typeof rt === 'object' && !Array.isArray(rt)) {
        const rtObj = rt as Record<string, any>;
        return {
          frequency: rtObj.frequency || 'End of Term',
          redemptionOpen: Boolean(rtObj.redemptionOpen ?? rtObj.redemption_open ?? true),
          noticePeriod: rtObj.noticePeriod ?? rtObj.notice_period,
          earlyRedemptionFee: rtObj.earlyRedemptionFee ?? rtObj.early_redemption_fee,
          minimumHoldingPeriod: rtObj.minimumHoldingPeriod ?? rtObj.minimum_holding_period,
          notes: rtObj.notes
        };
      }
      return undefined;
    })(),
  };
};

export const useQEFEligibleFunds = () => {
  return useQuery({
    queryKey: ['qef-eligible-funds'],
    queryFn: async () => {
      console.log('🔍 Fetching QEF-eligible funds...');
      
      const { data, error } = await supabase
        .from('funds')
        .select('*')
        .not('pfic_status', 'is', null)
        .order('is_verified', { ascending: false })
        .order('name');

      if (error) {
        console.error('❌ QEF funds query error:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} QEF-eligible funds`);

      const transformedFunds: Fund[] = (data || []).map(transformFund);
      const fundsWithTags = addTagsToFunds(transformedFunds);

      return fundsWithTags;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
