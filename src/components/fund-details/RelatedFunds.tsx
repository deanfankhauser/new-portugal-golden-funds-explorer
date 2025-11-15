
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import { getFundsByCategory } from '../../data/services/categories-service';
import { Button } from '../ui/button';
import { ExternalLink, Building2 } from 'lucide-react';
import { categoryToSlug } from '@/lib/utils';
import { useManagerProfile } from '../../hooks/useManagerProfile';
import { useAllFunds } from '../../hooks/useFundsQuery';

const RelatedFundCard: React.FC<{ fund: Fund }> = ({ fund }) => {
  const managerProfile = useManagerProfile(fund.managerName);

  return (
    <Link 
      to={`/${fund.id}`} 
      onClick={() => window.scrollTo(0, 0)}
      className="group block bg-background border border-border/40 rounded-xl p-5 lg:p-8 transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:translate-y-[-2px] relative overflow-hidden"
    >
      {/* Top accent border on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-xl" />
      
      <h4 className="text-xl font-semibold text-foreground mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
        {fund.name}
      </h4>
      
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-5 line-clamp-2 min-h-[40px]">
        {fund.description}
      </p>
      
      <div className="flex justify-between items-center pb-5 mb-5 border-b border-border">
        <div>
          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Min Investment</span>
          <span className="text-[15px] font-semibold text-foreground">€{fund.minimumInvestment.toLocaleString()}</span>
        </div>
        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
          {fund.category}
        </div>
      </div>

      {/* Manager Section */}
      <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
        {managerProfile?.logo_url ? (
          <img 
            src={managerProfile.logo_url} 
            alt={`${fund.managerName} logo`}
            className="w-5 h-5 rounded object-cover border border-border/40"
          />
        ) : (
          <Building2 className="h-4 w-4 text-accent" strokeWidth={2} />
        )}
        <span className="font-medium">{fund.managerName}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-transparent border border-border/50 rounded-lg text-sm font-semibold text-muted-foreground group-hover:bg-muted/20 group-hover:border-border group-hover:text-foreground transition-all">
        View Details
        <ExternalLink className="h-4 w-4" strokeWidth={2} />
      </div>
    </Link>
  );
};

interface RelatedFundsProps {
  currentFund: Fund;
}

const RelatedFunds: React.FC<RelatedFundsProps> = ({ currentFund }) => {
  const { data: allFundsData } = useAllFunds();
  const allDatabaseFunds = allFundsData || [];
  
  // Get funds from the same category
  const sameCategoryFunds = getFundsByCategory(allDatabaseFunds, currentFund.category)
    .filter(fund => fund.id !== currentFund.id)
    .slice(0, 3);

  // Get funds with similar minimum investment
  const similarInvestmentFunds = allDatabaseFunds
    .filter(fund => 
      fund.id !== currentFund.id &&
      Math.abs(fund.minimumInvestment - currentFund.minimumInvestment) <= 100000
    )
    .slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Same Category Funds */}
      {sameCategoryFunds.length > 0 && (
        <section className="bg-background rounded-xl border border-border/40 p-6 lg:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-6">
            More {currentFund.category} Funds
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4">
            {sameCategoryFunds.map(fund => (
              <RelatedFundCard key={fund.id} fund={fund} />
            ))}
          </div>
          
          <div className="text-center pt-2">
            <Link to={`/categories/${categoryToSlug(currentFund.category)}`}>
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium h-11">
                View All {currentFund.category} Funds →
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Similar Investment Amount Funds */}
      {similarInvestmentFunds.length > 0 && (
        <section className="bg-background rounded-xl border border-border/40 p-6 lg:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-6">
            Similar Investment Range
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {similarInvestmentFunds.map(fund => (
              <RelatedFundCard key={fund.id} fund={fund} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RelatedFunds;
