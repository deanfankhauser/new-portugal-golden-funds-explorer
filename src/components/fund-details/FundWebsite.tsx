
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

  const handleWebsiteClick = () => {
    // Scroll to top before opening external link
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Small delay to allow scroll animation to start, then open link
    setTimeout(() => {
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
    <div className="text-center">
      <Button
        variant="outline"
        className="border-[#EF4444] text-[#EF4444] hover:bg-[#f0f0f0] hover:text-[#EF4444]"
        onClick={handleWebsiteClick}
      >
        Visit Fund Website
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default FundWebsite;
