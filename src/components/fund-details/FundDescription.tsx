
import React from 'react';
import { Fund } from '../../data/funds';

interface FundDescriptionProps {
  description: Fund['detailedDescription'];
}

const FundDescription: React.FC<FundDescriptionProps> = ({ description }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">About the Fund</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default FundDescription;
