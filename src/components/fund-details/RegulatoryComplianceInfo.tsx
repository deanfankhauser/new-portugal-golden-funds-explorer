import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RegulatoryComplianceInfoProps {
  fund: Fund;
}

const RegulatoryComplianceInfo: React.FC<RegulatoryComplianceInfoProps> = ({ fund }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const formatField = (value: any, fallback: string = 'Not provided') => {
    return value || fallback;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Regulatory & Compliance Information</CardTitle>
        <p className="text-sm text-muted-foreground">As of {currentDate}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">CMVM Registration</h4>
            <p className="text-sm">{formatField(fund.cmvmId)}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Auditor</h4>
            <p className="text-sm">{formatField(fund.auditor)}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Custodian</h4>
            <p className="text-sm">{formatField(fund.custodian)}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">NAV Frequency</h4>
            <p className="text-sm">{formatField(fund.navFrequency)}</p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">PFIC/QEF Status (US Tax)</h4>
            <p className="text-sm">{formatField(fund.pficStatus)}</p>
          </div>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground border-t">
          Confirm with manager + lawyer before investing.
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryComplianceInfo;