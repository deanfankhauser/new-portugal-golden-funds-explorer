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
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-8">Regulatory & Compliance</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <Award className="h-[18px] w-[18px] text-muted-foreground" />
              CMVM Registration
            </span>
            <span className="text-[15px] font-semibold text-foreground">{formatField(fund.cmvmId)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <FileCheck className="h-[18px] w-[18px] text-muted-foreground" />
              Auditor
            </span>
            <span className="text-[15px] font-semibold text-foreground">{formatField(fund.auditor)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <Building2 className="h-[18px] w-[18px] text-muted-foreground" />
              Custodian
            </span>
            <span className="text-[15px] font-semibold text-foreground">{formatField(fund.custodian)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
              NAV Frequency
            </span>
            <span className="text-[15px] font-semibold text-foreground">{formatField(fund.navFrequency)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
            <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
              <AlertTriangle className="h-[18px] w-[18px] text-muted-foreground" />
              PFIC/QEF Status
            </span>
            <Badge variant={fund.pficStatus === 'QEF available' ? 'default' : 'outline'} className="text-[13px]">
              {fund.pficStatus === 'QEF available' ? 'QEF Available' : 
               fund.pficStatus === 'MTM only' ? 'MTM Only' : 
               'Status Unknown'}
            </Badge>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-8 pt-8 border-t border-border/60">
          Always confirm regulatory details with the fund manager and legal counsel before investing.
        </p>
      </CardContent>
    </Card>
  );
};

export default RegulatoryComplianceInfo;