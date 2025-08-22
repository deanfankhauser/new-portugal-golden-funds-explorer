
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface FundWebsiteProps {
  websiteUrl?: string;
}

const FundWebsite: React.FC<FundWebsiteProps> = ({ websiteUrl }) => {
  if (!websiteUrl) {
    return null;
  }

  return (
    <div className="text-center">
      <Button
        variant="outline"
        onClick={() => window.open(websiteUrl, '_blank', 'noopener,noreferrer')}
      >
        Visit Fund Website
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default FundWebsite;
