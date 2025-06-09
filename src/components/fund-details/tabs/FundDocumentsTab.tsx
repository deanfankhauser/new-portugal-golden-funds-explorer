
import React from 'react';
import { Fund } from '../../../data/funds';
import DocumentsSection from '../DocumentsSection';

interface FundDocumentsTabProps {
  fund: Fund;
}

const FundDocumentsTab: React.FC<FundDocumentsTabProps> = ({ fund }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents & Reports</h2>
      
      {/* Documents Section */}
      <DocumentsSection documents={fund.documents} />
    </div>
  );
};

export default FundDocumentsTab;
