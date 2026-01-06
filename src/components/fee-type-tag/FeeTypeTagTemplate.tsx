import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Search, GitCompare, Calculator, Calendar, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { FEE_TYPE_CONTENT, FeeTypeSlug } from '@/data/fee-type-content';
import { Fund } from '@/data/types/funds';
import { 
  getFundsWithDisclosedManagementFee,
  getFundsWithDisclosedPerformanceFee,
  getFundsWithSubscriptionFee,
  getFundsWithRedemptionFee,
  getFundsSortedByManagementFee
} from '@/utils/feeFilters';
import { formatMinimumInvestment } from '@/utils/currencyFormatters';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';

interface FeeTypeTagTemplateProps {
  tagSlug: FeeTypeSlug;
  funds: Fund[];
  allFunds: Fund[];
}

const FeeTypeTagTemplate: React.FC<FeeTypeTagTemplateProps> = ({ tagSlug, funds, allFunds }) => {
  const content = FEE_TYPE_CONTENT[tagSlug];
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Get funds relevant to this fee type
  const relevantFunds = useMemo(() => {
    switch (tagSlug) {
      case 'management-fee':
        return getFundsSortedByManagementFee(allFunds);
      case 'performance-fee':
        return getFundsWithDisclosedPerformanceFee(allFunds);
      case 'subscription-fee':
        return getFundsWithSubscriptionFee(allFunds);
      case 'redemption-fee':
      case 'exit-fee':
        return getFundsWithRedemptionFee(allFunds);
      default:
        return funds;
    }
  }, [tagSlug, allFunds, funds]);

  // Get fee value display for a fund
  const getFeeDisplay = (fund: Fund): string => {
    switch (tagSlug) {
      case 'management-fee':
        return fund.managementFee !== null && fund.managementFee !== undefined 
          ? `${fund.managementFee}%` 
          : 'Disclosed';
      case 'performance-fee':
        return fund.performanceFee !== null && fund.performanceFee !== undefined 
          ? `${fund.performanceFee}%` 
          : 'Disclosed';
      case 'subscription-fee':
        return fund.subscriptionFee !== null && fund.subscriptionFee !== undefined 
          ? `${fund.subscriptionFee}%` 
          : 'Disclosed';
      case 'redemption-fee':
      case 'exit-fee':
        return fund.redemptionFee !== null && fund.redemptionFee !== undefined 
          ? `${fund.redemptionFee}%` 
          : 'Disclosed';
      default:
        return 'Disclosed';
    }
  };

  return (
    <>
      <PageSEO 
        pageType="tag" 
        tagName={tagSlug}
        funds={relevantFunds}
      />
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/fees" className="hover:text-foreground">Fees</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{content.title.split(':')[0]}</span>
          </nav>
          
          {/* Hero Section */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Last updated: {lastUpdated}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {relevantFunds.length} funds
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {content.title}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              {content.definition}
            </p>
            
            <p className="text-sm text-muted-foreground/80 mb-8">
              Fee information is based on disclosed sources and may change. This is not investment advice—verify fees and terms in official documents.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/funds">
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse All Funds
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="outline" size="lg" className="gap-2">
                  <GitCompare className="h-4 w-4" />
                  Compare Funds
                </Button>
              </Link>
              <Link to="/fees#estimator">
                <Button size="lg" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  Estimate Total Cost
                </Button>
              </Link>
            </div>
          </header>
          
          {/* How This Fee Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              How {content.title.split(':')[0]} Works
            </h2>
            <div className="prose prose-slate max-w-none">
              <ul className="space-y-3">
                {content.howItWorks.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          
          {/* Fund List */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Funds with Disclosed {content.title.split(':')[0]}
            </h2>
            <p className="text-muted-foreground mb-6">
              {relevantFunds.length} funds have this fee disclosed in their documentation.
            </p>
            
            {relevantFunds.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relevantFunds.slice(0, 12).map((fund) => (
                  <Card key={fund.id} className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/${fund.id}`}
                            className="font-semibold text-foreground hover:text-primary line-clamp-2"
                          >
                            {fund.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {fund.category}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-sm font-mono flex-shrink-0">
                          {getFeeDisplay(fund)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span>Min: {formatMinimumInvestment(fund.minimumInvestment)}</span>
                        {fund.term && (
                          <span>Term: {fund.term} years</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link to={`/${fund.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/compare?funds=${fund.id}`}>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <GitCompare className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  No funds currently have this fee type disclosed.
                </p>
              </div>
            )}
            
            {relevantFunds.length > 12 && (
              <div className="mt-6 text-center">
                <Link to="/funds">
                  <Button variant="outline">
                    View All {relevantFunds.length} Funds
                  </Button>
                </Link>
              </div>
            )}
          </section>
          
          {/* What to Verify */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              What to Verify in the Docs
            </h2>
            <Card className="border-border/60">
              <CardContent className="p-6">
                <ul className="grid md:grid-cols-2 gap-3">
                  {content.verifyChecklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
          
          {/* FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                {content.title.split(':')[0]} FAQs
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              {content.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border/60 rounded-lg px-6 bg-card data-[state=open]:bg-muted/20"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Back to Fees Hub */}
          <div className="text-center py-8 border-t border-border/40">
            <Link to="/fees">
              <Button variant="outline" className="gap-2">
                ← Back to Fees Hub
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
      <FloatingActionButton />
    </>
  );
};

export default FeeTypeTagTemplate;
