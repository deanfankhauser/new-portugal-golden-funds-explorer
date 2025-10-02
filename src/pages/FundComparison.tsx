
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import ComparisonTable from '../components/comparison/ComparisonTable';
import FundComparisonBreadcrumbs from '../components/comparison/FundComparisonBreadcrumbs';
import RelatedComparisons from '../components/comparison/RelatedComparisons';
import FundComparisonFAQ from '../components/comparison/FundComparisonFAQ';
import { getComparisonBySlug } from '../data/services/comparison-service';
import { normalizeComparisonSlug, isCanonicalComparisonSlug } from '../utils/comparisonUtils';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const FundComparison = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Check if slug needs canonicalization (redirect to normalized version)
  if (slug && !isCanonicalComparisonSlug(slug)) {
    const normalizedSlug = normalizeComparisonSlug(slug);
    return <Navigate to={`/compare/${normalizedSlug}`} replace />;
  }
  
  // Get the comparison data using the slug
  const comparisonData = slug ? getComparisonBySlug(slug) : null;
  
  const comparisonTitle = slug?.replace(/-/g, ' ') || '';
  
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
        <FundComparisonBreadcrumbs fund1={comparisonData.fund1} fund2={comparisonData.fund2} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {comparisonData.fund1.name} vs {comparisonData.fund2.name}: Portugal Golden Visa Fund Comparison
          </h1>
          <h2 className="text-xl text-gray-700 mb-4 font-medium">
            Compare Investment Fees, Minimum Investment, and Performance Metrics
          </h2>
          <p className="text-gray-600">
            Detailed side-by-side analysis of {comparisonData.fund1.name} (managed by {comparisonData.fund1.managerName}) 
            and {comparisonData.fund2.name} (managed by {comparisonData.fund2.managerName}) 
            Portugal Golden Visa investment funds.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <ComparisonTable funds={[comparisonData.fund1, comparisonData.fund2]} />
        </div>

        <RelatedComparisons 
          currentFund1={comparisonData.fund1} 
          currentFund2={comparisonData.fund2} 
        />

        <FundComparisonFAQ 
          fund1={comparisonData.fund1} 
          fund2={comparisonData.fund2} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default FundComparison;
