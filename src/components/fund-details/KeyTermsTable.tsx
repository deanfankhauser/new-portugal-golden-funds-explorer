import React, { useState } from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building, MapPin, Shield, FileCheck, Calendar, Hash, FileText, Briefcase } from 'lucide-react';
import { formatCurrency } from './utils/formatters';

interface KeyTermsTableProps {
  fund: Fund;
}

const KeyTermsTable: React.FC<KeyTermsTableProps> = ({ fund }) => {
  const getIcon = (label: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Minimum Investment': <Building className="h-[18px] w-[18px] text-muted-foreground" />,
      'Fund Structure': <FileText className="h-[18px] w-[18px] text-muted-foreground" />,
      'Domicile': <MapPin className="h-[18px] w-[18px] text-muted-foreground" />,
      'Custodian': <Shield className="h-[18px] w-[18px] text-muted-foreground" />,
      'Auditor': <FileCheck className="h-[18px] w-[18px] text-muted-foreground" />,
      'ISIN': <Hash className="h-[18px] w-[18px] text-muted-foreground" />,
      'Reporting': <FileText className="h-[18px] w-[18px] text-muted-foreground" />,
      'Documentation Cadence': <Calendar className="h-[18px] w-[18px] text-muted-foreground" />,
      'Fund Status': <Shield className="h-[18px] w-[18px] text-muted-foreground" />,
      'Inception Date': <Calendar className="h-[18px] w-[18px] text-muted-foreground" />,
    };
    return iconMap[label] || <FileText className="h-[18px] w-[18px] text-muted-foreground" />;
  };

  const keyTerms = [
    { label: "Minimum Investment", value: fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : "N/A", type: "currency" },
    { label: "Fund Structure", value: fund.category || "N/A", type: "text" },
    { label: "Domicile", value: "Portugal", type: "text" },
    { label: "Custodian", value: fund.custodian || "N/A", type: "text" },
    { label: "Auditor", value: fund.auditor || "N/A", type: "text" },
    { label: "ISIN", value: fund.cmvmId || "N/A", type: "text" },
    { label: "Reporting", value: "Monthly NAV, Quarterly Reports", type: "text" },
    { label: "Documentation Cadence", value: "Monthly", type: "text" },
    { label: "Fund Status", value: fund.fundStatus || "Active", type: "status" },
    { label: "Inception Date", value: fund.established ? `${fund.established}` : "N/A", type: "date" },
  ];

  const renderValue = (term: typeof keyTerms[0]) => {
    if (term.type === 'status') {
      return (
        <Badge variant={term.value === 'Active' ? 'default' : 'outline'} className="text-xs">
          {term.value}
        </Badge>
      );
    }
    return <span className="text-[15px] font-semibold text-foreground">{term.value}</span>;
  };

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">Key Terms</h2>
        
        {/* Main Terms */}
        <div className="flex flex-col gap-4">
          {keyTerms.map((term, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors">
              <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium">
                {getIcon(term.label)}
                {term.label}
              </span>
              {renderValue(term)}
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-8 pt-8 border-t border-border/60">
          Information as reported by fund manager. Terms may vary by investor class.
        </p>
      </CardContent>
    </Card>
  );
};

export default KeyTermsTable;