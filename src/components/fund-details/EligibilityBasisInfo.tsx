import React, { useState, useEffect } from 'react';
import { Fund } from '../../data/funds';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface EligibilityBasisInfoProps {
  fund: Fund;
}

const EligibilityBasisInfo: React.FC<EligibilityBasisInfoProps> = ({ fund }) => {
  const [currentDate, setCurrentDate] = useState('2025');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }));
  }, []);

  const formatBasisField = (value: any, label: string) => {
    if (value === 'Not provided' || value === undefined || value === null) {
      return `${label}: Not provided`;
    }
    if (typeof value === 'number') {
      return `${label}: ${value}${label.includes('%') ? '%' : label.includes('year') ? ' years' : ''}`;
    }
    return `${label}: ${value}`;
  };

  const eligibilityParts = [];
  
  if (fund.eligibilityBasis) {
    const basis = fund.eligibilityBasis;
    
    // Portugal allocation
    if (basis.portugalAllocation !== undefined) {
      eligibilityParts.push(
        formatBasisField(basis.portugalAllocation, '≥60% Portugal')
      );
    } else {
      eligibilityParts.push('Portugal allocation: Not provided');
    }
    
    // Maturity
    if (basis.maturityYears !== undefined) {
      eligibilityParts.push(
        formatBasisField(basis.maturityYears, '≥5-year maturity')
      );
    } else {
      eligibilityParts.push('Maturity: Not provided');
    }
    
    // Real estate exposure
    if (basis.realEstateExposure !== undefined) {
      eligibilityParts.push(
        `No ${basis.realEstateExposure === 'None' ? 'direct or indirect' : basis.realEstateExposure.toLowerCase()} RE exposure`
      );
    } else {
      eligibilityParts.push('RE exposure: Not provided');
    }
    
    // Manager attestation
    if (basis.managerAttestation !== undefined) {
      eligibilityParts.push(
        basis.managerAttestation ? '(manager attestation on file)' : '(no manager attestation)'
      );
    }
  } else {
    eligibilityParts.push('Eligibility basis: Not provided');
  }

  return (
    <Alert className="bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-sm">
        <strong className="text-amber-700">Eligibility basis (as of {currentDate}):</strong>
        <br />
        {eligibilityParts.join(' / ')}
      </AlertDescription>
    </Alert>
  );
};

export default EligibilityBasisInfo;