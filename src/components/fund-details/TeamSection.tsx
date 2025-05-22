
import React from 'react';
import { Users, Linkedin } from 'lucide-react';
import { TeamMember } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Users className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-2xl font-bold">Investment Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((member, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-[#EF4444] mb-1">{member.position}</p>
                </div>
                {member.linkedinUrl && (
                  <a 
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSection;
