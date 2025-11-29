import React from 'react';
import { Fund } from '@/data/types/funds';
import CategoryBadge from './CategoryBadge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ComparisonFundCardsProps {
  fund1: Fund;
  fund2: Fund;
}

const ComparisonFundCards: React.FC<ComparisonFundCardsProps> = ({ fund1, fund2 }) => {
  const FundCard = ({ fund, align }: { fund: Fund; align: 'left' | 'right' }) => {
    const isVerified = fund.isVerified || false;
    
    return (
      <div className={`bg-card rounded-2xl p-7 border border-border shadow-sm ${align === 'left' ? 'text-right' : 'text-left'}`}>
        <div className={`mb-4 ${align === 'left' ? 'flex justify-end' : ''}`}>
          <CategoryBadge category={fund.category || 'Other'} />
        </div>
        
        <h2 className="text-[22px] font-semibold text-foreground mb-1.5 tracking-tight">
          {fund.name}
        </h2>
        
        <p className="text-sm text-muted-foreground mb-4">
          Managed by {fund.managerName || 'N/A'}
        </p>
        
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
          isVerified 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
        }`}>
          {isVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Partner
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              Unverified
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] gap-0 items-center mb-12">
      <FundCard fund={fund1} align="left" />
      
      <div className="flex items-center justify-center my-4 md:my-0">
        <div className="w-12 h-12 bg-card rounded-xl border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground shadow-sm">
          VS
        </div>
      </div>
      
      <FundCard fund={fund2} align="right" />
    </div>
  );
};

export default ComparisonFundCards;
