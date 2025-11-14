import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  user_id: string;
  profile_id: string;
  email: string;
  display_name: string;
  assigned_at: string;
  assigned_by: string | null;
  status: string;
  permissions: {
    can_edit_profile: boolean;
    can_edit_funds: boolean;
    can_manage_team: boolean;
    can_view_analytics: boolean;
  };
}

export function useTeamMembers(companyName: string | undefined) {
  return useQuery({
    queryKey: ['team-members', companyName],
    queryFn: async () => {
      if (!companyName) return [];

      // Get the profile ID for this company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('company_name', companyName)
        .single();

      if (profileError) throw profileError;

      // Get all active team members for this profile
      const { data, error } = await supabase
        .from('manager_profile_assignments')
        .select(`
          id,
          user_id,
          profile_id,
          assigned_at,
          assigned_by,
          status,
          permissions
        `)
        .eq('profile_id', profile.id)
        .eq('status', 'active')
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      // Get user details for each team member
      const userIds = data.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name, manager_name, company_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Merge the data
      const teamMembers: TeamMember[] = data.map(member => {
        const userProfile = profiles?.find(p => p.user_id === member.user_id);
        const displayName = userProfile?.manager_name || 
                           `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 
                           userProfile?.email?.split('@')[0] || 
                           'Unknown';

        return {
          ...member,
          email: userProfile?.email || '',
          display_name: displayName,
          permissions: member.permissions as TeamMember['permissions'],
        };
      });

      return teamMembers;
    },
    enabled: !!companyName,
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      companyName,
      inviteeEmail,
      personalMessage,
    }: {
      companyName: string;
      inviteeEmail: string;
      personalMessage?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('invite-team-member', {
        body: {
          companyName,
          inviteeEmail,
          inviterUserId: user.id,
          personalMessage,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', variables.companyName] });
      
      if (data.userExists) {
        toast({
          title: 'Team member added',
          description: `${variables.inviteeEmail} has been added to your team and notified via email.`,
        });
      } else {
        toast({
          title: 'Invitation sent',
          description: `An invitation email has been sent to ${variables.inviteeEmail}.`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to invite team member:', error);
      toast({
        title: 'Failed to invite team member',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
}

export function useBulkInviteTeamMembers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      companyName,
      emails,
      personalMessage,
    }: {
      companyName: string;
      emails: string[];
      personalMessage?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('bulk-invite-team-members', {
        body: {
          companyName,
          emails,
          inviterUserId: user.id,
          personalMessage,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', variables.companyName] });
      
      const { successful, failed, total } = data;
      
      if (failed === 0) {
        toast({
          title: 'All invitations sent',
          description: `Successfully sent ${successful} invitation${successful !== 1 ? 's' : ''}.`,
        });
      } else if (successful > 0) {
        toast({
          title: 'Invitations partially sent',
          description: `${successful} succeeded, ${failed} failed out of ${total} total.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'All invitations failed',
          description: `Failed to send ${total} invitation${total !== 1 ? 's' : ''}. Please try again.`,
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to send bulk invitations:', error);
      toast({
        title: 'Bulk invitation failed',
        description: error.message || 'Failed to send invitations. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      profileId,
      userIdToRemove,
      companyName,
    }: {
      profileId: string;
      userIdToRemove: string;
      companyName: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('remove-team-member', {
        body: {
          profileId,
          userIdToRemove,
          requesterUserId: user.id,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-members', variables.companyName] });
      
      toast({
        title: 'Team member removed',
        description: 'The team member has been removed from your company.',
      });
    },
    onError: (error: any) => {
      console.error('Failed to remove team member:', error);
      toast({
        title: 'Failed to remove team member',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
}
