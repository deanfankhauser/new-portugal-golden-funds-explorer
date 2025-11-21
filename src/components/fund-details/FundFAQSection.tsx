import React from 'react';
import FAQSection from '../common/FAQSection';
import { Fund } from '../../data/types/funds';

interface FAQItem {
  question: string;
  answer: string;
}

interface FundFAQSectionProps {
  fund: Fund;
}

const FundFAQSection: React.FC<FundFAQSectionProps> = ({ fund }) => {
  // Default FAQs if none provided in fund data
  const defaultFAQs: FAQItem[] = [
    {
      question: `What makes ${fund.name} unique?`,
      answer: `${fund.name} offers a distinctive investment approach with carefully selected strategies designed to achieve optimal returns while managing risk. The fund combines experienced management with rigorous investment processes to deliver value to investors.`
    },
    {
      question: `How is risk managed?`,
      answer: `${fund.name} employs a multi-layered risk management approach designed to protect capital while pursuing growth opportunities. This includes asset diversification, rigorous selection processes, regular portfolio rebalancing, and professional oversight by experienced managers with proven track records.`
    },
    {
      question: `What are the investment requirements?`,
      answer: `The minimum investment for ${fund.name} is ${fund.minimumInvestment ? `€${fund.minimumInvestment.toLocaleString()}` : 'available upon request'}. The fund features ${fund.redemptionTerms?.frequency || 'periodic'} redemptions with ${fund.redemptionTerms?.minimumHoldingPeriod ? `a ${fund.redemptionTerms.minimumHoldingPeriod}-month` : 'a'} lock-up period. ${fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days notice` : 'Advance notice'} is required for redemptions.`
    },
    {
      question: fund.tags?.includes('Golden Visa Eligible') 
        ? `How does the Golden Visa qualification work?`
        : `What are the regulatory requirements?`,
      answer: fund.tags?.includes('Golden Visa Eligible')
        ? `${fund.name} is approved by Portuguese authorities as a Golden Visa qualifying investment. By investing the minimum amount, you become eligible to apply for Portuguese residency through the Golden Visa program. The fund maintains full compliance with CMVM regulations${fund.cmvmId ? ` and is registered under CMVM #${fund.cmvmId}` : ''}. Our team works closely with investors to ensure all documentation meets Golden Visa requirements.`
        : `${fund.name} operates under strict regulatory oversight${fund.regulatedBy ? ` by ${fund.regulatedBy}` : ''}${fund.cmvmId ? ` and is registered with CMVM #${fund.cmvmId}` : ''}. The fund maintains full compliance with all applicable securities regulations and reporting requirements.`
    },
    {
      question: `What are the expected returns?`,
      answer: `${fund.name} ${fund.returnTarget ? `targets ${fund.returnTarget}` : 'aims to deliver competitive returns'}${fund.historicalPerformance ? `, with historical performance demonstrating the fund's ability to achieve its objectives` : ''}. However, past performance is not indicative of future results. The fund's investments carry inherent market risks. Capital is at risk, and investors should carefully consider their investment objectives and risk tolerance.`
    }
  ];

  // Use fund-specific FAQs if available, otherwise use default FAQs
  const activeFAQs = (fund as any).faqs && (fund as any).faqs.length > 0 ? (fund as any).faqs : defaultFAQs;

  return (
    <FAQSection 
      faqs={activeFAQs}
      title="Frequently Asked Questions"
      schemaId="fund-faq"
    />
  );
};

export default FundFAQSection;
