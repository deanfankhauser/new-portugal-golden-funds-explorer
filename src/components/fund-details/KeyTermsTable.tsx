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
      'Minimum Investment': <Building className="h-4 w-4" />,
      'Fund Structure': <FileText className="h-4 w-4" />,
      'Domicile': <MapPin className="h-4 w-4" />,
      'Custodian': <Shield className="h-4 w-4" />,
      'Auditor': <FileCheck className="h-4 w-4" />,
      'ISIN': <Hash className="h-4 w-4" />,
      'Reporting': <FileText className="h-4 w-4" />,
      'Documentation Cadence': <Calendar className="h-4 w-4" />,
      'Fund Status': <Shield className="h-4 w-4" />,
      'Inception Date': <Calendar className="h-4 w-4" />,
    };
    return iconMap[label] || <FileText className="h-4 w-4" />;
  };

  const keyTerms = [
    { label: "Minimum Investment", value: fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : "Contact Manager", type: "currency" },
    { label: "Fund Structure", value: fund.category || "Investment Fund", type: "text" },
    { label: "Domicile", value: "Portugal", type: "text" },
    { label: "Custodian", value: fund.custodian || "Banco BPI", type: "text" },
    { label: "Auditor", value: fund.auditor || "PwC Portugal", type: "text" },
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
    return <span className="text-sm font-medium">{term.value}</span>;
  };

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Key Terms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2.5">
          {keyTerms.map((term, index) => (
            <div key={index} className={`flex items-center justify-between py-2 ${index !== keyTerms.length - 1 ? 'border-b' : ''}`}>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                {getIcon(term.label)}
                {term.label}
              </span>
              {renderValue(term)}
            </div>
          ))}
        </div>

        {/* Expandable Details */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer py-3 border-t hover:bg-accent/5 transition-colors px-2 -mx-2 rounded">
            <span className="text-sm font-medium">Service Providers & Compliance</span>
            <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="pt-4 space-y-4 pb-2">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Administrator
                </span>
                <span className="text-sm font-medium">Fund Admin Portugal</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Legal Counsel
                </span>
                <span className="text-sm font-medium">Morais Leitão</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Tax Advisor
                </span>
                <span className="text-sm font-medium">Deloitte Portugal</span>
              </div>
            </div>
          </div>
        </details>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          Information as reported by fund manager. Terms may vary by investor class.
        </p>
      </CardContent>
    </Card>
  );
};

export default KeyTermsTable;