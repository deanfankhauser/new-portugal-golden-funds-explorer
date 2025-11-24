import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';

interface ManagerOverviewSectionProps {
  managerName: string;
  managerProfile?: Profile | null;
}

const ManagerOverviewSection: React.FC<ManagerOverviewSectionProps> = ({ 
  managerName, 
  managerProfile 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const fullDescription = managerProfile?.manager_about || managerProfile?.description || 
    `${managerName} is a CMVM-regulated Portugal Golden Visa fund manager specializing in qualified investment funds for international investors seeking Portuguese residency through capital transfer.`;
  
  // Truncate to approximately 2 sentences or 200 characters
  const getTruncatedText = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length <= 2) return text;
    return sentences.slice(0, 2).join('. ') + '.';
  };
  
  const truncatedDescription = getTruncatedText(fullDescription);
  const shouldShowReadMore = fullDescription.length > truncatedDescription.length;

  return (
    <div>
      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            About {managerName}
          </h3>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {isExpanded ? fullDescription : truncatedDescription}
            </p>
            {shouldShowReadMore && (
              <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-0 h-auto font-normal text-primary hover:text-primary/80 mt-2"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerOverviewSection;
