
import React from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import PremiumCTA from '../cta/PremiumCTA';

interface FundsListProps {
  filteredFunds: Fund[];
  isAuthenticated: boolean;
}

const FundsList: React.FC<FundsListProps> = ({
  filteredFunds,
  isAuthenticated
}) => {
  return (
    <div className="space-y-6">
      {filteredFunds.map((fund, index) => (
        <div key={fund.id}>
          <div className="card-hover-effect">
            <FundListItem fund={fund} />
          </div>
          {/* Strategic CTA placement - every 4th fund for better user journey */}
          {!isAuthenticated && (index + 1) % 4 === 0 && index < filteredFunds.length - 1 && (
            <div className="my-8">
              <PremiumCTA variant="full" location={`homepage-after-fund-${index + 1}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FundsList;
