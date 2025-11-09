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
      <div className={`inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3 rounded-full text-base font-bold shadow-xl border-2 border-success/80 ring-4 ring-success/30 animate-in fade-in zoom-in duration-500 ${className}`}>
        <CheckCircle2 className="w-6 h-6" />
        <span>✓ VERIFIED MANAGER</span>
      </div>
    );
  }

  // For unverified managers, show a neutral notice (no GV/CMVM claims)
  return (
    <Badge variant="warning" className={`gap-1.5 px-3 py-1.5 text-sm ${className}`}>
      <Info className="w-4 h-4" />
      Manager not verified
    </Badge>
  );
};

export default ManagerVerificationBadge;
