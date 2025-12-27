import React from 'react';
import { Fund } from '@/data/types/funds';

interface TotalCostSimulatorProps {
  fund1: Fund;
  fund2: Fund;
}

const TotalCostSimulator: React.FC<TotalCostSimulatorProps> = ({ fund1, fund2 }) => {
  const investmentAmount = 500000; // €500,000
  const years = 6;
  
  // Calculate total costs
  const calculateTotalCost = (fund: Fund): number => {
    const mgmtFee = fund.managementFee || 0;
    const subFee = fund.subscriptionFee || 0;
    
    // Management fee compounded over 6 years + one-time subscription fee
    const mgmtCost = (mgmtFee / 100) * investmentAmount * years;
    const subCost = (subFee / 100) * investmentAmount;
    
    return mgmtCost + subCost;
  };
  
  const cost1 = calculateTotalCost(fund1);
  const cost2 = calculateTotalCost(fund2);
  
  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };
  
  const lowerCostFund = cost1 < cost2 ? 1 : cost1 > cost2 ? 2 : null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-7 mb-8">
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        Estimated Fees on €500,000 Investment
      </h3>
      <p className="text-sm text-muted-foreground mb-5 md:mb-6">
        Management fees over 6 years (excludes performance fees)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div className={`relative p-4 md:p-5 rounded-xl border transition-all ${
          lowerCostFund === 1 
            ? 'bg-gradient-to-br from-success/10 to-emerald-50 border-success/30' 
            : 'bg-muted border-border'
        }`}>
          {lowerCostFund === 1 && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-success text-white text-[9px] md:text-[10px] font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded uppercase tracking-wide">
              Lower Cost
            </div>
          )}
          <div className={`text-xs md:text-[13px] mb-1.5 md:mb-2 pr-16 md:pr-20 truncate ${lowerCostFund === 1 ? 'text-success font-medium' : 'text-muted-foreground'}`}>
            {fund1.name}
          </div>
          <div className={`text-xl md:text-[28px] font-semibold ${lowerCostFund === 1 ? 'text-success' : 'text-foreground'}`}>
            {formatCurrency(cost1)}
          </div>
        </div>
        
        <div className={`relative p-4 md:p-5 rounded-xl border transition-all ${
          lowerCostFund === 2 
            ? 'bg-gradient-to-br from-success/10 to-emerald-50 border-success/30' 
            : 'bg-muted border-border'
        }`}>
          {lowerCostFund === 2 && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-success text-white text-[9px] md:text-[10px] font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded uppercase tracking-wide">
              Lower Cost
            </div>
          )}
          <div className={`text-xs md:text-[13px] mb-1.5 md:mb-2 pr-16 md:pr-20 truncate ${lowerCostFund === 2 ? 'text-success font-medium' : 'text-muted-foreground'}`}>
            {fund2.name}
          </div>
          <div className={`text-xl md:text-[28px] font-semibold ${lowerCostFund === 2 ? 'text-success' : 'text-foreground'}`}>
            {formatCurrency(cost2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCostSimulator;
