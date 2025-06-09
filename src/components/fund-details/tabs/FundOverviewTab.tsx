
import React from 'react';
import { Fund } from '../../../data/funds';
import FundDescription from '../FundDescription';
import FundManager from '../FundManager';
import IntroductionButton from '../IntroductionButton';

interface FundOverviewTabProps {
  fund: Fund;
}

const FundOverviewTab: React.FC<FundOverviewTabProps> = ({ fund }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Fund Overview</h2>
      
      {/* Fund Description */}
      <FundDescription description={fund.detailedDescription} />
      
      {/* Fund Manager Section */}
      <FundManager 
        managerName={fund.managerName} 
        managerLogo={fund.managerLogo} 
      />
      
      {/* Introduction Button (compact version in overview) */}
      <IntroductionButton variant="compact" />
    </div>
  );
};

export default FundOverviewTab;
