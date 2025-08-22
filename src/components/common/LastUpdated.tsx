import React from 'react';
import { DateManagementService } from '../../services/dateManagementService';
import { Fund } from '../../data/types/funds';

interface LastUpdatedProps {
  fund?: Fund;
  dateModified?: string;
  dataLastVerified?: string;
  className?: string;
  showDataVerification?: boolean;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({
  fund,
  dateModified,
  dataLastVerified,
  className = '',
  showDataVerification = true
}) => {
  const modifiedDate = fund?.dateModified || dateModified;
  const verifiedDate = fund?.dataLastVerified || dataLastVerified;
  
  if (!modifiedDate) return null;

  const contentAge = DateManagementService.getContentAge(modifiedDate);
  const isStale = contentAge > 30;

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>Last updated:</span>
          <time 
            dateTime={modifiedDate}
            className={`font-medium ${isStale ? 'text-warning' : 'text-success'}`}
          >
            {DateManagementService.formatDisplayDate(modifiedDate)}
          </time>
          {contentAge <= 7 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-success/20 text-success-foreground">
              Recently updated
            </span>
          )}
        </div>
        
        {showDataVerification && verifiedDate && (
          <div className="flex items-center gap-2">
            <span>Data verified:</span>
            <time 
              dateTime={verifiedDate}
              className="font-medium text-accent"
            >
              {DateManagementService.formatDisplayDate(verifiedDate)}
            </time>
          </div>
        )}
        
        {fund?.performanceDataDate && (
          <div className="flex items-center gap-2">
            <span>Performance data as of:</span>
            <time 
              dateTime={fund.performanceDataDate}
              className="font-medium"
            >
              {DateManagementService.formatDisplayDate(fund.performanceDataDate)}
            </time>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastUpdated;