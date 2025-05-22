
import React from 'react';
import { Fund } from '../../../data/funds';
import ComparisonCell from './ComparisonCell';

interface RedemptionTermsRowProps {
  funds: Fund[];
  field: 'frequency' | 'noticePeriod' | 'minimumHoldingPeriod';
  label: string;
  allSame: (values: any[]) => boolean;
}

const RedemptionTermsRow: React.FC<RedemptionTermsRowProps> = ({ 
  funds, 
  field, 
  label,
  allSame 
}) => {
  const getDisplayValue = (fund: Fund) => {
    if (!fund.redemptionTerms) return 'N/A';
    
    if (field === 'frequency') {
      return fund.redemptionTerms.frequency || 'N/A';
    } else if (field === 'noticePeriod') {
      return fund.redemptionTerms.noticePeriod ? 
        `${fund.redemptionTerms.noticePeriod} days` : 
        "None";
    } else if (field === 'minimumHoldingPeriod') {
      return fund.redemptionTerms.minimumHoldingPeriod ? 
        `${fund.redemptionTerms.minimumHoldingPeriod} months` : 
        "None";
    }
    
    return 'N/A';
  };

  const values = funds.map(fund => {
    if (!fund.redemptionTerms) return null;
    return fund.redemptionTerms[field];
  });

  const highlight = funds.length > 1 && allSame(values);

  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium">{label}</td>
      {funds.map(fund => (
        <ComparisonCell 
          key={fund.id} 
          value={getDisplayValue(fund)} 
          highlight={highlight}
        />
      ))}
    </tr>
  );
};

export default RedemptionTermsRow;
