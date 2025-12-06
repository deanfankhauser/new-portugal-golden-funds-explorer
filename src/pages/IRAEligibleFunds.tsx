import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSEO } from '@/components/common/PageSEO';
import { Loader2, Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import FundCard from '@/components/FundCard';
import { useQEFEligibleFunds } from '@/hooks/useQEFEligibleFunds';
import { Card, CardContent } from '@/components/ui/card';

export const IRAEligibleFunds: React.FC = () => {
  const { data: funds, isLoading } = useQEFEligibleFunds();

  return (
    <div className="min-h-screen bg-background">
      <PageSEO pageType="ira-401k-eligible" />
      
      <Helmet>
        <link rel="canonical" href="https://funds.movingto.com/ira-401k-eligible-funds" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary">US Tax-Advantaged Investing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              IRA & 401k Eligible Portugal Golden Visa Funds
            </h1>
            <p className="text-xl text-muted-foreground">
              Invest in Portugal Golden Visa funds through your retirement accounts with QEF election for favorable US tax treatment and simplified reporting.
            </p>
          </div>
        </div>
      </div>

      {/* PFIC Explanation Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* What is PFIC */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">Understanding PFIC Taxation</h2>
                  <p className="text-muted-foreground mb-4">
                    Passive Foreign Investment Companies (PFICs) are foreign investment funds that US taxpayers must report under complex IRS rules. Without proper elections, PFIC investments face punitive tax rates and extensive reporting requirements.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium">Default PFIC treatment includes:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Ordinary income tax rates (up to 37%) on all gains</li>
                      <li>• Interest charges on deferred tax liability</li>
                      <li>• Complex Form 8621 filing for each fund annually</li>
                      <li>• No capital gains treatment or qualified dividend rates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QEF Benefits */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">Benefits of QEF-Eligible Funds</h2>
                  <p className="text-muted-foreground mb-4">
                    A Qualified Electing Fund (QEF) election allows US investors to treat foreign fund income similarly to US mutual funds, dramatically simplifying tax reporting and reducing tax burden.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Capital Gains Treatment</p>
                        <p className="text-xs text-muted-foreground">Long-term gains taxed at preferential 15-20% rates instead of 37%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">No Interest Charges</p>
                        <p className="text-xs text-muted-foreground">Eliminate complex interest calculations on deferred gains</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Simplified Reporting</p>
                        <p className="text-xs text-muted-foreground">Streamlined Form 8621 filing with annual income statements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">IRA/401k Compatible</p>
                        <p className="text-xs text-muted-foreground">Suitable for tax-deferred retirement accounts with proper structure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">How QEF Election Works</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</div>
                  <div>
                    <p className="font-medium mb-1">Fund Provides Annual PFIC Statement</p>
                    <p className="text-sm text-muted-foreground">QEF-eligible funds issue detailed statements showing your proportionate share of ordinary income and capital gains.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</div>
                  <div>
                    <p className="font-medium mb-1">Make QEF Election on Form 8621</p>
                    <p className="text-sm text-muted-foreground">File Form 8621 with your tax return in the first year of investment to elect QEF treatment going forward.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</div>
                  <div>
                    <p className="font-medium mb-1">Report Income Annually</p>
                    <p className="text-sm text-muted-foreground">Include your share of fund income on your tax return each year, whether distributed or not (similar to US partnerships).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">4</div>
                  <div>
                    <p className="font-medium mb-1">Enjoy Tax Benefits</p>
                    <p className="text-sm text-muted-foreground">Capital gains receive preferential tax rates, and no interest charges apply on distributions or redemptions.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> Consult with a tax advisor experienced in PFIC reporting before making QEF elections. The election is generally irrevocable and requires careful planning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QEF-Eligible Funds Listing */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">QEF-Eligible Portugal Golden Visa Funds</h2>
              <p className="text-muted-foreground">
                {funds?.length || 0} fund{funds?.length !== 1 ? 's' : ''} available with QEF election support for US retirement accounts
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : funds && funds.length > 0 ? (
              <div className="grid gap-6">
                {funds.map((fund) => (
                  <FundCard key={fund.id} fund={fund} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No QEF-eligible funds currently available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Tax Disclaimer:</strong> This information is for educational purposes only and does not constitute tax advice. PFIC taxation is complex and varies based on individual circumstances. Always consult with a qualified tax professional experienced in international tax matters before making investment decisions or QEF elections.
            </p>
            <p>
              <strong>Investment Disclaimer:</strong> Past performance does not guarantee future results. All investments carry risk, including possible loss of principal. Review each fund's offering documents carefully before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IRAEligibleFunds;
