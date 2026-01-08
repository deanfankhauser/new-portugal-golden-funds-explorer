import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TeamMember, FundTeamMemberWithDetails } from '@/types/team';
import { transformFund } from './useFundsQuery';

// Fetch single team member by slug with company info and funds
export function useTeamMemberBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['team-member', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');

      // Fetch team member with profile (company) data
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:profile_id (
            id,
            company_name,
            manager_name,
            logo_url
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!teamMember) throw new Error('Team member not found');

      // Fetch funds this team member is assigned to
      const { data: fundAssignments, error: fundsError } = await supabase
        .from('fund_team_members')
        .select(`
          fund_role,
          funds:fund_id (*)
        `)
        .eq('team_member_id', teamMember.id);

      if (fundsError) throw fundsError;

      // Transform fund data to match Fund type
      const transformedFunds = fundAssignments?.map(a => 
        transformFund({ fund: a.funds })
      ) || [];

      return {
        ...teamMember,
        funds: transformedFunds
      };
    },
    enabled: !!slug
  });
}

// Fetch all team members for a company profile
export function useCompanyTeamMembers(profileId: string | undefined) {
  return useQuery({
    queryKey: ['company-team-members', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error('Profile ID is required');

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
    enabled: !!profileId
  });
}

// Fetch team members assigned to a specific fund
export function useFundTeamMembers(fundId: string | undefined) {
  return useQuery({
    queryKey: ['fund-team-members', fundId],
    queryFn: async () => {
      if (!fundId) throw new Error('Fund ID is required');

      const { data, error } = await supabase
        .from('fund_team_members')
        .select(`
          *,
          team_member:team_member_id (
            id,
            name,
            role,
            slug,
            bio,
            photo_url,
            linkedin_url,
            email,
            location,
            languages,
            team_since,
            education,
            certifications
          )
        `)
        .eq('fund_id', fundId);

      if (error) throw error;
      return data as FundTeamMemberWithDetails[];
    },
    enabled: !!fundId
  });
}
