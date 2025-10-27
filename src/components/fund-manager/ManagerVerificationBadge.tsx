import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Fund } from '@/data/funds';
import ManagerTrustIndicators from './ManagerTrustIndicators';

interface ManagerVerificationBadgeProps {
  isVerified: boolean;
  funds?: Fund[];
  className?: string;
}

const ManagerVerificationBadge: React.FC<ManagerVerificationBadgeProps> = ({ 
  isVerified,
  funds = [],
  className = '' 
}) => {
  // Show verified badge if manager is verified
  if (isVerified) {
    return (
      <div className={`inline-flex items-center gap-2 bg-success text-success-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border-2 border-success/70 ring-2 ring-success/30 animate-in fade-in duration-300 ${className}`}>
        <CheckCircle2 className="w-5 h-5" />
        <span>VERIFIED MANAGER</span>
      </div>
    );
  }

  // Show trust indicators for unverified managers
  return <ManagerTrustIndicators funds={funds} className={className} />;
};

export default ManagerVerificationBadge;
