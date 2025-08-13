import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { EnhancedSEODateService } from '../../services/enhancedSEODateService';

interface FundDataFreshnessProps {
  fund: Fund;
  className?: string;
}

export const FundDataFreshness: React.FC<FundDataFreshnessProps> = ({
  fund,
  className = ''
}) => {
  const shouldShowWarning = EnhancedSEODateService.shouldShowExpirationWarning(fund);
  const contentDates = DateManagementService.getFundContentDates(fund);
  const dataAge = DateManagementService.getContentAge(contentDates.dataLastVerified);
  
  return (
    <div className={`bg-gray-50 rounded-lg p-4 space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900">Data Freshness</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated:</span>
            <time 
              dateTime={contentDates.dateModified}
              className="font-medium text-gray-900"
            >
              {DateManagementService.formatDisplayDate(contentDates.dateModified)}
            </time>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Data Verified:</span>
            <time 
              dateTime={contentDates.dataLastVerified}
              className="font-medium text-gray-900"
            >
              {DateManagementService.formatDisplayDate(contentDates.dataLastVerified)}
            </time>
          </div>
        </div>
        
        <div className="space-y-2">
          {fund.performanceDataDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Performance Data:</span>
              <time 
                dateTime={fund.performanceDataDate}
                className="font-medium text-gray-900"
              >
                {DateManagementService.formatDisplayDate(fund.performanceDataDate)}
              </time>
            </div>
          )}
          
          {fund.feeLastUpdated && (
            <div className="flex justify-between">
              <span className="text-gray-600">Fees Updated:</span>
              <time 
                dateTime={fund.feeLastUpdated}
                className="font-medium text-gray-900"
              >
                {DateManagementService.formatDisplayDate(fund.feeLastUpdated)}
              </time>
            </div>
          )}
        </div>
      </div>
      
      {/* Data freshness indicator */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
        <div className={`h-2 w-2 rounded-full ${
          dataAge <= 7 ? 'bg-green-500' : 
          dataAge <= 30 ? 'bg-yellow-500' : 
          'bg-red-500'
        }`} />
        <span className="text-xs text-gray-600">
          Data is {dataAge} days old
          {dataAge <= 7 && ' (Very Fresh)'}
          {dataAge > 7 && dataAge <= 30 && ' (Fresh)'}
          {dataAge > 30 && ' (Consider Verification)'}
        </span>
      </div>
      
      {shouldShowWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
          <p className="text-xs text-yellow-800">
            ⚠️ This data is over 90 days old and should be verified against official sources.
          </p>
        </div>
      )}
    </div>
  );
};

export default FundDataFreshness;