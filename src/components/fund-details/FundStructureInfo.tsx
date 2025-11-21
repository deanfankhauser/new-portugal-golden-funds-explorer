
import React from 'react';
import { Fund } from '../../data/types/funds';
import { getFundType } from '../../utils/fundTypeUtils';

interface FundStructureInfoProps {
  fund: Fund;
}

const FundStructureInfo: React.FC<FundStructureInfoProps> = ({ fund }) => {
  // Helper function to get structure description based on fund characteristics
  const getFundStructureDescription = () => {
    const fundType = getFundType(fund);
    const isOpenEnded = fundType === 'Open-Ended';
    
    if (fund.redemptionTerms?.frequency === 'Monthly' && isOpenEnded) {
      return "(Flexible, with monthly subscriptions & redemptions)";
    }
    if (fund.redemptionTerms?.frequency === 'Daily' && isOpenEnded) {
    if (fund.tags.includes('No Lock-Up')) {
      return "(Open-ended, with daily liquidity; no lock-up)";
    }
      return "(Open-ended, with daily liquidity)";
    }
    if (fund.redemptionTerms?.minimumHoldingPeriod) {
      const lockupYears = Math.floor(fund.redemptionTerms.minimumHoldingPeriod / 12);
      const lockupMonths = fund.redemptionTerms.minimumHoldingPeriod % 12;
      const lockupText = lockupYears > 0 
        ? `${lockupYears} ${lockupYears === 1 ? 'year' : 'years'}${lockupMonths > 0 ? ` ${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}` : ''}`
        : `${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}`;
      return `(Open-ended with ${lockupText} lock-up)`;
    }
    if (!isOpenEnded) {
      return "(Closed-ended, fixed term investment)";
    }
    return "";
  };

  const structureDescription = getFundStructureDescription();
  
  if (!structureDescription) {
    return null;
  }
  
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
      <span className="font-medium">{structureDescription}</span>
    </div>
  );
};

export default FundStructureInfo;
