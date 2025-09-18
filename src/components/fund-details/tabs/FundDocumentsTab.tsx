
import React from 'react';
import { Fund } from '../../../data/funds';
import DocumentsSection from '../DocumentsSection';
import DocumentsDisclosures from '../DocumentsDisclosures';

interface FundDocumentsTabProps {
  fund: Fund;
}

const FundDocumentsTab: React.FC<FundDocumentsTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Documents & Disclosures */}
      <DocumentsDisclosures fund={fund} />
      
      {/* Additional Documents Section */}
      <DocumentsSection documents={fund.documents} />
    </div>
  );
};

export default FundDocumentsTab;
