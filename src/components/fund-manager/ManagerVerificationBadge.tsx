import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { Fund } from '@/data/funds';
import { Badge } from '@/components/ui/badge';

interface ManagerVerificationBadgeProps {
  isVerified: boolean;
  funds?: Fund[];
  className?: string;
}

const ManagerVerificationBadge: React.FC<ManagerVerificationBadgeProps> = ({ 
  isVerified,
  // funds prop kept for future use if needed
  className = '' 
}) => {
  // Show verified badge if manager is verified
  if (isVerified) {
    return (
      <div className={`inline-flex items-center gap-2 bg-success/10 text-success border border-success/20 px-4 py-2 rounded-lg text-sm font-semibold ${className}`}>
        <CheckCircle2 className="w-4 h-4" />
        <span>Verified Manager</span>
      </div>
    );
  }

  // For unverified managers, show a neutral notice (no GV/CMVM claims)
  return (
    <Badge variant="outline" className={`gap-1.5 px-3 py-1.5 text-sm border-muted-foreground/20 ${className}`}>
      <Info className="w-4 h-4" />
      Manager not verified
    </Badge>
  );
};

export default ManagerVerificationBadge;
