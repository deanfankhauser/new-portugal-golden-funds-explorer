
import React from 'react';
import { Fund } from '../../data/funds';

interface FundManagerProps {
  managerName: Fund['managerName'];
  managerLogo?: Fund['managerLogo'];
}

const FundManager: React.FC<FundManagerProps> = ({ managerName, managerLogo }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Fund Manager</h2>
      <div className="flex items-center gap-4">
        {managerLogo && (
          <img 
            src={managerLogo} 
            alt={managerName}
            className="w-16 h-16 object-contain"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{managerName}</h3>
        </div>
      </div>
    </div>
  );
};

export default FundManager;
