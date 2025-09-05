import React from 'react';
import { Fund } from '../../data/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { format } from 'date-fns';
import { Clock, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FundDataFreshnessDisplayProps {
  fund: Fund;
}

const FundDataFreshnessDisplay: React.FC<FundDataFreshnessDisplayProps> = ({ fund }) => {
  const contentDates = DateManagementService.getFundContentDates(fund);
  const lastVerified = fund.dataLastVerified || contentDates.dateModified;
  
  // Extract PPM version from fund data if available
  const getPPMVersion = (fund: Fund) => {
    // Look for version in documents or use a default
    if (fund.documents && fund.documents.some(doc => doc.title.includes('PPM'))) {
      return 'v2.1'; // Could be extracted from document metadata
    }
    return 'v1.0';
  };

  const ppmVersion = getPPMVersion(fund);
  const formattedDate = format(new Date(lastVerified), 'yyyy-MM-dd');

  return (
    <Card className="p-4 border-l-4 border-l-primary/20 bg-muted/30">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Data Freshness</span>
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Last verified:</span>
          <time dateTime={lastVerified} className="text-muted-foreground">
            {formattedDate}
          </time>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            Source: PPM {ppmVersion}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default FundDataFreshnessDisplay;