
import React from 'react';
import { Fund } from '../../../data/funds';
import TeamSection from '../TeamSection';

interface FundTeamTabProps {
  fund: Fund;
}

const FundTeamTab: React.FC<FundTeamTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in">
      {/* Team Section */}
      <TeamSection team={fund.team} />
    </div>
  );
};

export default FundTeamTab;
