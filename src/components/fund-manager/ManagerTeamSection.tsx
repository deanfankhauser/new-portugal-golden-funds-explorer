import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedin?: string;
}

interface ManagerTeamSectionProps {
  managerName: string;
  teamMembers: TeamMember[];
}

const ManagerTeamSection: React.FC<ManagerTeamSectionProps> = ({ managerName, teamMembers }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl font-semibold text-foreground">
          Team
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="group bg-card rounded-xl border border-border p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-primary/10 ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all">
                <AvatarImage src={member.photoUrl} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-semibold text-foreground text-xl mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {member.role}
                </p>
              </div>
              
              {member.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {member.bio}
                </p>
              )}
              
              {(member.email || member.linkedin) && (
                <div className="flex gap-4 mt-4 pt-4 border-t border-border/50 w-full justify-center">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTeamSection;
