
import React from 'react';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { TeamMember } from '../../data/types/funds';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AuthGate from '../auth/AuthGate';

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-10 shadow-sm">
      {/* Section Header */}
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
        Fund Team
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        {team.length} {team.length === 1 ? 'team member' : 'team members'}
      </p>

      <AuthGate 
        message="Sign in to see full team profiles, bios, and LinkedIn connections"
        height="300px"
      >
        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {team.map((member, index) => (
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
                <h3 className="text-xl font-semibold text-foreground tracking-tight leading-tight">
                  {member.name}
                </h3>
                
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
