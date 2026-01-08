import React from 'react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText } from 'lucide-react';

interface RegulatoryIdentifiersProps {
  fund: Fund;
}

const RegulatoryIdentifiers: React.FC<RegulatoryIdentifiersProps> = ({ fund }) => {
  // Use cmvmId directly from database, no fallbacks
  const cmvmId = fund.cmvmId;
  
  // Use ISIN from dedicated field, fallback to regex extraction for backward compatibility
  let isin = fund.isin || null;
  if (!isin) {
    const isinMatch = fund.detailedDescription?.match(/ISIN[:\s]*([A-Z]{2}[A-Z0-9]{10})/i);
    isin = isinMatch ? isinMatch[1] : null;
  }
  
  // Only show component if we have actual data
  if (!cmvmId && !isin) {
    return null;
  }

  // Format multi-class ISINs nicely
  const formatIsin = (isinValue: string) => {
    if (isinValue.includes(';')) {
      return isinValue.split(';').map(s => s.trim()).filter(Boolean);
    }
    return [isinValue];
  };

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-5 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4 md:mb-5">Regulatory Identifiers</h2>
        
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8">
          We source from CMVM-regulated managers where applicable. Verify each fund's registration and GV suitability with counsel.
        </p>
        
        <div className="flex flex-col gap-3 md:gap-4">
          {cmvmId && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <Shield className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
                CMVM Registration
              </span>
              <span className="text-[15px] font-semibold text-foreground break-all sm:text-right">{cmvmId}</span>
            </div>
          )}
          {isin && (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                <FileText className="h-[18px] w-[18px] text-muted-foreground flex-shrink-0" />
                ISIN
              </span>
              <div className="flex flex-col gap-1 sm:text-right">
                {formatIsin(isin).map((code, idx) => (
                  <span key={idx} className="text-[15px] font-semibold text-foreground break-all">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryIdentifiers;