
import React from 'react';
import { Fund } from '../../data/funds';

interface FundSizeFormatterProps {
  fund: Fund;
}

const FundSizeFormatter: React.FC<FundSizeFormatterProps> = ({ fund }) => {
  // Helper function to format target AUM and current AUM
  const formatFundSize = () => {
    // For funds with N/A fund size
    if (fund.fundSize === 0) {
      return "N/A";
    }
    // Default formatting
    return `${fund.fundSize} Million EUR`;
  };

  return <>{formatFundSize()}</>;
};

export default FundSizeFormatter;
