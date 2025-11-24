import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ManagerAboutSectionProps {
  managerName: string;
  about: string;
}

const ManagerAboutSection: React.FC<ManagerAboutSectionProps> = ({ managerName, about }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Truncate to approximately 2-3 sentences (around 300 characters)
  const truncateText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    return lastPeriod > 0 ? truncated.substring(0, lastPeriod + 1) : truncated + '...';
  };

  const shouldTruncate = about.length > 300;
  const displayText = shouldTruncate && !isExpanded ? truncateText(about) : about;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        About {managerName}
      </h2>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap font-normal">
          {displayText}
        </p>
        
        {shouldTruncate && (
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-0 h-auto text-primary hover:text-primary/80 mt-2"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManagerAboutSection;
