
import React from 'react';
import { Fund } from '../../data/funds';
import { formatFundSize } from '../../utils/fundSizeFormatters';

interface FundSizeFormatterProps {
  fund: Fund;
}

const FundSizeFormatter: React.FC<FundSizeFormatterProps> = ({ fund }) => {
  return <>{formatFundSize(fund.fundSize)}</>;
};

export default FundSizeFormatter;
