import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecentlyVerifiedBadgeProps {
  verifiedAt?: string;
  className?: string;
  daysThreshold?: number; // Days to consider "recent"
}

const RecentlyVerifiedBadge: React.FC<RecentlyVerifiedBadgeProps> = ({
  verifiedAt,
  className = '',
  daysThreshold = 30
}) => {
  if (!verifiedAt) return null;

  const verificationDate = new Date(verifiedAt);
  const now = new Date();
  const daysSinceVerification = Math.floor((now.getTime() - verificationDate.getTime()) / (1000 * 60 * 60 * 24));

  // Only show badge if verified recently
  if (daysSinceVerification > daysThreshold) return null;

  return (
    <Badge 
      variant="success" 
      className={`gap-1.5 px-3 py-1 text-xs font-bold animate-in fade-in zoom-in duration-300 ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      Recently Verified
    </Badge>
  );
};

export default RecentlyVerifiedBadge;
