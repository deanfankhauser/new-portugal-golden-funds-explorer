import React from 'react';
import { Fund } from '../../data/types/funds';
import { formatManagementFee, formatPerformanceFee } from '../../utils/feeFormatters';
import { withArticle } from '../../utils/textHelpers';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';

interface FundComparisonFAQProps {
  fund1: Fund;
  fund2: Fund;
}

const formatMinInvestment = (amount: number | null | undefined): string => {
  if (!amount) return 'contact fund manager';
  return `€${amount.toLocaleString()}`;
};

const generateComparisonFAQs = (f1: Fund, f2: Fund): FAQItem[] => {
  const fund1Category = f1.category.toLowerCase();
  const fund2Category = f2.category.toLowerCase();
  const bothSameCategory = f1.category === f2.category;
  
  return [
    {
      question: `What are the key differences between ${f1.name} and ${f2.name}?`,
      answer: `The main differences include investment focus (${f1.category} vs ${f2.category}), minimum investment amounts (${formatMinInvestment(f1.minimumInvestment)} vs ${formatMinInvestment(f2.minimumInvestment)}), management fees (${formatManagementFee(f1.managementFee)} vs ${formatManagementFee(f2.managementFee)}), and fund managers (${f1.managerName} vs ${f2.managerName}). Each fund has different risk profiles and return targets suited to different investor preferences.`
    },
    {
      question: `Which fund has lower fees: ${f1.name} or ${f2.name}?`,
      answer: `${(f1.managementFee || 0) < (f2.managementFee || 0) ? f1.name : f2.name} has the lower management fee at ${formatManagementFee(Math.min(f1.managementFee || 0, f2.managementFee || 0))} compared to ${formatManagementFee(Math.max(f1.managementFee || 0, f2.managementFee || 0))}. However, consider the total cost including performance fees: ${f1.name} charges ${formatPerformanceFee(f1.performanceFee)} performance fee while ${f2.name} charges ${formatPerformanceFee(f2.performanceFee)}. The overall value depends on your investment goals and expected returns.`
    },
    {
      question: `What is the minimum investment required for each fund?`,
      answer: `${f1.name} requires a minimum investment of ${formatMinInvestment(f1.minimumInvestment)}, while ${f2.name} requires ${formatMinInvestment(f2.minimumInvestment)}. Both funds meet the Portugal Golden Visa minimum requirement of €500,000. Choose based on your available capital and diversification strategy.`
    },
    {
      question: `Are both funds marketed for Portugal Golden Visa?`,
      answer: `Both ${f1.name} and ${f2.name} are marketed by their managers as intended for the Portugal Golden Visa program, meeting the minimum €500,000 investment requirement and being properly regulated investment funds. Eligibility must be confirmed with Portuguese legal counsel before investing.`
    },
    {
      question: bothSameCategory 
        ? `Since both funds are in ${f1.category}, how do I choose between them?`
        : `Should I choose ${withArticle(fund1Category)} fund or ${withArticle(fund2Category)} fund?`,
      answer: bothSameCategory 
        ? `Both funds focus on ${fund1Category}, so compare their track records, management teams, fee structures, and specific investment strategies. Consider ${f1.name}'s approach managed by ${f1.managerName} versus ${f2.name}'s strategy under ${f2.managerName}. Review their historical performance, redemption terms, and alignment with your investment timeline.`
        : `The choice between ${fund1Category} (${f1.name}) and ${fund2Category} (${f2.name}) depends on your risk tolerance and investment goals. ${fund1Category.charAt(0).toUpperCase() + fund1Category.slice(1)} investments typically offer different risk-return profiles compared to ${fund2Category}. Consider your portfolio diversification needs and long-term investment strategy.`
    },
    {
      question: `How often can I redeem from these funds?`,
      answer: `Redemption terms vary between funds. ${f1.name} offers ${f1.redemptionTerms?.frequency || 'standard'} redemptions, while ${f2.name} provides ${f2.redemptionTerms?.frequency || 'standard'} redemption opportunities. Check the specific notice periods and any redemption fees that may apply. Consider your liquidity needs when choosing between these options.`
    },
    {
      question: `How is the data in this comparison verified?`,
      answer: `All fund data is regularly verified against official sources including fund prospectuses, regulatory filings, and direct communication with fund managers. Data freshness indicators show when each fund's information was last updated. We recommend reviewing the latest fund documents and speaking with the fund managers before making investment decisions.`
    }
  ];
};

const FundComparisonFAQ: React.FC<FundComparisonFAQProps> = ({ fund1, fund2 }) => {
  const faqs = generateComparisonFAQs(fund1, fund2);

  return (
    <div className="mb-8 md:mb-12">
      <UniversalFAQ
        faqs={faqs}
        title="Frequently Asked Questions"
        schemaId={`comparison-${fund1.id}-${fund2.id}`}
        variant="card-wrapped"
        skipStructuredData={true}
      />
    </div>
  );
};

export default FundComparisonFAQ;
