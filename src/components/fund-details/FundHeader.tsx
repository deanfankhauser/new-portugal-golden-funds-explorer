
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Fund } from '../../data/funds';

interface FundHeaderProps {
  fund: Fund;
}

const FundHeader: React.FC<FundHeaderProps> = ({ fund }) => {
  return (
    <>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
        <h1 className="text-3xl font-bold mb-0">{fund.name}</h1>
        <Badge 
          className={`
            text-base px-4 py-1
            ${fund.fundStatus === 'Open' ? 'bg-[#EF4444]' : ''} 
            ${fund.fundStatus === 'Closing Soon' ? 'bg-amber-500' : ''}
            ${fund.fundStatus === 'Closed' ? 'bg-red-600' : ''}
          `}
        >
          {fund.fundStatus}
        </Badge>
      </div>

      <p className="text-xl text-gray-700 mb-8">{fund.description}</p>

      <div className="flex flex-wrap mb-8 gap-2">
        {fund.tags.map(tag => (
          <Link 
            key={tag} 
            to={`/tags/${encodeURIComponent(tag)}`}
            className="bg-white hover:bg-[#EF4444] hover:text-white text-[#EF4444] border border-[#EF4444] px-3 py-1 rounded-full transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </>
  );
};

export default FundHeader;
