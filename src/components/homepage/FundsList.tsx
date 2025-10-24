
import React, { useEffect } from 'react';
import { Fund } from '../../data/funds';
import FundListItem from '../FundListItem';
import PremiumCTA from '../cta/PremiumCTA';
import { InvestmentFundStructuredDataService } from '../../services/investmentFundStructuredDataService';
import { CheckCircle2 } from 'lucide-react';

interface FundsListProps {
  filteredFunds: Fund[];
}

const FundsList: React.FC<FundsListProps> = ({
  filteredFunds
}) => {
  // Separate verified and unverified funds
  const verifiedFunds = filteredFunds.filter(f => f.isVerified);
  const unverifiedFunds = filteredFunds.filter(f => !f.isVerified);

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
      {/* Verified Funds Section */}
      {verifiedFunds.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50/50 rounded-lg border-l-4 border-green-600">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-green-800">
              Verified Funds ({verifiedFunds.length})
            </h2>
          </div>
          
          {verifiedFunds.map((fund, index) => (
            <div key={fund.id} className="relative">
              <div className="card-modern transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
                <FundListItem fund={fund} />
              </div>
              
              {(index + 1) % 4 === 0 && index < verifiedFunds.length - 1 && (
                <div className="my-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-card to-secondary/30 rounded-3xl p-8 border-2 border-border shadow-lg">
                    <PremiumCTA variant="full" location={`homepage-verified-${index + 1}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Unverified Funds Section */}
      {unverifiedFunds.length > 0 && (
        <div className="space-y-6">
          {verifiedFunds.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg border-l-4 border-muted">
              <h2 className="text-xl font-bold text-muted-foreground">
                Other Funds ({unverifiedFunds.length})
              </h2>
            </div>
          )}
          
          {unverifiedFunds.map((fund, index) => (
            <div key={fund.id} className="relative">
              <div className="card-modern transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
                <FundListItem fund={fund} />
              </div>
              
              {(index + 1) % 4 === 0 && index < unverifiedFunds.length - 1 && (
                <div className="my-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-card to-secondary/30 rounded-3xl p-8 border-2 border-border shadow-lg">
                    <PremiumCTA variant="full" location={`homepage-other-${index + 1}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundsList;
