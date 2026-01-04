import React, { useMemo } from 'react';
import { TeamMember, FundTeamMemberReference } from '../../data/types/funds';
import AuthGate from '../auth/AuthGate';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import TeamMemberGrid from '../common/TeamMemberGrid';

interface TeamMemberSSR {
  id: string;
  slug: string;
  name: string;
  role: string;
  profile_id: string;
  linkedin_url?: string;
  photo_url?: string;
  bio?: string;
  company_name?: string;
}

interface TeamSectionProps {
  team?: TeamMember[] | FundTeamMemberReference[];
  managerName: string;
  initialTeamMembers?: TeamMemberSSR[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, managerName, initialTeamMembers }) => {
  const trimmedManagerName = managerName?.trim() || '';
  
  const { members: queryTeamMembers, loading } = useCompanyTeamMembers(trimmedManagerName);
  
  const companyTeam = useMemo(() => {
    if (!trimmedManagerName) {
      return [];
    }
    
    if (initialTeamMembers && initialTeamMembers.length > 0) {
      const normalizedManagerName = trimmedManagerName.toLowerCase();
      
      const filtered = initialTeamMembers.filter(m => {
        const companyName = m.company_name?.trim().toLowerCase() || '';
        return companyName === normalizedManagerName ||
               companyName.startsWith(normalizedManagerName) ||
               normalizedManagerName.startsWith(companyName);
      });
      
      if (filtered.length > 0) {
        return filtered.map(m => ({
          member_id: m.id,
          slug: m.slug,
          name: m.name,
          role: m.role,
          bio: m.bio,
          photoUrl: m.photo_url,
          linkedinUrl: m.linkedin_url,
        }));
      }
    }
    return queryTeamMembers;
  }, [initialTeamMembers, queryTeamMembers, trimmedManagerName]);

  const resolvedTeam = useMemo(() => {
    if (companyTeam.length > 0) {
      if (team && team.length > 0) {
        const firstMember = team[0] as any;
        const isReferenceFormat = firstMember?.member_id && !firstMember?.name;
        
        if (isReferenceFormat) {
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
      
      return companyTeam.map(member => ({
        ...member,
        position: member.role,
      }));
    }

    if (!team || team.length === 0) return [];
    return team as TeamMember[];
  }, [team, companyTeam]);

  if (!initialTeamMembers && loading) {
    return null;
  }

  if (!resolvedTeam || resolvedTeam.length === 0) {
    return (
      <div className="bg-card border border-border/40 rounded-2xl p-10 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
          Fund Team
        </h2>
        <p className="text-sm text-muted-foreground">
          Team information coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 md:p-10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
        Fund Team
      </h2>
      <p className="text-sm text-muted-foreground mb-6 md:mb-8">
        {resolvedTeam.length} {resolvedTeam.length === 1 ? 'team member' : 'team members'}
      </p>

      <AuthGate 
        message="Sign in to see full team profiles, bios, and LinkedIn connections"
        height="300px"
      >
        <TeamMemberGrid 
          members={resolvedTeam as any[]}
          initialCount={6}
          batchSize={20}
        />
      </AuthGate>
    </div>
  );
};

export default TeamSection;
