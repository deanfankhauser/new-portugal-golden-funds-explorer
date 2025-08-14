import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface DataFreshnessWarningProps {
  fund: Fund;
  warningThresholdDays?: number;
  className?: string;
  showActions?: boolean;
}

export const DataFreshnessWarning: React.FC<DataFreshnessWarningProps> = ({
  fund,
  warningThresholdDays = 90,
  className = '',
  showActions = true
}) => {
  const contentDates = DateManagementService.getFundContentDates(fund);
  const dataAge = DateManagementService.getContentAge(contentDates.dataLastVerified);
  
  if (dataAge <= warningThresholdDays) return null;

  const handleVerifyClick = () => {
    if (fund.websiteUrl) {
      window.open(fund.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Alert variant="destructive" className={`bg-yellow-50 border-yellow-300 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="space-y-2">
          <p className="font-medium">
            Data Verification Recommended
          </p>
          <p className="text-sm">
            This fund's data was last verified {dataAge} days ago 
            ({DateManagementService.formatDisplayDate(contentDates.dataLastVerified)}). 
            Please verify current details against official sources before making investment decisions.
          </p>
          
          {showActions && (
            <div className="flex gap-2 mt-3">
              {fund.websiteUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVerifyClick}
                  className="bg-white hover:bg-gray-50 border-yellow-400 text-yellow-800"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Verify on Fund Website
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="bg-white hover:bg-gray-50 border-yellow-400 text-yellow-800"
                onClick={() => {
                  // Could trigger a report mechanism or contact form
                  alert('Thank you for helping us maintain data quality. Our team will review this fund\'s information.');
                }}
              >
                Report Outdated Data
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DataFreshnessWarning;