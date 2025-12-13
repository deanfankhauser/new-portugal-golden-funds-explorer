
import React from 'react';
import { Fund } from '../../../data/types/funds';
import FundDescription from '../FundDescription';
import FundManager from '../FundManager';
import FundWebsite from '../FundWebsite';
import IntroductionButton from '../IntroductionButton';
import RegulatoryIdentifiers from '../RegulatoryIdentifiers';

interface FundOverviewTabProps {
  fund: Fund;
}

const FundOverviewTab: React.FC<FundOverviewTabProps> = ({ fund }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Fund Description */}
      <FundDescription description={fund.detailedDescription} />
      
      {/* Regulatory Identifiers */}
      <RegulatoryIdentifiers fund={fund} />
      
      {/* Fund Manager Section */}
      <FundManager 
        managerName={fund.managerName} 
      />
      
      {/* Fund Website */}
      <FundWebsite websiteUrl={fund.websiteUrl} />
      
      {/* Introduction Button (compact version in overview) */}
      <IntroductionButton variant="compact" fundId={fund.id} />
    </div>
  );
};

export default FundOverviewTab;
