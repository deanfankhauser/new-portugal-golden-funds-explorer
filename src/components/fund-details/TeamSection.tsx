
import React from 'react';
import { Users } from 'lucide-react';
import { TeamMember } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div key={member.name || index} className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
                <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  {member.photoUrl ? (
                    <AvatarImage 
                      src={member.photoUrl} 
                      alt={`${member.name} profile picture`}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                  <p className="text-sm text-accent font-medium">{member.position}</p>
                </div>
              </div>
              {member.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              )}
              {member.linkedinUrl && (
                <a 
                  href={member.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  LinkedIn Profile →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
