
import React from 'react';
import { Fund } from '../../../data/funds';
import TeamSection from '../TeamSection';

interface FundTeamTabProps {
  fund: Fund;
}

const FundTeamTab: React.FC<FundTeamTabProps> = ({ fund }) => {
  console.log('📊 FundTeamTab received fund:', { 
    id: fund.id, 
    name: fund.name, 
    team: fund.team,
    teamLength: fund.team?.length 
  });
  
  return (
    <div className="animate-fade-in">
      {/* Team Section */}
      <TeamSection team={fund.team} />
    </div>
  );
};

export default FundTeamTab;
