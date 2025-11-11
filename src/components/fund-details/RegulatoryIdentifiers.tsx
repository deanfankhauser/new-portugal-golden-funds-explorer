import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText } from 'lucide-react';

interface RegulatoryIdentifiersProps {
  fund: Fund;
}

const RegulatoryIdentifiers: React.FC<RegulatoryIdentifiersProps> = ({ fund }) => {
  // Use cmvmId directly from database, no fallbacks
  const cmvmId = fund.cmvmId;
  
  // Extract ISIN from detailed description
  const isinMatch = fund.detailedDescription?.match(/ISIN[:\s]*([A-Z]{2}[A-Z0-9]{10})/i);
  const isin = isinMatch ? isinMatch[1] : null;
  
  // Only show component if we have actual data
  if (!cmvmId && !isin) {
    return null;
  }

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-5">Regulatory Identifiers</h2>
        
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          We source from CMVM-regulated managers where applicable. Verify each fund's registration and GV suitability with counsel.
        </p>
        
        <div className="flex flex-col gap-4">
          {cmvmId && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Shield className="h-[18px] w-[18px] text-muted-foreground" />
                CMVM Registration
              </span>
              <span className="text-[15px] font-semibold text-foreground">{cmvmId}</span>
            </div>
          )}
          {isin && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <FileText className="h-[18px] w-[18px] text-muted-foreground" />
                ISIN
              </span>
              <span className="text-[15px] font-semibold text-foreground">{isin}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryIdentifiers;