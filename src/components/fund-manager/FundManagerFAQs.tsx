import React from 'react';
import { Fund } from '../../data/types/funds';
import { getFundType } from '../../utils/fundTypeUtils';
import UniversalFAQ, { FAQItem } from '@/components/ui/UniversalFAQ';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface FundManagerFAQsProps {
  fund: Fund;
}

const FundManagerFAQs: React.FC<FundManagerFAQsProps> = ({ fund }) => {
  const generateFAQs = (fund: Fund): FAQItem[] => {
    return [
      {
        question: `What is the minimum investment amount for ${fund.name}?`,
        answer: `The minimum investment for ${fund.name} is €${fund.minimumInvestment.toLocaleString()}. This amount qualifies for Portugal's Golden Visa program when investing in eligible funds.`
      },
      {
        question: `How does ${fund.name} qualify for the Golden Visa program?`,
        answer: `${fund.name} is structured to meet Portugal's Golden Visa requirements for investment funds. By investing the minimum required amount, investors can qualify for Portuguese residency and eventually citizenship.`
      },
      {
        question: `What are the fees associated with ${fund.name}?`,
        answer: `${fund.name} charges a ${fund.managementFee}% annual management fee${fund.performanceFee ? ` and a ${fund.performanceFee}% performance fee` : ''}. ${fund.subscriptionFee ? `There is also a ${fund.subscriptionFee}% subscription fee` : 'There are no subscription fees'}.`
      },
      {
        question: `What is the expected return for ${fund.name}?`,
        answer: `${fund.name} targets ${fund.returnTarget}. However, past performance does not guarantee future results, and all investments carry risk. We recommend consulting with our advisors to understand the risk profile.`
      },
      {
        question: `How long is the investment term for ${fund.name}?`,
        answer: `${fund.name} has a ${getFundType(fund) === 'Open-Ended' ? 'perpetual (open-ended)' : `${fund.term}-year`} investment term. ${fund.redemptionTerms?.frequency ? `Redemptions are available ${fund.redemptionTerms.frequency.toLowerCase()}` : 'Please refer to the fund documentation for specific redemption terms'}.`
      },
      {
        question: `Who regulates ${fund.name} and where is it located?`,
        answer: `${fund.name} is regulated by ${fund.regulatedBy} and is located in ${fund.location}. This ensures compliance with Portuguese and European investment regulations.`
      },
      {
        question: `How can Movingto help me invest in ${fund.name}?`,
        answer: `Movingto's team can provide personalized information on ${fund.name}, help you understand if it fits your Golden Visa strategy, assist with introductions to the fund manager, and provide ongoing support throughout your investment journey.`
      }
    ];
  };

  const faqs = generateFAQs(fund);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h3>
        <Link 
          to={`/${fund.id}`}
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          View full details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      
      <UniversalFAQ 
        faqs={faqs} 
        schemaId="fund-manager-faq"
        variant="compact"
        skipStructuredData={true}
      />
      
      <p className="text-sm text-muted-foreground text-center px-4 sm:px-6 lg:px-8">
        Need more information? Contact our team for personalized assistance.
      </p>
    </div>
  );
};

export default FundManagerFAQs;
