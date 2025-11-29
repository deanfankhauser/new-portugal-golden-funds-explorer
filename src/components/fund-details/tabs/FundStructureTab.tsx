
import React from 'react';
import { Fund } from '../../../data/types/funds';
import FundCategory from '../FundCategory';
import FeeStructure from '../FeeStructure';
import GeographicAllocation from '../GeographicAllocation';
import RedemptionTerms from '../RedemptionTerms';
import KeyTermsTable from '../KeyTermsTable';
import RegulatoryComplianceInfo from '../RegulatoryComplianceInfo';
import EligibilityBasisInfo from '../EligibilityBasisInfo';
import { formatPercentage } from '../utils/formatters';

interface FundStructureTabProps {
  fund: Fund;
}

const FundStructureTab: React.FC<FundStructureTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Key Terms Section */}
      <KeyTermsTable fund={fund} />
      
      {/* Fund Category Section */}
      <FundCategory category={fund.category} />

      {/* Fee Structure Section */}
      <FeeStructure fund={fund} formatPercentage={formatPercentage} />
      
      {/* Redemption Terms Section */}
      <RedemptionTerms redemptionTerms={fund.redemptionTerms} />

      {/* Geographic Allocation Section */}
      <GeographicAllocation 
        allocations={fund.geographicAllocation} 
        formatPercentage={formatPercentage} 
      />
      
      {/* Regulatory Compliance Information */}
      <RegulatoryComplianceInfo fund={fund} />
      
      {/* Golden Visa Eligibility Basis */}
      {fund.eligibilityBasis && fund.tags?.includes('Golden Visa Eligible') && fund.isVerified && (
        <EligibilityBasisInfo fund={fund} />
      )}
    </div>
  );
};

export default FundStructureTab;
