import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ManagerVerificationBadgeProps {
  isVerified: boolean;
  className?: string;
}

const ManagerVerificationBadge: React.FC<ManagerVerificationBadgeProps> = ({ 
  isVerified,
  className = '' 
}) => {
  if (!isVerified) return null;

  return (
    <div className={`inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border-2 border-green-700 ring-2 ring-green-400/50 animate-in fade-in duration-300 ${className}`}>
      <CheckCircle2 className="w-5 h-5" />
      <span>VERIFIED MANAGER</span>
    </div>
  );
};

export default ManagerVerificationBadge;
