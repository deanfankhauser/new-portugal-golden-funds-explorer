import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, FileText, Users } from 'lucide-react';
import { getUSTaxGuideSeo } from '@/lib/seo/pages/us-tax-guide';
import PFICExplainer from '@/components/us-tax-guide/PFICExplainer';
import FATCAExplainer from '@/components/us-tax-guide/FATCAExplainer';
import USDocumentsChecklist from '@/components/us-tax-guide/USDocumentsChecklist';
import TaxAdvisorGuidance from '@/components/us-tax-guide/TaxAdvisorGuidance';
import USTaxGuideFAQ from '@/components/us-tax-guide/USTaxGuideFAQ';
import PFICCalculator from '@/components/us-tax-guide/PFICCalculator';

// Breadcrumbs component
const Breadcrumbs: React.FC = () => (
  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
    <ChevronRight className="h-4 w-4" />
    <Link to="/funds/us-citizens" className="hover:text-primary transition-colors">For US Citizens</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="text-foreground font-medium">PFIC & FATCA Guide</span>
  </nav>
);

// Table of Contents
const TableOfContents: React.FC = () => {
  const sections = [
    { id: 'pfic', label: 'Understanding PFIC' },
    { id: 'calculator', label: 'Tax Impact Calculator' },
    { id: 'fatca', label: 'Understanding FATCA' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'advisors', label: 'Working With Advisors' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <Card className="sticky top-24">
      <CardContent className="pt-6">
        <h3 className="font-medium text-sm text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          On this page
        </h3>
        <nav className="space-y-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-border mt-4 pt-4">
          <Link to="/funds/us-citizens">
            <Button variant="outline" size="sm" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to US Funds
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const USInvestorTaxGuide: React.FC = () => {
  const seoData = getUSTaxGuideSeo();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.url} />
        <meta name="robots" content="index, follow" />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords.join(', ')} />}
        {seoData.structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.structuredData)}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-xs">Educational Guide</Badge>
            <Badge className="bg-primary/10 text-primary text-xs">For US Investors</Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            PFIC & FATCA Guide for US Investors
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            A comprehensive guide to understanding the U.S. tax implications of investing in 
            Portugal Golden Visa funds, including PFIC classification, FATCA reporting requirements, 
            and how to work with professional advisors.
          </p>

          {/* Top Disclaimer */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    This is educational information only—not tax advice
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tax laws change frequently and their application depends on individual circumstances. 
                    Always consult a qualified U.S. tax professional before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-16 max-w-4xl">
            <PFICExplainer />
            <PFICCalculator />
            <FATCAExplainer />
            <USDocumentsChecklist />
            <TaxAdvisorGuidance />
            <USTaxGuideFAQ />

            {/* Bottom CTA */}
            <section className="border-t border-border pt-12">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Ready to explore US-eligible funds?
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                      Browse Portugal Golden Visa investment funds that accept U.S. persons, 
                      with eligibility notes and sources where available.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/funds/us-citizens">
                        <Button size="lg" className="gap-2">
                          <Users className="h-4 w-4" />
                          View US-Eligible Funds
                        </Button>
                      </Link>
                      <Link to="/ira-401k-eligible-funds">
                        <Button variant="outline" size="lg" className="gap-2">
                          <FileText className="h-4 w-4" />
                          IRA-Eligible Funds
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Bottom Disclaimer */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong className="text-amber-700 dark:text-amber-300">Disclaimer:</strong> This guide 
                      provides general educational information about U.S. tax rules as they may apply to 
                      investments in foreign funds. It does not constitute tax, legal, or investment advice.
                    </p>
                    <p>
                      Tax laws are complex and change frequently. The application of PFIC, FATCA, and other 
                      rules depends on your specific circumstances, the fund structure, and current regulations. 
                      Always work with qualified professionals before making investment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default USInvestorTaxGuide;
