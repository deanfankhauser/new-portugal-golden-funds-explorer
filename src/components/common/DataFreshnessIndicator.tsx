import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Calendar, AlertTriangle } from 'lucide-react';

interface DataFreshnessIndicatorProps {
  fund: Fund;
  variant?: 'compact' | 'full' | 'dot';
  className?: string;
  showLabel?: boolean;
}

export const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({
  fund,
  variant = 'compact',
  className = '',
  showLabel = true
}) => {
  const contentDates = DateManagementService.getFundContentDates(fund);
  const dataAge = DateManagementService.getContentAge(contentDates.dataLastVerified);
  
  const getFreshnessColor = () => {
    if (dataAge <= 7) return 'bg-green-500';
    if (dataAge <= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFreshnessText = () => {
    if (dataAge <= 7) return 'Very Fresh';
    if (dataAge <= 30) return 'Fresh';
    return 'Needs Verification';
  };

  const getFreshnessTextColor = () => {
    if (dataAge <= 7) return 'text-green-700';
    if (dataAge <= 30) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (variant === 'dot') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`h-2 w-2 rounded-full ${getFreshnessColor()} ${className}`} />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p>Data verified: {DateManagementService.formatDisplayDate(contentDates.dataLastVerified)}</p>
              <p className={getFreshnessTextColor()}>Status: {getFreshnessText()}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`flex items-center gap-1 ${className}`}>
              <div className={`h-2 w-2 rounded-full ${getFreshnessColor()}`} />
              {showLabel && (
                <span className="text-xs text-muted-foreground">
                  {dataAge}d ago
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="text-xs space-y-1">
              <p>Last verified: {DateManagementService.formatDisplayDate(contentDates.dataLastVerified)}</p>
              <p className={getFreshnessTextColor()}>{getFreshnessText()} ({dataAge} days old)</p>
              {dataAge > 30 && (
                <p className="text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Consider verifying with official sources
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`h-3 w-3 rounded-full ${getFreshnessColor()}`} />
      <div className="text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <time dateTime={contentDates.dataLastVerified}>
            {DateManagementService.formatDisplayDate(contentDates.dataLastVerified)}
          </time>
        </div>
        <div className={`${getFreshnessTextColor()} font-medium`}>
          {getFreshnessText()}
        </div>
      </div>
    </div>
  );
};

export default DataFreshnessIndicator;