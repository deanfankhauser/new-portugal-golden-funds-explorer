import React from 'react';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import { Skeleton } from "@/components/ui/skeleton";
import TeamMemberCard from '../common/TeamMemberCard';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedin?: string;
  slug?: string;
  member_id?: string;
}

interface ManagerTeamSectionProps {
  managerName: string;
  teamMembers: TeamMember[];
}

const ManagerTeamSection: React.FC<ManagerTeamSectionProps> = ({ managerName, teamMembers }) => {
  // Fetch team members from the new team_members table
  const { members, loading } = useCompanyTeamMembers(managerName);
  
  // Use fetched members (which include slug) or fallback to prop data
  const displayMembers = members.length > 0 ? members : teamMembers;

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-12">
          Team
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/20 rounded-xl p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <Skeleton className="h-[72px] w-[72px] rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-foreground mb-12">
        Team
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayMembers.map((member, index) => (
          <TeamMemberCard
            key={member.member_id || member.slug || member.name || index}
            name={member.name}
            role={member.role}
            bio={member.bio}
            photoUrl={member.photoUrl}
            linkedinUrl={member.linkedin || member.linkedinUrl}
            email={member.email}
            slug={member.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default ManagerTeamSection;
