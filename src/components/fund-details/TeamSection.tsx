
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { TeamMember, FundTeamMemberReference } from '../../data/types/funds';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AuthGate from '../auth/AuthGate';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import { Badge } from '@/components/ui/badge';

interface TeamSectionProps {
  team?: TeamMember[] | FundTeamMemberReference[];
  managerName: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, managerName }) => {
  const { members: companyTeam, loading } = useCompanyTeamMembers(managerName);

  // Resolve team members: if team contains references, look up from company profile
  const resolvedTeam = useMemo(() => {
    if (!team || team.length === 0) return [];

    // Check if team contains references (has member_id) or legacy format
    const firstMember = team[0] as any;
    const isReferenceFormat = firstMember?.member_id && !firstMember?.name;

    if (isReferenceFormat && companyTeam.length > 0) {
      // Map references to full member data from company profile
      return (team as FundTeamMemberReference[])
        .map(ref => {
          const companyMember = companyTeam.find(m => m.member_id === ref.member_id);
          if (!companyMember) return null;

          return {
            ...companyMember,
            // Use fund-specific role if provided, otherwise use company role
            position: ref.fund_role || companyMember.role,
            fund_role: ref.fund_role, // Keep for badge display
          };
        })
        .filter(Boolean);
    }

    // Legacy format or direct team data
    return team as TeamMember[];
  }, [team, companyTeam]);

  if (!resolvedTeam || resolvedTeam.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading team information...</p>
        </CardContent>
      </Card>
    );
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
            <div 
              key={member.name || index} 
              className="group relative flex gap-4 items-start p-6 bg-muted/20 border border-border/40 rounded-xl transition-all duration-200 hover:bg-muted/30 hover:border-primary/20 hover:shadow-lg"
            >
              {/* Left border accent on hover */}
              <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-[72px] w-[72px] border-2 border-border transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10">
                  {member.photoUrl ? (
                    <AvatarImage 
                      src={member.photoUrl} 
                      alt={`${member.name} profile picture`}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator - shows on hover */}
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-card opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {member.slug ? (
                    <Link 
                      to={`/team/${member.slug}`}
                      className="text-xl font-semibold text-foreground tracking-tight leading-tight hover:text-primary transition-colors"
                    >
                      {member.name}
                    </Link>
                  ) : (
                    <h3 className="text-xl font-semibold text-foreground tracking-tight leading-tight">
                      {member.name}
                    </h3>
                  )}
                  {member.fund_role && (
                    <Badge variant="secondary" className="text-xs">
                      Fund-specific
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5 opacity-50" />
                  {member.position}
                </div>

                {member.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {member.bio}
                  </p>
                )}

                {/* Actions */}
                {member.linkedinUrl && (
                  <div className="pt-3">
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-transparent border border-border/50 rounded-md text-[13px] font-medium text-[#0077b5] hover:bg-[#0077b5]/8 hover:border-[#0077b5]/30 transition-all duration-150"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </AuthGate>
    </div>
  );
};

export default TeamSection;
