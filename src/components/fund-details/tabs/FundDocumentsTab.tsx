
import React from 'react';
import { Fund } from '../../../data/funds';
import DocumentsSection from '../DocumentsSection';

interface FundDocumentsTabProps {
  fund: Fund;
}

const FundDocumentsTab: React.FC<FundDocumentsTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in">
      {/* Documents Section */}
      <DocumentsSection documents={fund.documents} />
    </div>
  );
};

export default FundDocumentsTab;
