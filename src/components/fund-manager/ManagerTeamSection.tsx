import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
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
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Our Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
            >
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-lg mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-primary font-medium mb-2">
                  {member.role}
                </p>
                
                {member.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {member.bio}
                  </p>
                )}
                
                <div className="flex gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerTeamSection;
