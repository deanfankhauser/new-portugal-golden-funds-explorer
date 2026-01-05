
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { useComparison } from '../contexts/ComparisonContext';
import MultiComparisonTable from '../components/comparison/MultiComparisonTable';
import ComparisonFundHeader from '../components/comparison/ComparisonFundHeader';
import EmptyComparison from '../components/comparison/EmptyComparison';
import ComparisonBreadcrumbs from '../components/comparison/ComparisonBreadcrumbs';
import PopularComparisonsSection from '../components/comparison/PopularComparisonsSection';
import { Button } from '@/components/ui/button';
import { Share2, Check, Download, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { exportComparisonToPDF } from '@/utils/comparisonPdfExport';
import { generateComparisonsFromFunds } from '@/data/services/comparison-service';
import type { Fund } from '@/data/types/funds';

interface ComparisonPageProps {
  initialFunds?: Fund[];
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ initialFunds }) => {
  const { compareFunds, clearComparison, loadFundsFromIds } = useComparison();
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Load funds from URL on mount
  useEffect(() => {
    const fundIds = searchParams.get('funds');
    if (fundIds && fundIds.trim()) {
      const ids = fundIds.split(',').map(id => id.trim()).filter(Boolean);
      if (ids.length > 0) {
        loadFundsFromIds(ids);
      }
    }
  }, []);

  // Update URL when comparison changes
  useEffect(() => {
    if (compareFunds.length > 0) {
      const fundIds = compareFunds.map(f => f.id).join(',');
      setSearchParams({ funds: fundIds }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [compareFunds, setSearchParams]);

  const handleShare = async () => {
    const fundIds = compareFunds.map(f => f.id).join(',');
    const shareUrl = `${window.location.origin}/compare?funds=${fundIds}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Shareable comparison link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually from the address bar.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      exportComparisonToPDF(compareFunds);
      toast({
        title: "PDF generated!",
        description: "Your fund comparison has been downloaded.",
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast({
        title: "Export failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate dynamic title based on selected funds
  const getPageTitle = () => {
    if (compareFunds.length === 0) {
      return 'Compare Portugal Golden Visa Investment Funds';
    }
    if (compareFunds.length === 2) {
      return `${compareFunds[0].name} vs ${compareFunds[1].name}`;
    }
    return `Compare ${compareFunds.length} Golden Visa Funds`;
  };

  const getSubtitle = () => {
    if (compareFunds.length === 0) {
      return 'Select funds from our directory to compare side-by-side.';
    }
    return `Comparing ${compareFunds.map(f => f.name).join(', ')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <ComparisonBreadcrumbs />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {getPageTitle()}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {getSubtitle()}
              </p>
            </div>
            
            {/* Action buttons */}
            {compareFunds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span> PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearComparison}
                  className="gap-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>

        {compareFunds.length > 0 ? (
          <div className="space-y-6">
            {/* Fund Cards Header */}
            <ComparisonFundHeader funds={compareFunds} maxFunds={3} />
            
            {/* Comparison Table */}
            <MultiComparisonTable funds={compareFunds} />
            
            {/* CTA Section */}
            <div className="bg-muted/30 rounded-xl border border-border p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Need help deciding?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our fund experts can help you understand the differences and find the right fit.
              </p>
              <Button asChild>
                <Link to="/contact">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* How to compare section for empty state */}
            <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-3">How to Compare Funds</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Our comparison tool helps you analyze Portugal Golden Visa investment funds side-by-side. 
                Compare minimum investments, fees, returns, and more.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium">Browse Funds</p>
                    <p className="text-muted-foreground text-xs">Explore our directory of verified funds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium">Add to Compare</p>
                    <p className="text-muted-foreground text-xs">Click "Compare" on up to 3 funds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium">Analyze & Decide</p>
                    <p className="text-muted-foreground text-xs">Review metrics and export your comparison</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular comparisons for SSR */}
            {initialFunds && initialFunds.length > 0 && (
              <PopularComparisonsSection 
                comparisons={generateComparisonsFromFunds(initialFunds).slice(0, 20)} 
              />
            )}
            
            <EmptyComparison />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
