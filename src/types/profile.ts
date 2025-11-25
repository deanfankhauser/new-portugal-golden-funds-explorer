export interface Profile {
  id: string;
  user_id: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  
  // Manager fields
  company_name?: string;
  manager_name?: string;
  website?: string;
  description?: string;
  registration_number?: string;
  license_number?: string;
  logo_url?: string;
  assets_under_management?: number;
  founded_year?: number;
  
  // Social media links
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  
  // Manager-level content
  manager_about?: string;
  manager_faqs?: any; // JSONB array
  manager_highlights?: any; // JSONB array
  team_members?: any; // JSONB array (CompanyTeamMember[] after parsing)
  email_notification_preferences?: any; // JSONB object
  
  // Investor fields
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  investment_experience?: string;
  risk_tolerance?: string;
  annual_income_range?: string;
  net_worth_range?: string;
  
  created_at: string;
  updated_at: string;
}

// Helper to determine if profile is a manager
export function isManagerProfile(profile: Profile): boolean {
  return !!(profile.company_name && profile.manager_name);
}

// Helper to determine if profile is an investor
export function isInvestorProfile(profile: Profile): boolean {
  return !!(profile.first_name && profile.last_name);
}

// Get display name from profile
export function getDisplayName(profile: Profile): string {
  if (isManagerProfile(profile)) {
    return `${profile.manager_name} (${profile.company_name})`;
  }
  if (isInvestorProfile(profile)) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  return profile.email.split('@')[0];
}

// Get avatar URL (handles both logo_url and avatar_url)
export function getAvatarUrl(profile: Profile): string | undefined {
  return profile.avatar_url || profile.logo_url;
}
