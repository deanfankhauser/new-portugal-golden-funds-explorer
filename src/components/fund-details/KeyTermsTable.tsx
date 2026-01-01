import React, { useState } from 'react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building, MapPin, Shield, FileCheck, Calendar, Hash, FileText, Briefcase, Clock } from 'lucide-react';
import { formatCurrency } from './utils/formatters';
import { getFundType } from '../../utils/fundTypeUtils';

interface KeyTermsTableProps {
  fund: Fund;
}

const KeyTermsTable: React.FC<KeyTermsTableProps> = ({ fund }) => {
  const getIcon = (label: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Minimum Investment': <Building className="h-[18px] w-[18px] text-muted-foreground" />,
      'Fund Structure': <FileText className="h-[18px] w-[18px] text-muted-foreground" />,
      'Fund Term': <Clock className="h-[18px] w-[18px] text-muted-foreground" />,
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

  const fundType = getFundType(fund);
  const getFundTermValue = () => {
    if (fundType === 'Open-Ended') return 'Perpetual';
    if (fund.term) return `${fund.term} years`;
    return 'N/A';
  };

  const keyTerms = [
    { label: "Minimum Investment", value: fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : "N/A", type: "currency" },
    { label: "Fund Structure", value: fund.category || "N/A", type: "text" },
    { label: "Fund Term", value: getFundTermValue(), type: "text" },
    { label: "Domicile", value: fund.location || "N/A", type: "text" },
    { label: "Custodian", value: fund.custodian || "N/A", type: "text" },
    { label: "Auditor", value: fund.auditor || "N/A", type: "text" },
    { label: "ISIN", value: fund.isin || "N/A", type: "text" },
    { label: "Typical Ticket", value: fund.typicalTicket ? formatCurrency(fund.typicalTicket) : "N/A", type: "currency" },
    { label: "Risk Band", value: fund.riskBand || "N/A", type: "text" },
    { label: "Fund Status", value: fund.fundStatus || "N/A", type: "status" },
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

  // Fields that need stacked layout on mobile due to long values
  const stackedFields = ['ISIN', 'Domicile', 'Custodian', 'Auditor'];

  return (
    <Card className="bg-card border border-border/40 rounded-2xl shadow-sm">
      <CardContent className="p-5 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-6 md:mb-8">Key Terms</h2>
        
        {/* Main Terms */}
        <div className="flex flex-col gap-3 md:gap-4">
          {keyTerms.map((term, index) => {
            const needsStacking = stackedFields.includes(term.label);
            return (
              <div 
                key={index} 
                className={`${needsStacking ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2' : 'flex items-center justify-between'} px-4 py-3 bg-muted/20 border border-border/40 rounded-lg hover:bg-muted/30 hover:border-border/60 transition-colors`}
              >
                <span className="flex items-center gap-2.5 text-sm text-foreground/70 font-medium shrink-0">
                  {getIcon(term.label)}
                  {term.label}
                </span>
                <div className={needsStacking ? 'break-all sm:text-right' : ''}>
                  {renderValue(term)}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border/60">
          Information as reported by fund manager. Terms may vary by investor class.
        </p>
      </CardContent>
    </Card>
  );
};

export default KeyTermsTable;