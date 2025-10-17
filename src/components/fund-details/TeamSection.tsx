
import React from 'react';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { TeamMember } from '../../data/types/funds';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthGate from '../auth/AuthGate';

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-5 w-5" />
          Fund Team ({team.length} {team.length === 1 ? 'member' : 'members'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AuthGate 
          message="Sign in to see full team profiles, bios, and LinkedIn connections"
          height="300px"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div 
                key={member.name || index} 
                className="bg-gradient-to-br from-accent/5 to-accent/10 p-5 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-14 h-14 border-2 border-accent/30">
                      {member.photoUrl ? (
                        <AvatarImage 
                          src={member.photoUrl} 
                          alt={`${member.name} profile picture`}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-accent/20 text-accent text-base font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {member.position}
                      </p>
                    </div>
                  </div>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  )}
                  {member.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1 hover:bg-accent/10"
                      asChild
                    >
                      <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-3 w-3" />
                        View LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AuthGate>
      </CardContent>
    </Card>
  );
};

export default TeamSection;
