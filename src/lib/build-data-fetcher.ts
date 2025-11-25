import { getSupabaseBuildClient } from './supabase-build';
import type { Fund, FundCategory, FundTag } from '../data/types/funds';

/**
 * Fetch all funds from database during build time
 * Ordered by ranking for consistent sitemap generation
 */
export async function fetchAllFundsForBuild(): Promise<Fund[]> {
  const supabase = getSupabaseBuildClient();
  
  console.log('📊 Build: Fetching all funds from database...');
  
  const { data: funds, error } = await supabase
    .from('funds')
    .select('*')
    .order('final_rank', { ascending: true, nullsFirst: false });
    
  if (error) {
    console.error('❌ Build: Failed to fetch funds from database:', error.message);
    throw new Error(`Database fetch failed: ${error.message}`);
  }
  
  console.log(`✅ Build: Fetched ${funds?.length || 0} funds from database`);
  
  // Transform database format to Fund type
  return (funds || []).map(fund => {
    // Determine fund status based on available data
    const fundStatus: 'Open' | 'Closed' | 'Closing Soon' = 'Open'; // Default to Open
    
    // Extract inception year if available
    const established = fund.inception_date 
      ? new Date(fund.inception_date).getFullYear() 
      : new Date().getFullYear();
    
    // Determine term: use lock-up period to estimate, or default to 0 for open-ended
    const term = fund.lock_up_period_months 
      ? Math.ceil(fund.lock_up_period_months / 12) 
      : 0; // 0 indicates open-ended/perpetual
    
    return {
      id: fund.id,
      name: fund.name,
      description: fund.description || '',
      detailedDescription: fund.detailed_description || '',
      managerName: fund.manager_name || '',
      currency: fund.currency || 'EUR',
      minimumInvestment: fund.minimum_investment || 0,
      expectedReturnMin: fund.expected_return_min || 0,
      expectedReturnMax: fund.expected_return_max || 0,
      returnTarget: `${fund.expected_return_min || 0}-${fund.expected_return_max || 0}% p.a.`,
      lockUpPeriodMonths: fund.lock_up_period_months || 0,
      managementFee: fund.management_fee || 0,
      performanceFee: fund.performance_fee || 0,
      subscriptionFee: fund.subscription_fee || undefined,
      redemptionFee: fund.redemption_fee || undefined,
      hurdleRate: fund.hurdle_rate || undefined,
      fundSize: fund.aum || 0,
      inceptionDate: fund.inception_date || undefined,
      riskLevel: fund.risk_level || undefined,
      website: fund.website || undefined,
      websiteUrl: fund.website || undefined,
      category: (fund.category as FundCategory) || 'Mixed',
      tags: (fund.tags || []) as FundTag[],
      geographicAllocation: fund.geographic_allocation as any || undefined,
      team: fund.team_members as any || undefined,
      teamMembers: fund.team_members as any || undefined,
      documents: fund.pdf_documents as any || undefined,
      pdfDocuments: fund.pdf_documents as any || undefined,
      faqs: fund.faqs as any || undefined,
      gvEligible: fund.gv_eligible || false,
      eligibilityBasis: fund.eligibility_basis as any || undefined,
      regulatedBy: fund.regulated_by || '',
      location: fund.location || '',
      cmvmId: fund.cmvm_id || undefined,
      auditor: fund.auditor || undefined,
      custodian: fund.custodian || undefined,
      navFrequency: fund.nav_frequency || undefined,
      pficStatus: fund.pfic_status as any || undefined,
      redemptionTerms: fund.redemption_terms as any || undefined,
      historicalPerformance: fund.historical_performance as any || undefined,
      isVerified: fund.is_verified || false,
      verifiedAt: fund.verified_at || undefined,
      createdAt: fund.created_at,
      updatedAt: fund.updated_at,
      dateModified: fund.updated_at,
      datePublished: fund.created_at,
      lastModifiedBy: fund.last_modified_by || undefined,
      version: fund.version || 1,
      finalRank: fund.final_rank || undefined,
      // Required fields from Fund interface
      term,
      fundStatus,
      established,
    };
  }) as Fund[];
}

/**
 * Fetch all unique categories from database funds
 */
export async function fetchAllCategoriesForBuild(): Promise<FundCategory[]> {
  const funds = await fetchAllFundsForBuild();
  const categoriesSet = new Set<FundCategory>();
  
  funds.forEach(fund => {
    if (fund.category) {
      categoriesSet.add(fund.category);
    }
  });
  
  const categories = Array.from(categoriesSet).sort();
  console.log(`✅ Build: Found ${categories.length} unique categories`);
  
  return categories;
}

/**
 * Fetch all unique tags from database funds
 */
export async function fetchAllTagsForBuild(): Promise<FundTag[]> {
  const funds = await fetchAllFundsForBuild();
  const tagsSet = new Set<FundTag>();
  
  funds.forEach(fund => {
    if (fund.tags && Array.isArray(fund.tags)) {
      fund.tags.forEach(tag => {
        tagsSet.add(tag);
      });
    }
  });
  
  const tags = Array.from(tagsSet).sort();
  console.log(`✅ Build: Found ${tags.length} unique tags`);
  
  return tags;
}

/**
 * Fetch all unique managers from database funds
 */
export async function fetchAllManagersForBuild(): Promise<Array<{ name: string; fundsCount: number }>> {
  const funds = await fetchAllFundsForBuild();
  const managersMap = new Map<string, { name: string; fundsCount: number }>();
  
  funds.forEach(fund => {
    const managerKey = fund.managerName.toLowerCase();
    if (!managersMap.has(managerKey)) {
      managersMap.set(managerKey, {
        name: fund.managerName,
        fundsCount: 0,
      });
    }
    const manager = managersMap.get(managerKey)!;
    manager.fundsCount++;
  });
  
  const managers = Array.from(managersMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  console.log(`✅ Build: Found ${managers.length} unique fund managers`);
  
  return managers;
}

/**
 * Fetch all team members from database during build time
 */
export async function fetchAllTeamMembersForBuild(): Promise<Array<{ id: string; slug: string; name: string; role: string; profile_id: string }>> {
  const supabase = getSupabaseBuildClient();
  
  console.log('📊 Build: Fetching all team members from database...');
  
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select('id, slug, name, role, profile_id')
    .order('name', { ascending: true });
    
  if (error) {
    console.error('❌ Build: Failed to fetch team members from database:', error.message);
    throw new Error(`Database fetch failed: ${error.message}`);
  }
  
  console.log(`✅ Build: Fetched ${teamMembers?.length || 0} team members from database`);
  
  return teamMembers || [];
}

/**
 * Cache for build data to avoid multiple database calls
 * during single build process
 */
let buildDataCache: {
  funds?: Fund[];
  categories?: FundCategory[];
  tags?: FundTag[];
  managers?: Array<{ name: string; fundsCount: number }>;
  teamMembers?: Array<{ id: string; slug: string; name: string; role: string; profile_id: string }>;
} = {};

/**
 * Clear build cache (useful for testing)
 */
export function clearBuildCache() {
  buildDataCache = {};
  console.log('🗑️  Build: Cache cleared');
}

/**
 * Fetch all data with caching for build efficiency
 */
export async function fetchAllBuildDataCached() {
  if (!buildDataCache.funds) {
    buildDataCache.funds = await fetchAllFundsForBuild();
  }
  
  if (!buildDataCache.categories) {
    buildDataCache.categories = await fetchAllCategoriesForBuild();
  }
  
  if (!buildDataCache.tags) {
    buildDataCache.tags = await fetchAllTagsForBuild();
  }
  
  if (!buildDataCache.managers) {
    buildDataCache.managers = await fetchAllManagersForBuild();
  }
  
  if (!buildDataCache.teamMembers) {
    buildDataCache.teamMembers = await fetchAllTeamMembersForBuild();
  }
  
  return buildDataCache;
}
