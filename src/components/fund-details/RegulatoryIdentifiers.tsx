import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText } from 'lucide-react';

interface RegulatoryIdentifiersProps {
  fund: Fund;
}

const RegulatoryIdentifiers: React.FC<RegulatoryIdentifiersProps> = ({ fund }) => {
  // Extract CMVM registration number if available
  const cmvmRegMatch = fund.regulatedBy?.match(/CMVM.*?(\d{3,})/i);
  const cmvmRegNumber = cmvmRegMatch ? cmvmRegMatch[1] : null;
  
  // Extract ISIN from detailed description
  const isinMatch = fund.detailedDescription?.match(/ISIN[:\s]*([A-Z]{2}[A-Z0-9]{10})/i);
  const isin = isinMatch ? isinMatch[1] : null;
  
  // Check if fund is regulated by CMVM
  const isCMVMRegulated = fund.regulatedBy?.toLowerCase().includes('cmvm');
  
  if (!isCMVMRegulated && !cmvmRegNumber && !isin) {
    return null;
  }

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-accent/10 shrink-0">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground pt-1">Regulatory Identifiers</h2>
        </div>
        <div className="space-y-4 ml-[44px]">
          <p className="text-foreground leading-relaxed">
            We source from CMVM-regulated managers where applicable. Verify each fund's registration and GV suitability with counsel.
          </p>
          
          {(cmvmRegNumber || isin) && (
            <div className="mt-4 p-4 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Regulatory Identifiers</h3>
              <div className="space-y-2.5">
                {cmvmRegNumber && (
                  <div className="flex items-center justify-between py-2 border-b border-accent/10">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      CMVM Registration
                    </span>
                    <span className="text-sm font-medium">{cmvmRegNumber}</span>
                  </div>
                )}
                {isin && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      ISIN
                    </span>
                    <span className="text-sm font-medium">{isin}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryIdentifiers;