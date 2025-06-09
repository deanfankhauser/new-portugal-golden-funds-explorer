
import React from 'react';
import { Fund } from '../../../data/funds';
import TeamSection from '../TeamSection';

interface FundTeamTabProps {
  fund: Fund;
}

const FundTeamTab: React.FC<FundTeamTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Information</h2>
      
      {/* Team Section */}
      <TeamSection team={fund.team} />
    </div>
  );
};

export default FundTeamTab;
