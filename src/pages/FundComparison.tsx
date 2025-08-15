
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ComparisonTable from '../components/comparison/ComparisonTable';
import { useComparisonStructuredData } from '../hooks/useComparisonStructuredData';
import { getComparisonBySlug } from '../data/services/comparison-service';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const FundComparison = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Get the comparison data using the slug
  const comparisonData = slug ? getComparisonBySlug(slug) : null;
  
  const comparisonTitle = slug?.replace(/-/g, ' ') || '';
  
  // Add structured data for the comparison
  useComparisonStructuredData(comparisonData ? [comparisonData.fund1, comparisonData.fund2] : [], 'fund-vs-fund');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // If no comparison data found, show error
  if (!comparisonData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PageSEO pageType="404" />
        
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex-1">
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Comparison Not Found</h1>
              <p className="text-gray-600">
                The fund comparison you're looking for could not be found.
              </p>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-comparison" comparisonTitle={comparisonTitle} comparisonSlug={slug} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Fund Comparison: {comparisonData.fund1.name} vs {comparisonData.fund2.name}
          </h1>
          <p className="text-gray-600">Compare the selected funds side by side.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <ComparisonTable funds={[comparisonData.fund1, comparisonData.fund2]} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundComparison;
