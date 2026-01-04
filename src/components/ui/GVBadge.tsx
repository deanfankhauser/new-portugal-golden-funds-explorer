import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GV_LABELS } from '@/utils/gvComplianceLabels';
import { cn } from '@/lib/utils';

interface GVBadgeProps {
  /** Variant for different contexts */
  variant?: 'card' | 'hero' | 'snapshot' | 'compact';
  /** Additional className */
  className?: string;
  /** Show tooltip (default: true) */
  showTooltip?: boolean;
}

const GVBadge: React.FC<GVBadgeProps> = ({ 
  variant = 'card',
  className,
  showTooltip = true
}) => {
  const getBadgeContent = () => {
    switch (variant) {
      case 'compact':
        return GV_LABELS.SHORT;
      case 'snapshot':
      case 'hero':
      case 'card':
      default:
        return GV_LABELS.BADGE;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'snapshot':
        return 'px-4 py-2.5 bg-warning/10 border-warning/20 text-warning text-[13px] font-semibold rounded-lg';
      case 'hero':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1.5 text-[13px] font-medium';
      case 'compact':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0.5 text-[11px] font-medium';
      case 'card':
      default:
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 text-[13px] font-medium';
    }
  };

  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        getVariantStyles(),
        'flex items-center gap-1.5',
        className
      )}
    >
      <Award className="w-3.5 h-3.5" />
      {getBadgeContent()}
      {showTooltip && <Info className="w-3 h-3 opacity-60" />}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p>{GV_LABELS.TOOLTIP}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export { GVBadge };
