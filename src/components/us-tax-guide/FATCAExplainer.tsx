import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Globe, Info } from 'lucide-react';

export const FATCAExplainer: React.FC = () => {
  return (
    <section id="fatca" className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Understanding FATCA (Foreign Account Tax Compliance Act)
      </h2>
      
      <div className="space-y-6">
        {/* What is FATCA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              What is FATCA?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The <strong>Foreign Account Tax Compliance Act (FATCA)</strong> is a U.S. law enacted in 2010 
              that requires foreign financial institutions (FFIs) to report information about accounts held 
              by U.S. persons to the IRS.
            </p>
            <p className="text-muted-foreground">
              FATCA's goal is to prevent tax evasion by U.S. citizens using offshore accounts. It affects 
              Golden Visa fund investments in two ways: how funds handle U.S. investors, and what reporting 
              obligations U.S. investors have.
            </p>
          </CardContent>
        </Card>

        {/* How FATCA Affects Golden Visa Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              How FATCA Affects Golden Visa Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              FATCA creates compliance obligations for fund managers that accept U.S. investors:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-foreground mb-2">FFI Classification</h4>
                <p className="text-sm text-muted-foreground">
                  Fund managers must register with the IRS as a Foreign Financial Institution (FFI) and 
                  obtain a Global Intermediary Identification Number (GIIN).
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-foreground mb-2">Due Diligence</h4>
                <p className="text-sm text-muted-foreground">
                  Funds must identify U.S. account holders through self-certification forms and 
                  documentary evidence.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-foreground mb-2">Reporting</h4>
                <p className="text-sm text-muted-foreground">
                  Account information (balance, income, gains) must be reported annually to the IRS 
                  or local tax authority under an intergovernmental agreement.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-foreground mb-2">Why Some Funds Decline</h4>
                <p className="text-sm text-muted-foreground">
                  The compliance burden leads some fund managers to simply not accept U.S. persons, 
                  rather than set up the required infrastructure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investor Reporting Obligations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your Reporting Obligations as a U.S. Investor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              As a U.S. person investing in foreign funds, you have independent reporting obligations:
            </p>
            
            <div className="space-y-4 mt-4">
              {/* Form 8938 */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">Form 8938 (FATCA Form)</h4>
                  <Badge variant="secondary">Filed with Tax Return</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Statement of Specified Foreign Financial Assets. Required if your foreign financial assets 
                  exceed certain thresholds.
                </p>
                <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  <strong>Thresholds (unmarried, living in US):</strong> $50,000 on last day of year, or 
                  $75,000 at any time during the year. Higher thresholds for married filing jointly and 
                  those living abroad.
                </div>
              </div>

              {/* FBAR */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">FBAR (FinCEN Form 114)</h4>
                  <Badge variant="secondary">Filed Separately</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Report of Foreign Bank and Financial Accounts. Required if the aggregate value of your 
                  foreign financial accounts exceeds $10,000 at any time during the year.
                </p>
                <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  <strong>Note:</strong> Filed electronically with FinCEN (not the IRS) by April 15, with 
                  automatic extension to October 15. Fund investments may count as "accounts" for FBAR purposes.
                </div>
              </div>

              {/* Form 8621 */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">Form 8621 (PFIC Form)</h4>
                  <Badge variant="secondary">Filed with Tax Return</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Information Return by a Shareholder of a PFIC. Required annually for each PFIC you own, 
                  regardless of whether you made any elections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Differences */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              FBAR vs. Form 8938: Key Differences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                    <th className="text-left py-3 px-4 font-semibold">FBAR</th>
                    <th className="text-left py-3 px-4 font-semibold">Form 8938</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Filed With</td>
                    <td className="py-3 px-4">FinCEN (Treasury)</td>
                    <td className="py-3 px-4">IRS (with tax return)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Threshold</td>
                    <td className="py-3 px-4">$10,000 aggregate</td>
                    <td className="py-3 px-4">$50,000+ (varies)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Covers</td>
                    <td className="py-3 px-4">Foreign accounts</td>
                    <td className="py-3 px-4">Foreign financial assets (broader)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Penalties</td>
                    <td className="py-3 px-4">Up to $12,500+ per violation</td>
                    <td className="py-3 px-4">Up to $10,000+ per form</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Filing Deadline</td>
                    <td className="py-3 px-4">April 15 (auto-ext to Oct 15)</td>
                    <td className="py-3 px-4">With tax return</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Important:</strong> You may need to file both FBAR and Form 8938—they are not 
              mutually exclusive and serve different purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FATCAExplainer;
