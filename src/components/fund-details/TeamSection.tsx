
import React from 'react';
import { Users, Linkedin } from 'lucide-react';
import { TeamMember } from '../../data/funds';

interface TeamSectionProps {
  team?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  if (!team || team.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-5 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-[#EF4444]" />
        <h2 className="text-2xl font-bold">Investment Team</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
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
    </div>
  );
};

export default TeamSection;
