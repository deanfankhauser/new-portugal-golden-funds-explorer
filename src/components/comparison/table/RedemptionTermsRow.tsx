
import React from 'react';
import { Fund } from '../../../data/types/funds';
import ComparisonCell from './ComparisonCell';

interface RedemptionTermsRowProps {
  funds: Fund[];
  field: 'frequency' | 'noticePeriod' | 'minimumHoldingPeriod';
  label: string;
  allSame: (values: any[]) => boolean;
  bestType?: 'lowest' | 'highest' | null;
}

const RedemptionTermsRow: React.FC<RedemptionTermsRowProps> = ({ 
  funds, 
  field, 
  label,
  allSame,
  bestType = null
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

  // Calculate best value index if bestType is specified and we have multiple funds
  let bestIndex = -1;
  if (bestType && funds.length > 1 && (field === 'noticePeriod' || field === 'minimumHoldingPeriod')) {
    const numericValues = values.map(v => {
      if (typeof v === 'number') return v;
      if (v === null || v === undefined) return null;
      return null;
    });

    // Only find best if we have at least one valid numeric value
    if (numericValues.some(v => v !== null)) {
      if (bestType === 'lowest') {
        let minValue = Infinity;
        numericValues.forEach((val, idx) => {
          if (val !== null && val < minValue) {
            minValue = val;
            bestIndex = idx;
          }
        });
      }
    }
  }

  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium">{label}</td>
      {funds.map((fund, idx) => (
        <ComparisonCell 
          key={fund.id} 
          value={getDisplayValue(fund)} 
          highlight={highlight}
          isBest={bestIndex === idx}
        />
      ))}
    </tr>
  );
};

export default RedemptionTermsRow;
