import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const PFICExplainer: React.FC = () => {
  return (
    <section id="pfic" className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Understanding PFIC (Passive Foreign Investment Company)
      </h2>
      
      <div className="space-y-6">
        {/* What is PFIC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              What is PFIC?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A <strong>Passive Foreign Investment Company (PFIC)</strong> is a U.S. tax classification 
              that applies to most non-U.S. pooled investment vehicles, including many Portugal Golden Visa funds.
            </p>
            <p className="text-muted-foreground">
              A foreign corporation is a PFIC if it meets either the <strong>income test</strong> (75%+ of gross 
              income is passive) or the <strong>asset test</strong> (50%+ of assets produce passive income). 
              Most Golden Visa funds qualify as PFICs under these tests.
            </p>
          </CardContent>
        </Card>

        {/* Default Tax Treatment */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Default PFIC Tax Treatment ("Excess Distribution Regime")
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Without making an election, U.S. shareholders are subject to the <strong>excess distribution regime</strong>, 
              which can result in punitive tax treatment:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Gains and "excess distributions" are spread over the holding period</li>
              <li>Each year's allocation is taxed at the <strong>highest ordinary income rate</strong> for that year</li>
              <li>An <strong>interest charge</strong> is added for the "deferred" tax</li>
              <li>Long-term capital gains rates do <strong>not</strong> apply</li>
            </ul>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-destructive font-medium">
                This can result in effective tax rates exceeding 50% in some cases. Most U.S. investors 
                prefer to make an election to avoid this regime.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QEF Election */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              QEF Election (Qualified Electing Fund)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A <strong>Qualified Electing Fund (QEF)</strong> election allows U.S. shareholders to be taxed 
              currently on their pro-rata share of the fund's ordinary earnings and net capital gains—similar 
              to how a U.S. mutual fund is taxed.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Capital gains taxed at long-term rates</li>
                  <li>No interest charge</li>
                  <li>More predictable tax treatment</li>
                  <li>Basis increases with income inclusions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Fund must provide annual PFIC Annual Information Statement</li>
                  <li>Must file Form 8621 annually</li>
                  <li>Must include income even if not distributed</li>
                  <li>Election must be made timely</li>
                </ul>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Many Golden Visa funds now provide the PFIC Annual Information Statement to support QEF elections. 
                Ask the fund manager before investing if this is available.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mark-to-Market Election */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Mark-to-Market (MTM) Election
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The <strong>Mark-to-Market election</strong> is an alternative to QEF that treats the investment 
              as if it were sold at fair market value at year-end.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">When it applies</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>PFIC shares must be "marketable stock"</li>
                  <li>Typically requires trading on a qualified exchange</li>
                  <li>Most private Golden Visa funds don't qualify</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Tax Treatment</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Annual gains taxed as ordinary income</li>
                  <li>Losses deductible (with limits)</li>
                  <li>No interest charge</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Note:</strong> Because most Golden Visa funds are private and not publicly traded, 
              the MTM election is usually not available. QEF is typically the preferred approach.
            </p>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>PFIC Tax Treatment Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                    <th className="text-left py-3 px-4 font-semibold">Default (Excess Distribution)</th>
                    <th className="text-left py-3 px-4 font-semibold">QEF Election</th>
                    <th className="text-left py-3 px-4 font-semibold">Mark-to-Market</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Tax Rate</td>
                    <td className="py-3 px-4">
                      <Badge variant="destructive" className="text-xs">Highest ordinary rates</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 text-xs">Capital gains rates available</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">Ordinary income</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Interest Charge</td>
                    <td className="py-3 px-4"><XCircle className="h-4 w-4 text-destructive" /></td>
                    <td className="py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                    <td className="py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Fund Must Provide Info</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">Yes (PFIC AIS)</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Available for Private Funds</td>
                    <td className="py-3 px-4">Yes</td>
                    <td className="py-3 px-4">Yes (if fund cooperates)</td>
                    <td className="py-3 px-4">Usually No</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Annual Filing</td>
                    <td className="py-3 px-4">Form 8621</td>
                    <td className="py-3 px-4">Form 8621</td>
                    <td className="py-3 px-4">Form 8621</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PFICExplainer;
