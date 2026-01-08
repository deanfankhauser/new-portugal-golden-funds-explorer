import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '@/data/types/funds';
import { CompanyLogo } from '@/components/shared/CompanyLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ShieldCheck, ExternalLink } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonFundHeaderProps {
  funds: Fund[];
  maxFunds?: number;
}

const ComparisonFundHeader: React.FC<ComparisonFundHeaderProps> = ({ 
  funds, 
  maxFunds = 3 
}) => {
  const { removeFromComparison } = useComparison();

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Venture Capital': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      'Private Equity': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Crypto': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Bitcoin': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'Clean Energy': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Infrastructure': 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300',
      'Debt': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'Credit': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'Fund-of-Funds': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="mb-6">
      <div className={`grid gap-4 ${
        funds.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
      }`}>
        {funds.map((fund) => (
          <div 
            key={fund.id} 
            className="relative bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFromComparison(fund.id)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label={`Remove ${fund.name} from comparison`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Fund content */}
            <div className="flex items-start gap-4">
              <CompanyLogo managerName={fund.managerName} size="md" />
              
              <div className="flex-1 min-w-0 pr-6">
                <Link 
                  to={`/${fund.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm"
                >
                  {fund.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {fund.managerName}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(fund.category)}`}>
                    {fund.category}
                  </span>
                  
                  {fund.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gold-verified/10 text-gold-verified">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                <Link to={`/${fund.id}`}>
                  View Details
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        ))}

        {/* Add more slot */}
        {funds.length < maxFunds && (
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Add Another Fund</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Compare up to {maxFunds} funds
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ComparisonFundHeader;
