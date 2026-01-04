import React from 'react';
import { Shield, Award, Building2, Calendar, FileCheck, AlertTriangle } from 'lucide-react';
import { Fund } from '../../data/types/funds';
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
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-5 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-6 md:mb-8">Regulatory & Compliance</h2>
        
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium whitespace-nowrap">
              <Award className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
              CMVM Registration
            </span>
            <span className="text-[15px] font-semibold text-foreground break-all sm:text-right">{formatField(fund.cmvmId)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium whitespace-nowrap">
              <FileCheck className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
              Auditor
            </span>
            <span className="text-[15px] font-semibold text-foreground sm:text-right">{formatField(fund.auditor)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium whitespace-nowrap">
              <Building2 className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
              Custodian
            </span>
            <span className="text-[15px] font-semibold text-foreground sm:text-right">{formatField(fund.custodian)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium whitespace-nowrap">
              <Calendar className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
              NAV Frequency
            </span>
            <span className="text-[15px] font-semibold text-foreground">{formatField(fund.navFrequency)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium whitespace-nowrap">
              <AlertTriangle className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
              PFIC/QEF Status
            </span>
            <Badge variant={fund.pficStatus === 'QEF available' ? 'default' : 'outline'} className="text-[13px] w-fit">
              {fund.pficStatus === 'QEF available' ? 'QEF Available' : 
               fund.pficStatus === 'MTM only' ? 'MTM Only' : 
               'Status Unknown'}
            </Badge>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border/60">
          Always confirm regulatory details with the fund manager and legal counsel before investing.
        </p>
      </CardContent>
    </Card>
  );
};

export default RegulatoryComplianceInfo;