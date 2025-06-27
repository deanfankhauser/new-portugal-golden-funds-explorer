
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
    <div className="space-y-8 stagger-animation">
      {filteredFunds.map((fund, index) => (
        <div key={fund.id} className="relative group" 
             style={{animationDelay: `${index * 0.1}s`}}>
          <div className="card-modern transition-all duration-500 ease-out 
                         hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01]
                         bg-gradient-to-br from-white via-white to-gray-50/30
                         border-2 border-gray-200/50 rounded-3xl overflow-hidden
                         group-hover:border-primary/20">
            {/* Enhanced hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent 
                           to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity 
                           duration-500 pointer-events-none"></div>
            
            <div className="relative z-10">
              <FundListItem fund={fund} />
            </div>
          </div>
          
          {/* Enhanced CTA placement with improved styling */}
          {!isAuthenticated && (index + 1) % 4 === 0 && index < filteredFunds.length - 1 && (
            <div className="my-16 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/15 
                             to-primary/10 rounded-[2rem] blur-3xl scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 
                             to-emerald-500/5 rounded-[2rem] blur-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-white via-white to-gray-50/50 
                             rounded-[2rem] p-8 sm:p-10 border-2 border-gray-200/50 
                             shadow-2xl backdrop-blur-sm hover:shadow-3xl 
                             transition-all duration-500 hover:scale-[1.02]">
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
