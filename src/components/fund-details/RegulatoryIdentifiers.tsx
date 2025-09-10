import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from 'lucide-react';

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
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <Shield className="w-5 h-5 mr-2 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Regulatory Identifiers</h2>
        </div>
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            We source from CMVM-regulated managers where applicable. Verify each fund's registration and GV suitability with counsel.
          </p>
          
          {(cmvmRegNumber || isin) && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Regulatory Identifiers</h3>
              <div className="space-y-1 text-sm">
                {cmvmRegNumber && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">CMVM Registration:</span> {cmvmRegNumber}
                  </p>
                )}
                {isin && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">ISIN:</span> {isin}
                  </p>
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