import React, { useState } from 'react';
import { useTeamMembers, useRemoveTeamMember } from '@/hooks/useTeamManagement';
import { Loader2, Mail, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface TeamMembersListProps {
  companyName: string;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ companyName }) => {
  const { data: teamMembers, isLoading } = useTeamMembers(companyName);
  const removeMutation = useRemoveTeamMember();
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string; profileId: string; userId: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const handleRemoveClick = (member: any) => {
    setMemberToRemove({
      id: member.id,
      name: member.display_name,
      profileId: member.profile_id,
      userId: member.user_id,
    });
  };

  const handleRemoveConfirm = () => {
    if (memberToRemove) {
      removeMutation.mutate({
        profileId: memberToRemove.profileId,
        userIdToRemove: memberToRemove.userId,
        companyName,
      });
      setMemberToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No team members found. Start by inviting a colleague below.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {teamMembers.map((member) => {
          const isCurrentUser = member.user_id === currentUserId;
          const isLastMember = teamMembers.length === 1;

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.display_name}</p>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{member.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Added {format(new Date(member.assigned_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveClick(member)}
                  disabled={isLastMember || removeMutation.isPending}
                  title={isLastMember ? 'Cannot remove the last team member' : 'Remove team member'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from your team?
              They will immediately lose access to all company funds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamMembersList;
