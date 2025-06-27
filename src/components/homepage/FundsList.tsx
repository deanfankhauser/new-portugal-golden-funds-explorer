
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
    <div className="space-y-8">
      {filteredFunds.map((fund, index) => (
        <div key={fund.id} className="relative group">
          <div className="card-modern transition-all duration-500 ease-out 
                          hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
                          bg-gradient-to-br from-white to-gray-50/50
                          border border-gray-200/80 hover:border-gray-300/80
                          backdrop-blur-sm overflow-hidden"
               style={{ animationDelay: `${index * 0.1}s` }}>
            
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/2 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Fund content */}
            <div className="relative z-10">
              <FundListItem fund={fund} />
            </div>

            {/* Enhanced hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 
                            opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500 pointer-events-none"></div>
          </div>
          
          {/* Enhanced CTA placement with improved spacing and visual appeal */}
          {!isAuthenticated && (index + 1) % 4 === 0 && index < filteredFunds.length - 1 && (
            <div className="my-16 relative">
              {/* Background glow effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 
                              rounded-3xl blur-3xl opacity-60 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 
                              rounded-3xl blur-2xl"></div>
              
              {/* CTA container */}
              <div className="relative bg-gradient-to-br from-white via-white to-gray-50/80 
                              rounded-3xl p-8 sm:p-10 border-2 border-gray-200/60 
                              shadow-xl hover:shadow-2xl transition-all duration-500 
                              hover:scale-[1.02] backdrop-blur-sm">
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
