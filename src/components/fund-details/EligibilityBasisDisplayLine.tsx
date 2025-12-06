import React from 'react';
import { Fund } from '../../data/types/funds';
import { DATA_AS_OF_LABEL } from '../../utils/constants';

interface EligibilityBasisDisplayLineProps {
  fund: Fund;
}

const EligibilityBasisDisplayLine: React.FC<EligibilityBasisDisplayLineProps> = ({ fund }) => {
  if (!fund.eligibilityBasis) {
    return (
      <p className="text-sm text-muted-foreground">
        <strong>Eligibility basis:</strong> Not provided—verify with counsel.
      </p>
    );
  }

  const basis = fund.eligibilityBasis;
  const parts = [];

  // Portugal allocation
  if (basis.portugalAllocation !== 'Not provided' && typeof basis.portugalAllocation === 'number') {
    parts.push(`${basis.portugalAllocation}% Portugal`);
  } else {
    parts.push('Portugal allocation: Not provided');
  }

  // Maturity
  if (basis.maturityYears !== 'Not provided' && typeof basis.maturityYears === 'number') {
    parts.push(`${basis.maturityYears}-year maturity`);
  } else {
    parts.push('Maturity: Not provided');
  }

  // Real estate exposure
  if (basis.realEstateExposure === 'None') {
    parts.push('no direct/indirect real estate exposure');
  } else if (basis.realEstateExposure && basis.realEstateExposure !== 'Not provided') {
    parts.push(`${basis.realEstateExposure.toLowerCase()} RE exposure`);
  } else {
    parts.push('RE exposure: Not provided');
  }

  // Manager attestation
  const attestation = basis.managerAttestation ? '(per manager docs)' : '(no manager attestation)';

  return (
    <p className="text-sm text-muted-foreground">
      <strong>Eligibility basis {DATA_AS_OF_LABEL}:</strong> {parts.join(' / ')} {attestation}; CMVM ID: {fund.cmvmId || 'Not provided'}; NAV: {fund.navFrequency || 'Not provided'}.
    </p>
  );
};

export default EligibilityBasisDisplayLine;