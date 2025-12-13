
import React, { useMemo } from 'react';
import { TeamMember, FundTeamMemberReference } from '../../data/types/funds';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AuthGate from '../auth/AuthGate';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import TeamMemberCard from '../common/TeamMemberCard';

interface TeamSectionProps {
  team?: TeamMember[] | FundTeamMemberReference[];
  managerName: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, managerName }) => {
  const { members: companyTeam, loading } = useCompanyTeamMembers(managerName);

  // Resolve team members: ALWAYS prefer database data with slugs
  const resolvedTeam = useMemo(() => {
    // Priority 1: Use fetched companyTeam data (has slugs)
    if (companyTeam.length > 0) {
      // If team prop contains references, merge with company data
      if (team && team.length > 0) {
        const firstMember = team[0] as any;
        const isReferenceFormat = firstMember?.member_id && !firstMember?.name;
        
        if (isReferenceFormat) {
          // Map references to full member data
          return (team as FundTeamMemberReference[])
            .map(ref => {
              const companyMember = companyTeam.find(m => m.member_id === ref.member_id);
              if (!companyMember) return null;

              return {
                ...companyMember,
                position: ref.fund_role || companyMember.role,
                fund_role: ref.fund_role,
              };
            })
            .filter(Boolean);
        }
      }
      
      // Return all company team members (best case - has slugs)
      return companyTeam.map(member => ({
        ...member,
        position: member.role,
      }));
    }

    // Fallback: Legacy format without slugs (no links will work)
    if (!team || team.length === 0) return [];
    return team as TeamMember[];
  }, [team, companyTeam]);

  // Don't show placeholder during loading - return null to prevent "Loading..." showing to crawlers
  if (loading) {
    return null;
  }

  if (!resolvedTeam || resolvedTeam.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-10 shadow-sm">
      {/* Section Header */}
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
        Fund Team
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        {resolvedTeam.length} {resolvedTeam.length === 1 ? 'team member' : 'team members'}
      </p>

      <AuthGate 
        message="Sign in to see full team profiles, bios, and LinkedIn connections"
        height="300px"
      >
        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {resolvedTeam.map((member: any, index) => (
            <TeamMemberCard
              key={member.slug || member.name || index}
              name={member.name}
              role={member.position || member.role}
              bio={member.bio}
              photoUrl={member.photoUrl || member.photo_url}
              linkedinUrl={member.linkedinUrl || member.linkedin_url}
              email={member.email}
              slug={member.slug}
              fundRole={member.fund_role}
            />
          ))}
        </div>
      </AuthGate>
    </div>
  );
};

export default TeamSection;
