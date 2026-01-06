import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import FeeTypeTagTemplate from '../components/fee-type-tag/FeeTypeTagTemplate';
import NotFound from './NotFound';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import { isFeeTypeSlug, FeeTypeSlug } from '../data/fee-type-content';
import { Fund } from '../data/types/funds';
import FundListSkeleton from '../components/common/FundListSkeleton';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FeeTypePageProps {
  initialFunds?: Fund[];
  feeTypeSlug?: FeeTypeSlug;
}

const FeeTypePage: React.FC<FeeTypePageProps> = ({ initialFunds, feeTypeSlug: ssrFeeTypeSlug }) => {
  const { feeType } = useParams<{ feeType: string }>();
  const { funds: allFunds, loading } = useRealTimeFunds({ initialData: initialFunds });
  
  // Use SSR slug if provided, otherwise use URL param
  const feeTypeSlug = ssrFeeTypeSlug || feeType;

  // Show loading state only when no initial data
  if (loading && !initialFunds) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <FundListSkeleton count={6} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Validate fee type slug
  if (!feeTypeSlug || !isFeeTypeSlug(feeTypeSlug)) {
    return <NotFound />;
  }

  return (
    <FeeTypeTagTemplate 
      tagSlug={feeTypeSlug}
      funds={allFunds || []}
      allFunds={allFunds || []}
    />
  );
};

export default FeeTypePage;
