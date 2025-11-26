
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { useComparison } from '../contexts/ComparisonContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import EmptyComparison from '../components/comparison/EmptyComparison';
import ComparisonBreadcrumbs from '../components/comparison/ComparisonBreadcrumbs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Share2, Check, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { exportComparisonToPDF } from '@/utils/comparisonPdfExport';

const ComparisonPage = () => {
  const { compareFunds, clearComparison, loadFundsFromIds } = useComparison();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="comparison" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <ComparisonBreadcrumbs />
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Compare Portugal Golden Visa Investment Funds</h1>
            <div className="flex items-center gap-4">
              {compareFunds.length > 1 && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="highlight-mode"
                    checked={highlightDifferences}
                    onCheckedChange={setHighlightDifferences}
                  />
                  <Label htmlFor="highlight-mode" className="text-sm cursor-pointer">
                    Highlight Differences
                  </Label>
                </div>
              )}
              {compareFunds.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
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
                    variant="destructive"
                    size="sm"
                    onClick={clearComparison}
                  >
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            {compareFunds.length > 0 
              ? `Comparing ${compareFunds.length} selected funds side by side.`
              : 'Select funds to compare from the fund listings.'
            }
          </p>
          
          {compareFunds.length === 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">How to Compare Portugal Golden Visa Investment Funds</h2>
              <p className="text-muted-foreground mb-4">
                Our comprehensive fund comparison tool helps you analyze Portugal Golden Visa investment funds side-by-side. 
                Compare key metrics including minimum investment requirements, management fees, target returns, risk profiles, 
                and fund performance to make informed investment decisions.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-medium mb-2">Key Comparison Metrics:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum investment amounts</li>
                    <li>Management and performance fees</li>
                    <li>Expected returns and risk levels</li>
                    <li>Geographic allocation strategies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Investment Categories:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Capital Risk Funds</li>
                    <li>Mixed Investment Strategies</li>
                    <li>Specialized Sector Funds</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {compareFunds.length > 0 ? (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <ComparisonTable funds={compareFunds} highlightDifferences={highlightDifferences} />
          </div>
        ) : (
          <EmptyComparison />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
