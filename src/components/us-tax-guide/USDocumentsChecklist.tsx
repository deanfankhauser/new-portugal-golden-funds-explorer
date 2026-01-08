import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileCheck, FileText } from 'lucide-react';

export const USDocumentsChecklist: React.FC = () => {
  const documents = [
    {
      name: 'Form W-9',
      description: 'Request for Taxpayer Identification Number and Certification',
      purpose: 'Provides your SSN/TIN to the fund for FATCA reporting',
      when: 'During onboarding',
      required: true,
    },
    {
      name: 'FATCA Self-Certification',
      description: 'Declaration of U.S. person status',
      purpose: 'Confirms your U.S. tax status for the fund\'s FATCA compliance',
      when: 'During onboarding',
      required: true,
    },
    {
      name: 'Proof of TIN/SSN',
      description: 'Copy of Social Security card or IRS letter',
      purpose: 'Verification of your taxpayer identification number',
      when: 'During onboarding (some funds)',
      required: false,
    },
    {
      name: 'Source of Funds Documentation',
      description: 'Bank statements, sale contracts, dividend statements, etc.',
      purpose: 'Anti-money laundering (AML) compliance; may be more detailed for U.S. persons',
      when: 'During onboarding',
      required: true,
    },
    {
      name: 'Tax Residency Certificate',
      description: 'IRS Form 6166 or similar',
      purpose: 'Some funds request proof of U.S. tax residency for treaty benefits',
      when: 'If requested',
      required: false,
    },
    {
      name: 'Address History / KYC Documents',
      description: 'Utility bills, bank statements showing addresses',
      purpose: 'Enhanced KYC for U.S. persons; may cover multiple years',
      when: 'During onboarding',
      required: true,
    },
  ];

  const annualDocuments = [
    {
      name: 'PFIC Annual Information Statement',
      description: 'Provided by fund if they support QEF elections',
      purpose: 'Required to make and maintain a QEF election',
      when: 'Annually (from fund)',
    },
    {
      name: 'Account Statements',
      description: 'Year-end valuation of your investment',
      purpose: 'For Form 8938, FBAR, and Form 8621 reporting',
      when: 'Annually',
    },
    {
      name: 'Distribution Notices',
      description: 'Records of any distributions received',
      purpose: 'For tax reporting on Form 8621 and your tax return',
      when: 'When distributions occur',
    },
  ];

  return (
    <section id="documents" className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Documents Required for U.S. Investors
      </h2>
      
      <div className="space-y-6">
        {/* Onboarding Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Onboarding Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These documents are typically required when you invest in a Golden Visa fund as a U.S. person:
            </p>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm text-foreground">{doc.name}</h4>
                      {doc.required ? (
                        <Badge variant="default" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">If Requested</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Purpose:</strong> {doc.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Annual Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Annual Tax Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These documents are needed each year for your U.S. tax filings:
            </p>
            <div className="space-y-3">
              {annualDocuments.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Purpose:</strong> {doc.purpose}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Timing:</strong> {doc.when}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-foreground mb-3">Tips for U.S. Investors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Ask the fund upfront if they provide PFIC Annual Information Statements for QEF elections</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Keep copies of all onboarding documents for your tax advisor</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Request year-end valuations in USD to simplify reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Set calendar reminders for FBAR (April 15) and tax filing deadlines</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default USDocumentsChecklist;
