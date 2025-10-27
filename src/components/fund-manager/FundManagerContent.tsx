
import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Fund } from '../../data/funds';
import FundListItem from '@/components/FundListItem';
import FundManagerAbout from './FundManagerAbout';
import FundManagerFAQs from './FundManagerFAQs';
import ManagerVerificationBadge from './ManagerVerificationBadge';

interface FundManagerContentProps {
  managerFunds: Fund[];
  managerName: string;
  isManagerVerified?: boolean;
}

const FundManagerContent: React.FC<FundManagerContentProps> = ({ 
  managerFunds, 
  managerName, 
  isManagerVerified = false 
}) => {
  return (
    <>
      <div className="mb-6">
        <ManagerVerificationBadge 
          isVerified={isManagerVerified} 
          funds={managerFunds}
          className="mb-4" 
        />
        <h1 className="text-2xl font-bold">Portugal Golden Visa Investment Funds Managed by {managerName}</h1>
      </div>
      
      <div className="space-y-4 mb-12">
        {managerFunds.map(fund => (
          <FundListItem key={fund.id} fund={fund} />
        ))}
      </div>

      {/* About Section for each fund */}
      <div className="space-y-8 mb-12">
        <div className="flex items-center mb-6">
          <Info className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">About Our Funds</h2>
        </div>
        {managerFunds.map(fund => (
          <FundManagerAbout key={`about-${fund.id}`} fund={fund} />
        ))}
      </div>

      {/* FAQs Section */}
      <div className="space-y-8">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        {managerFunds.map(fund => (
          <FundManagerFAQs key={`faq-${fund.id}`} fund={fund} />
        ))}
      </div>
    </>
  );
};

export default FundManagerContent;
