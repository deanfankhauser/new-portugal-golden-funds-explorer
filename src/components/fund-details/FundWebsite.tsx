
import React from 'react';
import { Button } from "@/components/ui/button";

interface FundWebsiteProps {
  websiteUrl?: string;
}

const FundWebsite: React.FC<FundWebsiteProps> = ({ websiteUrl }) => {
  if (!websiteUrl) {
    return null;
  }

  return (
    <div className="text-center mt-8">
      <Button
        variant="default"
        className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white"
        onClick={() => window.open(websiteUrl, '_blank', 'noopener,noreferrer')}
      >
        Visit Fund Website
      </Button>
    </div>
  );
};

export default FundWebsite;
