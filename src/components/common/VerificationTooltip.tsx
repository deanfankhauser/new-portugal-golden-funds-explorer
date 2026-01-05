import React from 'react';
import { Shield, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface VerificationTooltipProps {
  isVerified?: boolean;
  className?: string;
  showLabel?: boolean;
}

const VERIFICATION_POINTS = [
  { label: 'Legal Entity', description: 'Company registration and fund structure verified' },
  { label: 'Governance', description: 'Management team and oversight structure confirmed' },
  { label: 'CMVM Registration', description: 'Regulatory filing with Portuguese securities authority' },
  { label: 'ARI Eligibility', description: 'Golden Visa investment criteria consistency checked' },
  { label: 'Track Record', description: 'Historical performance documentation reviewed' },
];

const VerificationTooltip: React.FC<VerificationTooltipProps> = ({ 
  isVerified = true, 
  className = '',
  showLabel = true
}) => {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button 
          className={`inline-flex items-center gap-1.5 cursor-help ${className}`}
          aria-label="View verification methodology"
        >
          <div className={`p-1 rounded-full ${isVerified ? 'bg-gold-verified/10' : 'bg-muted'}`}>
            <Shield 
              className={`w-3.5 h-3.5 ${isVerified ? 'text-gold-verified' : 'text-muted-foreground'}`} 
              fill={isVerified ? 'currentColor' : 'none'}
            />
          </div>
          {showLabel && (
            <span className={`text-xs font-medium ${isVerified ? 'text-gold-verified' : 'text-muted-foreground'}`}>
              {isVerified ? 'Movingto Verified' : 'Unverified'}
            </span>
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-verified" fill="currentColor" />
              <span className="font-semibold text-sm">5-Point Verification</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Our due diligence methodology for fund listings
            </p>
          </div>

          {/* Verification Points */}
          <div className="px-4 py-3 space-y-2.5">
            {VERIFICATION_POINTS.map((point, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-gold-verified/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-gold-verified" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-100 block">
                    {point.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {point.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-700 bg-slate-800/50">
            <Link 
              to="/verification-program" 
              className="inline-flex items-center gap-1.5 text-xs text-gold-verified hover:text-gold-verified/80 transition-colors"
            >
              <span>View full methodology</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default VerificationTooltip;
