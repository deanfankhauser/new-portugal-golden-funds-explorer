import React from 'react';
import { Shield, Award, Building2, Calendar, FileCheck, AlertTriangle } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RegulatoryComplianceInfoProps {
  fund: Fund;
}

const RegulatoryComplianceInfo: React.FC<RegulatoryComplianceInfoProps> = ({ fund }) => {
  const formatField = (value: any, fallback: string = 'N/A') => {
    return value || fallback;
  };

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Regulatory & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key compliance details */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              CMVM Registration
            </span>
            <span className="text-sm font-medium">{formatField(fund.cmvmId)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Auditor
            </span>
            <span className="text-sm font-medium">{formatField(fund.auditor)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Custodian
            </span>
            <span className="text-sm font-medium">{formatField(fund.custodian)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              NAV Frequency
            </span>
            <span className="text-sm font-medium">{formatField(fund.navFrequency)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              PFIC/QEF Status
            </span>
            <Badge variant={fund.pficStatus === 'QEF available' ? 'default' : 'outline'} className="text-xs">
              {fund.pficStatus === 'QEF available' ? 'QEF Available' : 
               fund.pficStatus === 'MTM only' ? 'MTM Only' : 
               'Status Unknown'}
            </Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          Always confirm regulatory details with the fund manager and legal counsel before investing.
        </p>
      </CardContent>
    </Card>
  );
};

export default RegulatoryComplianceInfo;