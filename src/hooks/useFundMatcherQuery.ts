import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Fund } from '@/data/types/funds';
import { addTagsToFunds } from '@/data/services/funds-service';

export interface QuizAnswers {
  budget?: 'under250k' | 'under500k' | '500k+';
  strategy?: 'safety' | 'growth' | 'fast_exit';
  income?: 'yes' | 'no';
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  timeline?: '1-3years' | '3-5years' | '5plus';
}

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

export const useFundMatcherQuery = (answers: QuizAnswers) => {
  return useQuery({
    queryKey: ['fund-matcher', answers],
    queryFn: async () => {
      console.log('🔍 Building quiz query with answers:', answers);
      
      // Start with base query - ALWAYS filter for quiz-eligible funds
      let query = supabase
        .from('funds')
        .select('*')
        .eq('is_quiz_eligible', true);

      // Apply budget filter
      if (answers.budget === 'under250k') {
        query = query.lte('minimum_investment', 250000);
      } else if (answers.budget === 'under500k') {
        query = query.lte('minimum_investment', 500000);
      }
      // For '500k+', no filter needed

      // Apply strategy filter (category-based)
      if (answers.strategy === 'safety') {
        // Safety: Debt, Infrastructure, Clean Energy
        query = query.in('category', ['Debt', 'Infrastructure', 'Clean Energy']);
      } else if (answers.strategy === 'growth') {
        // Growth: Private Equity, Venture Capital, Crypto
        query = query.in('category', ['Private Equity', 'Venture Capital', 'Crypto']);
      } else if (answers.strategy === 'fast_exit') {
        // Fast Exit: Lock-up <= 6 years (72 months)
        query = query.lte('lock_up_period_months', 72);
      }

      // Apply timeline filter (lock-up period based)
      if (answers.timeline === '1-3years') {
        query = query.lte('lock_up_period_months', 36);
      } else if (answers.timeline === '3-5years') {
        query = query.gte('lock_up_period_months', 37).lte('lock_up_period_months', 60);
      } else if (answers.timeline === '5plus') {
        query = query.gt('lock_up_period_months', 60);
      }

      console.log('📊 Executing quiz query...');
      const { data, error } = await query.order('is_verified', { ascending: false });

      if (error) {
        console.error('❌ Quiz query error:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} matching funds`);

      // Transform funds
      const transformedFunds: Fund[] = (data || []).map(transformFund);
      
      // Apply tag generation
      const fundsWithTags = addTagsToFunds(transformedFunds);

      console.log('📊 Funds before income filter:', fundsWithTags.length);
      console.log('📊 Income answer:', answers.income);

      // Apply income filter client-side (JSONB redemption_terms filtering)
      let filteredFunds = fundsWithTags;
      if (answers.income === 'yes') {
        console.log('📊 Funds with distribution frequency:', fundsWithTags.filter(f => f.redemptionTerms?.frequency).length);
        filteredFunds = fundsWithTags.filter(fund => {
          const freq = fund.redemptionTerms?.frequency;
          return freq && ['Annual', 'Quarterly', 'Weekly', 'Daily', 'Monthly'].includes(freq);
        });
      }

      // Apply risk tolerance as soft preference (sort by risk-appropriate categories)
      if (answers.riskTolerance === 'conservative') {
        // Sort safer categories to top: Debt, Infrastructure, Clean Energy
        filteredFunds.sort((a, b) => {
          const safeCategories = ['Debt', 'Infrastructure', 'Clean Energy'];
          const aIsSafe = safeCategories.includes(a.category) ? 1 : 0;
          const bIsSafe = safeCategories.includes(b.category) ? 1 : 0;
          return bIsSafe - aIsSafe;
        });
      } else if (answers.riskTolerance === 'aggressive') {
        // Sort growth categories to top: Crypto, Venture Capital, Private Equity
        filteredFunds.sort((a, b) => {
          const growthCategories = ['Crypto', 'Venture Capital', 'Private Equity'];
          const aIsGrowth = growthCategories.includes(a.category) ? 1 : 0;
          const bIsGrowth = growthCategories.includes(b.category) ? 1 : 0;
          return bIsGrowth - aIsGrowth;
        });
      }
      // Moderate = no special sorting, show balanced mix

      console.log('📊 Final filtered count:', filteredFunds.length);
      return filteredFunds;
    },
    enabled: Object.keys(answers).length === 5, // Only run when all answers provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
