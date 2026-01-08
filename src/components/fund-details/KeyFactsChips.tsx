import React from 'react';
import { Fund } from '../../data/types/funds';
import { DollarSign, Users, Calendar, Clock, Lock, TrendingUp } from 'lucide-react';
import { formatMinimumInvestment, formatFundSize } from '../../utils/currencyFormatters';

interface KeyFactsChipsProps {
  fund: Fund;
}

const KeyFactsChips: React.FC<KeyFactsChipsProps> = ({ fund }) => {
  const isOpenToUS = fund.tags?.some(tag => 
    tag.toLowerCase().includes('us') && !tag.toLowerCase().includes('restrict')
  );

  const redemptionFrequency = fund.redemptionTerms?.frequency || 'N/A';
  const noticePeriod = fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod}-day` : 'N/A';
  const lockUpPeriod = fund.redemptionTerms?.minimumHoldingPeriod ? 
    `${fund.redemptionTerms.minimumHoldingPeriod}-month` : 
    (fund.term ? `${fund.term * 12}-month` : 'None');
  const fundSizeDisplay = formatFundSize(fund.fundSize);

  const chips = [
    { icon: DollarSign, label: `Min ${formatMinimumInvestment(fund.minimumInvestment)}` },
    { icon: Users, label: isOpenToUS ? 'Open to US' : 'Not open to US' },
    { icon: Calendar, label: `${redemptionFrequency} redemptions` },
    { icon: Clock, label: `${noticePeriod} notice` },
    { icon: Lock, label: `${lockUpPeriod} lock-up` },
    { icon: TrendingUp, label: `${fundSizeDisplay} fund size` },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-border rounded-full text-sm"
        >
          <chip.icon className="h-4 w-4" />
          <span>{chip.label}</span>
        </div>
      ))}
    </div>
  );
};

export default KeyFactsChips;
