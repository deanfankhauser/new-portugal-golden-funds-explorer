import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompanyProfileSocialMedia {
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  manager_name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

async function fetchCompanyProfileByManagerName(managerName: string | undefined): Promise<CompanyProfile | null> {
  if (!managerName) return null;

  // Try to find the profile by company_name matching manager_name
  // Use fuzzy matching to handle variations like "Lince Capital" vs "Lince Capital, SCR, S.A."
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      user_id,
      company_name,
      manager_name,
      description,
      logo_url,
      website,
      city,
      country,
      linkedin_url,
      twitter_url,
      facebook_url,
      instagram_url,
      youtube_url,
      tiktok_url
    `)
    .not('company_name', 'is', null)
    .not('manager_name', 'is', null);

  if (error || !data) {
    console.error('Error fetching company profiles:', error);
    return null;
  }

  // Find the best match
  const normalizedManagerName = managerName.toLowerCase().trim();
  
  // First try exact match on company_name
  let match = data.find(p => 
    p.company_name?.toLowerCase().trim() === normalizedManagerName
  );

  // If no exact match, try fuzzy matching
  if (!match) {
    match = data.find(p => {
      const companyName = p.company_name?.toLowerCase().trim() || '';
      
      // Manager name starts with company name
      if (normalizedManagerName.startsWith(companyName) || companyName.startsWith(normalizedManagerName)) {
        return true;
      }
      
      // Strip common suffixes and compare
      const stripSuffixes = (name: string) => 
        name.replace(/, scr, s\.a\./i, '')
            .replace(/ scr/i, '')
            .replace(/, s\.a\./i, '')
            .trim();
      
      const strippedManagerName = stripSuffixes(normalizedManagerName);
      const strippedCompanyName = stripSuffixes(companyName);
      
      return strippedManagerName.startsWith(strippedCompanyName) || 
             strippedCompanyName.startsWith(strippedManagerName);
    });
  }

  return match as CompanyProfile || null;
}

export function useCompanyProfile(managerName: string | undefined) {
  return useQuery({
    queryKey: ['companyProfile', managerName],
    queryFn: () => fetchCompanyProfileByManagerName(managerName),
    enabled: !!managerName,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function getCompanySocialMedia(profile: CompanyProfile | null | undefined): CompanyProfileSocialMedia {
  if (!profile) return {};
  
  return {
    linkedin_url: profile.linkedin_url,
    twitter_url: profile.twitter_url,
    facebook_url: profile.facebook_url,
    instagram_url: profile.instagram_url,
    youtube_url: profile.youtube_url,
    tiktok_url: profile.tiktok_url,
  };
}
