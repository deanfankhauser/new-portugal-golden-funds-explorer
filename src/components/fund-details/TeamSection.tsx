
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
    <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border/50">
        <Users className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl md:text-[28px] font-semibold text-foreground tracking-tight">
          Fund Team
          <span className="text-muted-foreground font-normal ml-1">
            ({team.length} {team.length === 1 ? 'member' : 'members'})
          </span>
        </h2>
      </div>

      <AuthGate 
        message="Sign in to see full team profiles, bios, and LinkedIn connections"
        height="300px"
      >
        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <div 
              key={member.name || index} 
              className="group relative flex gap-5 items-start p-5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-muted/30 hover:translate-x-1"
            >
              {/* Left border accent on hover */}
              <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
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
