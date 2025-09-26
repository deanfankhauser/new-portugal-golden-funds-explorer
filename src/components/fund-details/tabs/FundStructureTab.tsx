
import React from 'react';
import { Fund } from '../../../data/funds';
import FundCategory from '../FundCategory';
import FeeStructure from '../FeeStructure';
import GeographicAllocation from '../GeographicAllocation';
import RedemptionTerms from '../RedemptionTerms';
import KeyTermsTable from '../KeyTermsTable';
import RiskAssessmentSection from '../RiskAssessmentSection';
import RegulatoryComplianceInfo from '../RegulatoryComplianceInfo';
import { formatPercentage } from '../utils/formatters';

interface FundStructureTabProps {
  fund: Fund;
}

const FundStructureTab: React.FC<FundStructureTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Key Terms Section */}
      <KeyTermsTable fund={fund} />
      
      {/* Risk Assessment Section */}
      <RiskAssessmentSection fund={fund} />
      
      {/* Fund Category and Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Fund Category Section */}
          <FundCategory category={fund.category} />

          {/* Fee Structure Section */}
          <FeeStructure fund={fund} formatPercentage={formatPercentage} />
          
          {/* Redemption Terms Section */}
          <RedemptionTerms redemptionTerms={fund.redemptionTerms} />
        </div>

        <div className="space-y-8">
          {/* Geographic Allocation Section */}
          <GeographicAllocation 
            allocations={fund.geographicAllocation} 
            formatPercentage={formatPercentage} 
          />
        </div>
      </div>
      
      {/* Regulatory Compliance Information */}
      <RegulatoryComplianceInfo fund={fund} />
    </div>
  );
};

export default FundStructureTab;
