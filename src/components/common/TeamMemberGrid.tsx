import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TeamMemberCard from './TeamMemberCard';

interface TeamMember {
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  slug?: string | null;
  member_id?: string;
  fund_role?: string | null;
  position?: string;
}

interface TeamMemberGridProps {
  members: TeamMember[];
  initialCount?: number;
  batchSize?: number;
  className?: string;
}

const TeamMemberGrid: React.FC<TeamMemberGridProps> = ({
  members,
  initialCount = 6,
  batchSize = 20,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(initialCount);
  
  const totalCount = members.length;
  const needsExpansion = totalCount > initialCount;
  const needsPagination = totalCount > 30;
  
  // Determine what to show
  const visibleMembers = isExpanded 
    ? members.slice(0, loadedCount)
    : members.slice(0, initialCount);
  
  const remainingCount = totalCount - loadedCount;
  const hasMoreToLoad = isExpanded && loadedCount < totalCount;
  
  const handleLoadMore = useCallback(() => {
    setLoadedCount(prev => Math.min(prev + batchSize, totalCount));
  }, [batchSize, totalCount]);
  
  const handleToggleExpand = useCallback(() => {
    if (!isExpanded) {
      // Expanding - load up to 30 or all if under 30
      setLoadedCount(Math.min(needsPagination ? 30 : totalCount, totalCount));
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded, needsPagination, totalCount]);

  // Small teams - render all directly
  if (!needsExpansion) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 ${className}`}>
        {members.map((member, index) => (
          <div key={member.slug || member.member_id || member.name || index} className="animate-fade-in">
            <TeamMemberCard
              name={member.name}
              role={member.position || member.role}
              bio={member.bio}
              photoUrl={member.photoUrl}
              linkedinUrl={member.linkedinUrl}
              email={member.email}
              slug={member.slug}
              fundRole={member.fund_role}
            />
          </div>
        ))}
      </div>
    );
  }

  // Large teams - use collapsible with lazy loading
  return (
    <div className={className}>
      <Collapsible open={isExpanded} onOpenChange={handleToggleExpand}>
        {/* Initial visible members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {members.slice(0, initialCount).map((member, index) => (
            <div key={member.slug || member.member_id || member.name || index} className="animate-fade-in">
              <TeamMemberCard
                name={member.name}
                role={member.position || member.role}
                bio={member.bio}
                photoUrl={member.photoUrl}
                linkedinUrl={member.linkedinUrl}
                email={member.email}
                slug={member.slug}
                fundRole={member.fund_role}
              />
            </div>
          ))}
        </div>
        
        {/* Expandable content - lazy rendered */}
        <CollapsibleContent className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {visibleMembers.slice(initialCount).map((member, index) => (
              <div 
                key={member.slug || member.member_id || member.name || `expanded-${index}`} 
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <TeamMemberCard
                  name={member.name}
                  role={member.position || member.role}
                  bio={member.bio}
                  photoUrl={member.photoUrl}
                  linkedinUrl={member.linkedinUrl}
                  email={member.email}
                  slug={member.slug}
                  fundRole={member.fund_role}
                />
              </div>
            ))}
          </div>
          
          {/* Load more button for large teams */}
          {hasMoreToLoad && needsPagination && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Load {Math.min(batchSize, remainingCount)} more
                <span className="text-muted-foreground">
                  ({loadedCount} of {totalCount} shown)
                </span>
              </Button>
            </div>
          )}
        </CollapsibleContent>
        
        {/* Toggle button */}
        <div className="flex justify-center mt-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View all {totalCount} team members
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
};

export default TeamMemberGrid;
