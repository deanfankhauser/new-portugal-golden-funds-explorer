import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle, XCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type USEligibilityStatus = 'confirmed_yes' | 'confirmed_no' | 'unknown';

interface USEligibilityBadgeProps {
  status: USEligibilityStatus;
  sourceUrl?: string;
  compact?: boolean;
  className?: string;
}

const statusConfig: Record<USEligibilityStatus, {
  label: string;
  icon: React.ElementType;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}> = {
  confirmed_yes: {
    label: 'US Persons Accepted',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-green-600/90 hover:bg-green-600 text-white border-green-500'
  },
  confirmed_no: {
    label: 'Not Available to US Persons',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-600/90 hover:bg-red-600 text-white border-red-500'
  },
  unknown: {
    label: 'US Eligibility Unknown',
    icon: HelpCircle,
    variant: 'secondary',
    className: 'bg-muted hover:bg-muted/80 text-muted-foreground border-border'
  }
};

export const USEligibilityBadge: React.FC<USEligibilityBadgeProps> = ({
  status,
  sourceUrl,
  compact = false,
  className
}) => {
  const config = statusConfig[status] || statusConfig.unknown;
  const Icon = config.icon;
  
  const badge = (
    <Badge 
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        config.className,
        compact ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        className
      )}
    >
      <Icon className={cn('shrink-0', compact ? 'h-3 w-3' : 'h-4 w-4')} />
      <span>{compact && status === 'confirmed_yes' ? 'US OK' : config.label}</span>
      {sourceUrl && !compact && (
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      )}
    </Badge>
  );
  
  if (sourceUrl) {
    return (
      <a 
        href={sourceUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex hover:opacity-90 transition-opacity"
        title="View source documentation"
      >
        {badge}
      </a>
    );
  }
  
  return badge;
};

export default USEligibilityBadge;
