// Shared team member types

export interface CompanyTeamMember {
  member_id: string; // UUID for linking to funds
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
}

export interface FundTeamMemberReference {
  member_id: string; // References CompanyTeamMember
  fund_role?: string; // Optional fund-specific role override
}

// Helper to generate unique member ID
export const generateMemberId = (): string => {
  return crypto.randomUUID();
};
