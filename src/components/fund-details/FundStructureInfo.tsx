
import React from 'react';
import { Fund } from '../../data/funds';

interface FundStructureInfoProps {
  fund: Fund;
}

const FundStructureInfo: React.FC<FundStructureInfoProps> = ({ fund }) => {
  // Helper function to get structure description based on fund characteristics
  const getFundStructureDescription = () => {
    if (fund.redemptionTerms?.frequency === 'Monthly' && fund.tags.includes('Open Ended')) {
      return "(Flexible, with monthly subscriptions & redemptions)";
    }
    if (fund.redemptionTerms?.frequency === 'Daily' && fund.tags.includes('Open Ended')) {
      if (fund.tags.includes('No Lock-Up')) {
        return "(Open-ended, with daily liquidity; no lock-up)";
      }
      return "(Open-ended, with daily liquidity)";
    }
    if (fund.tags.includes('Lock-Up') && fund.redemptionTerms?.minimumHoldingPeriod) {
      const lockupYears = Math.floor(fund.redemptionTerms.minimumHoldingPeriod / 12);
      const lockupMonths = fund.redemptionTerms.minimumHoldingPeriod % 12;
      const lockupText = lockupYears > 0 
        ? `${lockupYears} ${lockupYears === 1 ? 'year' : 'years'}${lockupMonths > 0 ? ` ${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}` : ''}`
        : `${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}`;
      return `(Open-ended with ${lockupText} lock-up)`;
    }
    if (fund.tags.includes('Closed Ended')) {
      return "(Closed-ended, fixed term investment)";
    }
    return "";
  };

  const structureDescription = getFundStructureDescription();
  
  if (!structureDescription) {
    return null;
  }
  
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700">
      <span className="font-medium">{structureDescription}</span>
    </div>
  );
};

export default FundStructureInfo;
