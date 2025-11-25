// Database table types (team_members table)
export interface TeamMember {
  id: string;
  profile_id: string;
  slug: string;
  name: string;
  role: string;
  bio?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

// Fund-team member assignment (fund_team_members table)
export interface FundTeamAssignment {
  id: string;
  fund_id: string;
  team_member_id: string;
  fund_role?: string | null;
  assigned_at: string;
}

// Extended type with resolved team member data for display
export interface FundTeamMemberWithDetails extends FundTeamAssignment {
  team_member: TeamMember;
}

// Legacy types for backward compatibility during transition
export interface CompanyTeamMember {
  member_id: string;
  slug: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
}

export interface FundTeamMemberReference {
  member_id: string;
  fund_role?: string;
}

// Slug generator utility
export const teamMemberToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper to generate unique member ID
export const generateMemberId = (): string => {
  return crypto.randomUUID();
};
