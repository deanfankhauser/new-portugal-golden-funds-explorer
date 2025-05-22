
import React from 'react';

interface FundWebsiteProps {
  websiteUrl?: string;
}

const FundWebsite: React.FC<FundWebsiteProps> = ({ websiteUrl }) => {
  if (!websiteUrl) {
    return null;
  }

  return (
    <div className="text-center mt-8">
      <a 
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#EF4444] hover:bg-[#EF4444]/80 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Visit Fund Website
      </a>
    </div>
  );
};

export default FundWebsite;
