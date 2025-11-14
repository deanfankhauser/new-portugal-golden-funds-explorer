import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Fund } from '@/data/types/funds';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TeamMembersList from './TeamMembersList';
import InviteTeamMemberForm from './InviteTeamMemberForm';

interface TeamAccessTabProps {
  fund: Fund;
}

const TeamAccessTab: React.FC<TeamAccessTabProps> = ({ fund }) => {
  const queryClient = useQueryClient();
  
  // Refresh team members on mount to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['team-members', fund.managerName] });
  }, [fund.managerName, queryClient]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Team Access</h2>
        <p className="text-muted-foreground mt-1">
          Manage who can access and edit your company's fund profiles on Movingto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Team Members</CardTitle>
          <CardDescription>
            All team members have full access to manage your company's funds, view analytics, and receive lead notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembersList companyName={fund.managerName} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>
            Invite colleagues to help manage your fund profiles. They'll receive an email invitation and have the same access as you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteTeamMemberForm companyName={fund.managerName} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAccessTab;
