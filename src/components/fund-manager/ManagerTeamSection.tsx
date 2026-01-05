import React from 'react';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import { Skeleton } from "@/components/ui/skeleton";
import TeamMemberGrid from '../common/TeamMemberGrid';

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

interface SSRTeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  company_name?: string;
}

interface ManagerTeamSectionProps {
  managerName: string;
  teamMembers: TeamMember[];
  initialTeamMembers?: SSRTeamMember[];
}

const ManagerTeamSection: React.FC<ManagerTeamSectionProps> = ({ managerName, teamMembers, initialTeamMembers }) => {
  const { members, loading } = useCompanyTeamMembers(managerName);
  
  // Priority: SSR-provided team members > hook-fetched members > prop team members
  // This ensures static HTML contains links to team member pages for SEO
  const displayMembers = initialTeamMembers && initialTeamMembers.length > 0
    ? initialTeamMembers.map(m => ({
        member_id: m.id,
        slug: m.slug,
        name: m.name,
        role: m.role,
        bio: m.bio,
        photoUrl: m.photo_url,
        linkedinUrl: m.linkedin_url,
      }))
    : members.length > 0 
      ? members.map(m => ({
          ...m,
          linkedinUrl: m.linkedinUrl,
        }))
      : teamMembers.map(m => ({
          ...m,
          linkedinUrl: m.linkedin,
        }));

  // Don't show loading if we have SSR data
  if (!initialTeamMembers && !loading && displayMembers.length === 0) {
    return null;
  }

  // Only show loading skeleton if no SSR data and still loading
  if (!initialTeamMembers && loading) {
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
    <div className="border-t border-border pt-16 pb-16">
      <h2 className="text-3xl font-semibold text-foreground mb-12">
        Team
      </h2>
      
      <TeamMemberGrid 
        members={displayMembers as any[]}
        initialCount={8}
        batchSize={20}
      />
    </div>
  );
};

export default ManagerTeamSection;
