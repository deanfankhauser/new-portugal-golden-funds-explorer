import React from 'react';
import { Fund } from '../../data/funds';
import { DollarSign, Users, Calendar, Clock, Lock, TrendingUp } from 'lucide-react';

interface KeyFactsChipsProps {
  fund: Fund;
}

const KeyFactsChips: React.FC<KeyFactsChipsProps> = ({ fund }) => {
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(0)}m`;
    }
    if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}k`;
    }
    return `€${amount}`;
  };

  const formatFundSize = (aum: number | undefined): string => {
    if (!aum) return 'N/A';
    if (aum >= 1000000) {
      return `€${(aum / 1000000).toFixed(0)}m`;
    }
    return `€${(aum / 1000).toFixed(0)}k`;
  };

  const isOpenToUS = fund.tags?.some(tag => 
    tag.toLowerCase().includes('us') && !tag.toLowerCase().includes('restrict')
  );

  const redemptionFrequency = fund.redemptionTerms?.frequency || 'N/A';
  const noticePeriod = fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod}-day` : 'N/A';
  const lockUpPeriod = fund.redemptionTerms?.minimumHoldingPeriod ? 
    `${fund.redemptionTerms.minimumHoldingPeriod}-month` : 
    (fund.term ? `${fund.term * 12}-month` : 'None');
  const fundSize = formatFundSize(fund.fundSize);

  const chips = [
    { icon: DollarSign, label: `Min ${formatCurrency(fund.minimumInvestment)}` },
    { icon: Users, label: isOpenToUS ? 'Open to US' : 'Not open to US' },
    { icon: Calendar, label: `${redemptionFrequency} redemptions` },
    { icon: Clock, label: `${noticePeriod} notice` },
    { icon: Lock, label: `${lockUpPeriod} lock-up` },
    { icon: TrendingUp, label: `${fundSize} fund size` },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {chips.map((chip, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white"
        >
          <chip.icon className="h-4 w-4" />
          <span>{chip.label}</span>
        </div>
      ))}
    </div>
  );
};

export default KeyFactsChips;
