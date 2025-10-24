
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import PremiumCTA from '../cta/PremiumCTA';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';

interface FundsListProps {
  filteredFunds: Fund[];
}

const FundsList: React.FC<FundsListProps> = ({
  filteredFunds
}) => {
  // Add structured data for fund list
  useEffect(() => {
    const listSchema = InvestmentFundStructuredDataService.generateFundListSchema(filteredFunds, "homepage");
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'funds-list-schema';
    script.textContent = JSON.stringify(listSchema, null, 2);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('funds-list-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [filteredFunds]);

  return (
    <div className="space-y-8">
      {filteredFunds.map((fund, index) => (
        <div key={fund.id} className="relative">
          <div className="card-modern transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
            <FundListItem fund={fund} rank={index + 1} />
          </div>
          
          {/* Enhanced CTA placement with better styling */}
          {(index + 1) % 4 === 0 && index < filteredFunds.length - 1 && (
            <div className="my-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-card to-secondary/30 rounded-3xl p-8 border-2 border-border shadow-lg">
                <PremiumCTA variant="full" location={`homepage-after-fund-${index + 1}`} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FundsList;
