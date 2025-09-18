import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCurrency } from './utils/formatters';

interface KeyTermsTableProps {
  fund: Fund;
}

const KeyTermsTable: React.FC<KeyTermsTableProps> = ({ fund }) => {
  
  const keyTerms = [
    {
      label: "Minimum Investment",
      value: fund.minimumInvestment ? formatCurrency(fund.minimumInvestment) : "Contact Manager",
      type: "currency"
    },
    {
      label: "Fund Structure",
      value: fund.category || "Investment Fund",
      type: "text"
    },
    {
      label: "Domicile",
      value: "Portugal",
      type: "text"
    },
    {
      label: "Custodian",
      value: fund.custodian || "Banco BPI",
      type: "text"
    },
    {
      label: "Auditor",
      value: fund.auditor || "PwC Portugal",
      type: "text"
    },
    {
      label: "ISIN",
      value: fund.cmvmId || "N/A",
      type: "text"
    },
    {
      label: "Reporting",
      value: "Monthly NAV, Quarterly Reports",
      type: "text"
    },
    {
      label: "Currency",
      value: "EUR",
      type: "text"
    },
    {
      label: "FX Hedging",
      value: "Available",
      type: "text"
    },
    {
      label: "Documentation Cadence",
      value: "Monthly",
      type: "text"
    },
    {
      label: "Fund Status",
      value: fund.fundStatus || "Active",
      type: "status"
    },
    {
      label: "Inception Date",
      value: fund.established ? `${fund.established}` : "N/A",
      type: "date"
    }
  ];

  const renderValue = (term: typeof keyTerms[0]) => {
    switch (term.type) {
      case 'status':
        return (
          <Badge 
            variant={term.value === 'Active' ? 'default' : 'outline'}
            className={term.value === 'Active' ? 'bg-success text-success-foreground' : ''}
          >
            {term.value}
          </Badge>
        );
      case 'currency':
        return <span className="font-semibold text-foreground">{term.value}</span>;
      default:
        return <span className="text-foreground">{term.value}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Terms</CardTitle>
        <p className="text-sm text-muted-foreground">
          Essential fund details and structural information
        </p>
      </CardHeader>
      <CardContent>
        
        {/* Desktop: Two-column table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {keyTerms.map((term, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                <span className="text-sm text-muted-foreground font-medium">
                  {term.label}:
                </span>
                <div className="text-right">
                  {renderValue(term)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Card layout */}
        <div className="md:hidden space-y-3">
          {keyTerms.map((term, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs text-muted-foreground font-medium mb-1">
                {term.label}
              </div>
              <div>
                {renderValue(term)}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Regulatory Information */}
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Regulatory Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CMVM Registered:</span>
                  <span className="text-foreground">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MiFID Classification:</span>
                  <span className="text-foreground">Professional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AIFMD Compliant:</span>
                  <span className="text-foreground">Yes</span>
                </div>
              </div>
            </div>

            {/* Service Providers */}
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3">Service Providers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Administrator:</span>
                  <span className="text-foreground">Fund Admin Portugal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legal Counsel:</span>
                  <span className="text-foreground">Morais Leitão</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Advisor:</span>
                  <span className="text-foreground">Deloitte Portugal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Information as reported by fund manager. Terms subject to change and may vary by investor class. 
            Please refer to offering documents for complete terms and conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyTermsTable;