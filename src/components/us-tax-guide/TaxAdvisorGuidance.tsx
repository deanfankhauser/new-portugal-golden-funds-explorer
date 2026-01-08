import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, HelpCircle, MessageSquare, Scale, Users } from 'lucide-react';

export const TaxAdvisorGuidance: React.FC = () => {
  const questionsForTaxAdvisor = [
    "Should I make a QEF election for this fund, and if so, when?",
    "What are the projected tax implications if the fund doesn't provide a PFIC Annual Information Statement?",
    "How should I handle currency conversions for Form 8621 and Form 8938?",
    "Do I need to file FBAR for this investment?",
    "Are there any state tax implications I should be aware of?",
    "How do I handle the investment if I become a non-resident during the holding period?",
    "What documentation do I need to keep for IRS audit purposes?",
    "How does this investment affect my estimated tax payments?",
  ];

  const questionsForImmigrationLawyer = [
    "Is this specific fund eligible for the Golden Visa €500k investment route?",
    "What proof-of-investment documents will you need for my application?",
    "How should the subscription documents reference the Golden Visa program?",
    "What happens if the fund exits or returns capital before I get permanent residency?",
    "Can I use funds from my IRA or 401(k) for this investment?",
    "What are the timelines for investment → application → approval?",
  ];

  const questionsForFundManager = [
    "Do you provide a PFIC Annual Information Statement to support QEF elections?",
    "What is your FATCA classification and GIIN?",
    "Can you provide year-end valuations in USD?",
    "What is your process for onboarding U.S. persons?",
    "How do you handle distributions and K-1 equivalents for U.S. investors?",
    "What happens at fund maturity—do you provide exit documentation?",
  ];

  return (
    <section id="advisors" className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Working With Your Professional Advisors
      </h2>
      
      <div className="space-y-6">
        {/* Why You Need Professional Advice */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Why Professional Advice is Essential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Investing in Portugal Golden Visa funds as a U.S. citizen involves overlapping legal and tax 
              regimes. Getting it wrong can result in:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Punitive PFIC tax treatment (effective rates over 50%)</li>
              <li>Penalties for late or incorrect FBAR/Form 8938 filings</li>
              <li>Golden Visa application rejection due to improper investment structure</li>
              <li>Unexpected tax bills when you haven't received cash distributions</li>
            </ul>
            <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-4">
              <strong>Investment in professional advice upfront is typically far less than the cost of 
              fixing mistakes later.</strong>
            </p>
          </CardContent>
        </Card>

        {/* Your Advisory Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Advisory Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Portuguese Immigration Lawyer</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Confirms Golden Visa eligibility, prepares application, coordinates with fund manager.
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">Immigration + Eligibility</Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">U.S. Tax Advisor</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Handles PFIC elections, annual filings (Form 8621, 8938, FBAR), and tax planning.
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">Tax + Compliance</Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Financial Advisor</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Assesses suitability, risk, liquidity needs, and how this fits your overall portfolio.
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">Suitability + Planning</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions for Tax Advisor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Questions for Your U.S. Tax Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {questionsForTaxAdvisor.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Questions for Immigration Lawyer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Questions for Your Portuguese Immigration Lawyer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {questionsForImmigrationLawyer.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Questions for Fund Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Questions for the Fund Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {questionsForFundManager.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-foreground mb-3">When to Consult</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Badge variant="default" className="flex-shrink-0">Before Investing</Badge>
                <span>Get tax and immigration advice before you commit funds. This is when you have the most flexibility.</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="flex-shrink-0">After Subscription</Badge>
                <span>Confirm QEF election timing with your tax advisor. Some elections must be made with your first tax return for the investment.</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="flex-shrink-0">Annually</Badge>
                <span>Provide your tax advisor with year-end statements, PFIC AIS, and distribution notices for filing.</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="flex-shrink-0">At Exit</Badge>
                <span>Consult before the fund exits or you redeem. The tax treatment of gains depends on elections you've made.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TaxAdvisorGuidance;
