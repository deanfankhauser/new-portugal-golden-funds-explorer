
import React from 'react';
import { Fund } from '../../data/types/funds';
import { formatFundSize } from '../../utils/fundSizeFormatters';

interface FundSizeFormatterProps {
  fund: Fund;
}

const FundSizeFormatter: React.FC<FundSizeFormatterProps> = ({ fund }) => {
  return <>{formatFundSize(fund.fundSize)}</>;
};

export default FundSizeFormatter;
