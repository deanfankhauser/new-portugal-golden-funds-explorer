
import React from 'react';
import { Users } from 'lucide-react';
import { TeamMember } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Users className="w-5 h-5 mr-2 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Investment Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.name} className="bg-muted/50 p-5 rounded-lg hover:shadow-md transition-all duration-300 border border-border">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-accent mb-1 font-medium">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSection;
