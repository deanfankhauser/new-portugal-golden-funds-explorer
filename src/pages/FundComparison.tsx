import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundComparisonContent from '../components/fund-comparison/FundComparisonContent';
import { useComparisonStructuredData } from '../hooks/useComparisonStructuredData';
import { getFundsByIds } from '../data/funds';

const FundComparison = () => {
  const { slug } = useParams<{ slug: string }>();
  const comparisonTitle = slug?.replace(/-/g, ' ') || '';
  
  // Extract fund IDs from the slug if it contains them
  const fundIds = slug?.includes('vs') 
    ? slug.split('vs').map(id => id.trim())
    : [];
  
  // Get the funds being compared
  const fundsToCompare = getFundsByIds(fundIds);
  
  // Add structured data for the comparison
  useComparisonStructuredData(fundsToCompare, 'fund-vs-fund');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="fund-comparison" comparisonTitle={comparisonTitle} />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <FundComparisonContent 
          slug={slug || ''} 
          comparisonTitle={comparisonTitle}
          fundsToCompare={fundsToCompare}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default FundComparison;
